"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { SearchBar } from "@/components/SearchBar";
import { ParcelDetails } from "@/components/ParcelDetails";
import { StatsSummary } from "@/components/StatsSummary";
import { Legend } from "@/components/Legend";
import { matchParcel, ParcelMatchResult } from "@/lib/matching";
import { MapPin, Database, FileCheck, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ParcelEditDialog } from "@/components/ParcelEditDialog";
import { landRecords, LandRecord } from "@/data/records";
import { useRouter } from "next/navigation";

const ParcelMap = dynamic(() => import("@/components/ParcelMap"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();
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
      setSelectedParcel(
        matchParcel(editedParcel, [
          ...records.map((r) =>
            r.plot_id === editedParcel.plot_id
              ? {
                  ...r,
                  area_record: recordUpdates.area_record,
                  owner_name: recordUpdates.owner_name_record,
                }
              : r,
          ),
        ]),
      );

      // Increment version to trigger map re-render
      setRecordsVersion((v) => v + 1);

      toast({
        title: "Record updated successfully!",
        description: `Changes saved for ${editedParcel.plot_id}`,
      });
    },
    [],
  );

  return (
    <div className="bg-background">
      {/* Main Content */}
      <main className="flex flex-col lg:flex-row h-[calc(100vh-65px)] sm:h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-full lg:w-96 bg-card border-r border-border p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[40vh] lg:max-h-full">
          {/* Search */}
          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Search Parcels
            </h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Statistics Summary */}
          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
            <h2 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">
              Map Legend
            </h2>
            <Legend />
          </div>
        </aside>

        {/* Map Container */}
        <section className="flex-1 p-2 sm:p-4 min-h-[50vh] lg:min-h-0">
          <div className="h-full rounded-lg overflow-hidden border border-border shadow-sm">
            <ParcelMap
              searchedPlotId={searchedPlotId}
              onParcelClick={handleParcelClick}
              onSearchComplete={() => setSearchedPlotId(null)}
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
