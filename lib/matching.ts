// Matching logic for comparing map parcels with official records
// Implements discrepancy detection based on area tolerance

import { ParcelProperties } from "@/data/parcels";
import { LandRecord, landRecords } from "@/data/records";

export type MatchStatus = "matched" | "mismatch" | "missing";

export interface ParcelMatchResult {
  plot_id: string;
  area_map: number;
  area_record?: number;
  owner_name_map?: string;
  owner_name_record?: string;
  status: MatchStatus;
  areaDifference?: number; // Percentage difference
}

// Tolerance threshold for area comparison (5%)
const AREA_TOLERANCE_PERCENT = 5;

/**
 * Calculate percentage difference between two areas
 * Returns absolute percentage difference
 */
function calculateAreaDifference(areaMap: number, areaRecord: number): number {
  const avgArea = (areaMap + areaRecord) / 2;
  return Math.abs((areaMap - areaRecord) / avgArea) * 100;
}

/**
 * Match a single parcel from map data against land records
 * Returns match result with status and any discrepancy details
 * @param parcelProps - Properties from the map parcel
 * @param records - Optional custom records array (defaults to landRecords)
 */
export function matchParcel(parcelProps: ParcelProperties, records: LandRecord[] = landRecords): ParcelMatchResult {
  const { plot_id, area_map, owner_name_map } = parcelProps;
  
  // Find matching record by plot_id
  const record = records.find(r => r.plot_id === plot_id);
  
  // Case 1: No matching record found - Missing
  if (!record) {
    return {
      plot_id,
      area_map,
      owner_name_map,
      status: "missing"
    };
  }
  
  // Case 2: Record found - check area difference
  const areaDifference = calculateAreaDifference(area_map, record.area_record);
  
  // If difference exceeds tolerance, it's a mismatch
  if (areaDifference > AREA_TOLERANCE_PERCENT) {
    return {
      plot_id,
      area_map,
      area_record: record.area_record,
      owner_name_map,
      owner_name_record: record.owner_name,
      status: "mismatch",
      areaDifference
    };
  }
  
  // Case 3: Areas match within tolerance
  return {
    plot_id,
    area_map,
    area_record: record.area_record,
    owner_name_map,
    owner_name_record: record.owner_name,
    status: "matched",
    areaDifference
  };
}

/**
 * Get color for parcel based on match status
 * Green: matched, Red: mismatch, Grey: missing
 */
export function getStatusColor(status: MatchStatus): string {
  switch (status) {
    case "matched":
      return "#22c55e"; // Green
    case "mismatch":
      return "#ef4444"; // Red
    case "missing":
      return "#9ca3af"; // Grey
  }
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case "matched":
      return "Matched";
    case "mismatch":
      return "Mismatch";
    case "missing":
      return "Missing Record";
  }
}

/**
 * Find records that exist in CSV but not in map data
 * @param mapPlotIds - Array of plot IDs from the map
 * @param records - Optional custom records array (defaults to landRecords)
 */
