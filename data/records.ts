// Sample CSV-equivalent data representing official land records
// This simulates records from a government database
// Includes intentional discrepancies for testing matching logic

export interface LandRecord {
  plot_id: string;
  owner_name: string;
  area_record: number; // in hectares
}

export const landRecords: LandRecord[] = [
  // VLG-001: Matched - areas within 5% tolerance
  {
    plot_id: "1",
    owner_name: "Ramesh Kumar",
    area_record: 2.48
  },
  // VLG-002: Matched
  {
    plot_id: "2",
    owner_name: "Lakshmi Devi",
    area_record: 1.80
  },
  // VLG-003: MISMATCH - area difference > 5%
  {
    plot_id: "4",
    owner_name: "Suresh Reddy",
    area_record: 2.85 // Map shows 3.21, difference is 11.2%
  },
  // VLG-004: Matched
  {
    plot_id: "6",
    owner_name: "Venkatesh Gowda",
    area_record: 1.58
  },
  // VLG-005: MISMATCH - significant area difference
  {
    plot_id: "12",
    owner_name: "Rangaswamy K",
    area_record: 3.45 // Map shows 2.89, difference is 16.2%
  },
  // VLG-006: Matched
  {
    plot_id: "10",
    owner_name: "Manjunath S",
    area_record: 4.08
  },
  // VLG-007: Matched
  {
    plot_id: "9",
    owner_name: "Nagaraj B",
    area_record: 2.01
  },
  // VLG-008: MISMATCH
  {
    plot_id: "11",
    owner_name: "Shivakumar H",
    area_record: 2.65 // Map shows 2.34, difference is 11.7%
  },
  // VLG-009: Matched
  {
    plot_id: "8",
    owner_name: "Puttamma K",
    area_record: 1.42
  },
  // VLG-010: Matched
  {
    plot_id: "7",
    owner_name: "Basavaraj M",
    area_record: 3.55
  },
  // VLG-011: MISMATCH
  {
    plot_id: "14",
    owner_name: "Ningappa G",
    area_record: 2.45 // Map shows 2.08, difference is 15.1%
  },
  // VLG-012: Matched
  {
    plot_id: "16",
    owner_name: "Girish N",
    area_record: 1.30
  },
  // VLG-013 is MISSING from records - simulates incomplete data
  // VLG-014: Matched
  {
    plot_id: "17",
    owner_name: "Thimmaiah R",
    area_record: 1.85
  },
  // VLG-015 is also MISSING from records
  // Extra record that doesn't exist in map data
  {
    plot_id: "13",
    owner_name: "Chandrashekar Y",
    area_record: 1.75
  },
  {
    plot_id: "21",
    owner_name: "Chandrashekar Y",
    area_record: 1.75
  },
  {
    plot_id: "24",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "22",
    owner_name: "Chandrashekar Y",
    area_record: 1.75
  }
];
