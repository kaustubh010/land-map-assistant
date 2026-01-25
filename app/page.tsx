"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { SearchBar } from "@/components/SearchBar";
import { ParcelDetails } from "@/components/ParcelDetails";
import { StatsSummary } from "@/components/StatsSummary";
import { Legend } from "@/components/Legend";
import { ParcelMatchResult } from "@/lib/matching";
import { MapPin, Database, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { ParcelEditDialog } from "@/components/ParcelEditDialog";
import { landRecords, LandRecord } from "@/data/records";

// ✅ Correct dynamic import (no destructuring)
const ParcelMap = dynamic(() => import("@/components/ParcelMap"), {
  ssr: false,
});

const Home = () => {
  // State for currently searched plot ID
  const [searchedPlotId, setSearchedPlotId] = useState<string | null>(null);
  // State for selected parcel details
  const [selectedParcel, setSelectedParcel] =
    useState<ParcelMatchResult | null>(null);
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // State for editable records (session-based persistence)
  const [records, setRecords] = useState<LandRecord[]>([...landRecords]);
  // Force re-render key for map when records change
  const [recordsVersion, setRecordsVersion] = useState(0);

  const handleSearch = (plotId: string | null) => {
    setSearchedPlotId(plotId);
  };

  const handleParcelClick = (result: ParcelMatchResult) => {
    setSelectedParcel(result);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditSave = useCallback(
    (
      editedParcel: ParcelMatchResult,
      recordUpdates: { area_record: number; owner_name_record: string },
    ) => {
      // Update the records array
      setRecords((prevRecords) => {
        const existingIndex = prevRecords.findIndex(
          (r) => r.plot_id === editedParcel.plot_id,
        );

        if (existingIndex >= 0) {
          // Update existing record
          const updated = [...prevRecords];
          updated[existingIndex] = {
            ...updated[existingIndex],
            area_record: recordUpdates.area_record,
            owner_name: recordUpdates.owner_name_record,
          };
          return updated;
        } else {
          // Add new record if it didn't exist
          return [
            ...prevRecords,
            {
              plot_id: editedParcel.plot_id,
              area_record: recordUpdates.area_record,
              owner_name: recordUpdates.owner_name_record,
            },
          ];
        }
      });

      // Update the selected parcel with new data
      setSelectedParcel(editedParcel);

      // Increment version to trigger map re-render
      setRecordsVersion((v) => v + 1);

      toast.success("Record updated successfully!", {
        description: `Changes saved for ${editedParcel.plot_id}`,
      });
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Land Record Digitization Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Village Parcel Verification System
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-full lg:w-96 bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
          {/* Search */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Database className="h-4 w-4" />
              Search Parcels
            </h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Statistics Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Verification Summary
            </h2>
            <StatsSummary records={records} key={recordsVersion} />
          </div>

          {/* Selected Parcel Details */}
          <ParcelDetails
            parcel={selectedParcel}
            onEditClick={selectedParcel ? handleEditClick : undefined}
          />

          {/* Legend */}
          <div className="pt-2 border-t border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Map Legend
            </h2>
            <Legend />
          </div>
        </aside>

        {/* Map Container */}
        <section className="flex-1 p-4">
          <div className="h-full rounded-lg overflow-hidden border border-border shadow-sm">
            <ParcelMap
              searchedPlotId={searchedPlotId}
              onParcelClick={handleParcelClick}
              records={records}
              key={recordsVersion}
            />
          </div>
        </section>
      </main>

      {/* Edit Dialog */}
      <ParcelEditDialog
        parcel={selectedParcel}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default Home;
