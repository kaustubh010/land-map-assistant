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
    plot_id: "31",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "33",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "34",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "43",
    owner_name: "Naga Y",
    area_record: 8585
  },
  {
    plot_id: "44",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "52",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "54",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "56",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "44",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "46",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "48",
    owner_name: "Naga Y",
    area_record: 1.75
  },
  {
    plot_id: "50",
    owner_name: "Naga Y",
    area_record: 7457
  },
  {
    plot_id: "55",
    owner_name: "Rakesh Kumar",
    area_record: 5584
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
  },
  {
    plot_id: "1",
    owner_name: "Rakesh Kumar",
    area_record: 0.3910684714208958
  },
  {
    plot_id: "2",
    owner_name: "Rahul Kumar",
    area_record: 0.8242471745001374
  },
  {
    plot_id: "3",
    owner_name: "Deepak",
    area_record: 0.5279186296892107
  },
  {
    plot_id: "4",
    owner_name: "Suresh",
    area_record: 2.195578692430563
  },
  {
    plot_id: "5",
    owner_name: "Rakesh",
    area_record: 0.4669981928168188
  },
  {
    plot_id: "7",
    owner_name: "Reddy Deepak",
    area_record: 0.8256087060788178
  },
  {
    plot_id: "8",
    owner_name: "Rajesh",
    area_record: 0.942027557448266
  },
  {
    plot_id: "9",
    owner_name: "Chandan",
    area_record: 0.6459399195532468
  },
  {
    plot_id: "10",
    owner_name: "Arjun",
    area_record: 0.4519655779473632
  },
  {
    plot_id: "11",
    owner_name: "Suresh",
    area_record: 0.6561067511562697
  },
  {
    plot_id: "12",
    owner_name: "Suresh",
    area_record: 0.3992594778325565
  },
  {
    plot_id: "13",
    owner_name: "Rajesh",
    area_record: 0.6843575982710851
  },
  {
    plot_id: "14",
    owner_name: "Rakesh",
    area_record: 1.4840929006588512
  },
  {
    plot_id: "15",
    owner_name: "Eshan Bharat",
    area_record: 0.3857881091427525
  },
  {
    plot_id: "16",
    owner_name: "Mohan",
    area_record: 0.6459072626069476
  },
  {
    plot_id: "17",
    owner_name: "Vijay",
    area_record: 0.41681928782366073
  },
  {
    plot_id: "18",
    owner_name: "Ramesh Arjun",
    area_record: 0.2863688731353405
  },
  {
    plot_id: "19",
    owner_name: "Chandan",
    area_record: 0.2481980487369717
  },
  {
    plot_id: "20",
    owner_name: "Rajesh",
    area_record: 0.15954238403111684
  },
  {
    plot_id: "21",
    owner_name: "Suresh Suresh",
    area_record: 0.566846770391996
  },
  {
    plot_id: "22",
    owner_name: "Rahul Gowda",
    area_record: 0.17977811881460287
  },
  {
    plot_id: "23",
    owner_name: "Rahul",
    area_record: 0.2445149270871629
  },
  {
    plot_id: "24",
    owner_name: "Arjun",
    area_record: 0.5278883816559704
  },
  {
    plot_id: "25",
    owner_name: "Rakesh",
    area_record: 0.46692228099207267
  },
  {
    plot_id: "27",
    owner_name: "Ramesh Rahul",
    area_record: 0.35799547689719086
  },
  {
    plot_id: "28",
    owner_name: "Eshan Devi",
    area_record: 0.329809391770735
  },
  {
    plot_id: "29",
    owner_name: "Chandan",
    area_record: 0.6328176429674907
  },
  {
    plot_id: "31",
    owner_name: "Gowda Devi",
    area_record: 0.6508531995673117
  },
  {
    plot_id: "32",
    owner_name: "Suresh Ramesh",
    area_record: 0.38812508541495006
  },
  {
    plot_id: "33",
    owner_name: "Mohan",
    area_record: 0.37830175240261193
  },
  {
    plot_id: "34",
    owner_name: "Vijay Saurav",
    area_record: 0.3583360002268153
  },
  {
    plot_id: "35",
    owner_name: "Rahul",
    area_record: 3.6639412714672295
  },
  {
    plot_id: "36",
    owner_name: "Rahul",
    area_record: 3.55142183360418
  },
  {
    plot_id: "38",
    owner_name: "Saurav",
    area_record: 0.5460427979604017
  },
  {
    plot_id: "39",
    owner_name: "Krishna Kumar",
    area_record: 0.3045360180768836
  },
  {
    plot_id: "41",
    owner_name: "Vijay",
    area_record: 0.2424313172914004
  },
  {
    plot_id: "42",
    owner_name: "Rakesh",
    area_record: 0.8659909684607758
  },
  {
    plot_id: "43",
    owner_name: "Mohan",
    area_record: 0.4631150856928211
  },
  {
    plot_id: "44",
    owner_name: "Rahul",
    area_record: 0.9926918350296686
  },
  {
    plot_id: "46",
    owner_name: "Ramesh",
    area_record: 0.574953325527823
  },
  {
    plot_id: "47",
    owner_name: "Eshan Rahul",
    area_record: 0.20244160117880378
  },
  {
    plot_id: "48",
    owner_name: "Vijay Gowda",
    area_record: 0.45866370102474185
  },
  {
    plot_id: "49",
    owner_name: "Arjun Ramesh",
    area_record: 0.28243588833797084
  },
  {
    plot_id: "50",
    owner_name: "Suresh Mohan",
    area_record: 0.9136286013592162
  },
  {
    plot_id: "51",
    owner_name: "Ramesh Deepak",
    area_record: 0.8260371790891652
  },
  {
    plot_id: "52",
    owner_name: "Saurav",
    area_record: 0.664339828335888
  },
  {
    plot_id: "53",
    owner_name: "Gowda Deepak",
    area_record: 0.149697403225098
  },
  {
    plot_id: "54",
    owner_name: "Rakesh",
    area_record: 0.41246441069407236
  },
  {
    plot_id: "55",
    owner_name: "Eshan Gowda",
    area_record: 0.9082561289335883
  },
  {
    plot_id: "56",
    owner_name: "Chandan Krishna",
    area_record: 1.1223920252531934
  },
  {
    plot_id: "57",
    owner_name: "Rahul",
    area_record: 0.3791861039425962
  }
];