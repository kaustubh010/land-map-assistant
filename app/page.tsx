"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SearchBar } from "@/components/SearchBar";
import { ParcelDetails } from "@/components/ParcelDetails";
import { StatsSummary } from "@/components/StatsSummary";
import { Legend } from "@/components/Legend";
import { ParcelMatchResult } from "@/lib/matching";
import { MapPin, Database, FileCheck } from "lucide-react";

// ✅ Correct dynamic import (no destructuring)
const ParcelMap = dynamic(
  () => import("@/components/ParcelMap"),
  { ssr: false }
);

const Home = () => {
  // State for currently searched plot ID
  const [searchedPlotId, setSearchedPlotId] = useState<string | null>(null);
  // State for selected parcel details
  const [selectedParcel, setSelectedParcel] = useState<ParcelMatchResult | null>(null);

  const handleSearch = (plotId: string | null) => {
    setSearchedPlotId(plotId);
  };

  const handleParcelClick = (result: ParcelMatchResult) => {
    setSelectedParcel(result);
  };

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
            <StatsSummary />
          </div>

          {/* Selected Parcel Details */}
          <ParcelDetails parcel={selectedParcel} />

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
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
