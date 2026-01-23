// Sample GeoJSON data representing village land parcels
// Contains 15 realistic irregular polygon shapes with plot details
// Coordinates represent a fictional village area

export interface ParcelProperties {
  plot_id: string;
  area_map: number; // in hectares
  owner_name_map?: string;
}

export interface ParcelGeoJSON {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: ParcelProperties;
    geometry: {
      type: "Polygon";
      coordinates: number[][][];
    };
  }>;
}

export const parcelsGeoJSON: ParcelGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-001",
        area_map: 2.45,
        owner_name_map: "Ramesh Kumar"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5940, 12.9716],
          [77.5955, 12.9720],
          [77.5960, 12.9712],
          [77.5952, 12.9705],
          [77.5942, 12.9708],
          [77.5940, 12.9716]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-002",
        area_map: 1.82,
        owner_name_map: "Lakshmi Devi"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5960, 12.9712],
          [77.5975, 12.9718],
          [77.5980, 12.9708],
          [77.5970, 12.9700],
          [77.5960, 12.9705],
          [77.5960, 12.9712]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-003",
        area_map: 3.21,
        owner_name_map: "Suresh Reddy"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5942, 12.9708],
          [77.5952, 12.9705],
          [77.5955, 12.9695],
          [77.5945, 12.9688],
          [77.5935, 12.9695],
          [77.5942, 12.9708]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-004",
        area_map: 1.56,
        owner_name_map: "Venkatesh Gowda"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5955, 12.9695],
          [77.5970, 12.9700],
          [77.5972, 12.9690],
          [77.5960, 12.9682],
          [77.5950, 12.9688],
          [77.5955, 12.9695]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-005",
        area_map: 2.89
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5980, 12.9708],
          [77.5995, 12.9715],
          [77.6000, 12.9705],
          [77.5990, 12.9695],
          [77.5980, 12.9700],
          [77.5980, 12.9708]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-006",
        area_map: 4.12,
        owner_name_map: "Manjunath S"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5920, 12.9730],
          [77.5940, 12.9738],
          [77.5945, 12.9725],
          [77.5940, 12.9716],
          [77.5925, 12.9720],
          [77.5920, 12.9730]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-007",
        area_map: 1.98,
        owner_name_map: "Nagaraj B"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5945, 12.9725],
          [77.5960, 12.9732],
          [77.5965, 12.9722],
          [77.5955, 12.9720],
          [77.5940, 12.9716],
          [77.5945, 12.9725]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-008",
        area_map: 2.34,
        owner_name_map: "Shivakumar H"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5965, 12.9722],
          [77.5980, 12.9728],
          [77.5985, 12.9718],
          [77.5975, 12.9718],
          [77.5960, 12.9712],
          [77.5965, 12.9722]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-009",
        area_map: 1.45,
        owner_name_map: "Puttamma K"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5935, 12.9695],
          [77.5945, 12.9688],
          [77.5940, 12.9678],
          [77.5928, 12.9675],
          [77.5925, 12.9685],
          [77.5935, 12.9695]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-010",
        area_map: 3.67,
        owner_name_map: "Basavaraj M"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5950, 12.9688],
          [77.5960, 12.9682],
          [77.5965, 12.9672],
          [77.5955, 12.9665],
          [77.5942, 12.9670],
          [77.5940, 12.9678],
          [77.5950, 12.9688]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-011",
        area_map: 2.08
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5972, 12.9690],
          [77.5985, 12.9695],
          [77.5990, 12.9685],
          [77.5980, 12.9675],
          [77.5968, 12.9680],
          [77.5972, 12.9690]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-012",
        area_map: 1.33,
        owner_name_map: "Girish N"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5990, 12.9695],
          [77.6005, 12.9700],
          [77.6010, 12.9690],
          [77.6000, 12.9682],
          [77.5988, 12.9685],
          [77.5990, 12.9695]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-013",
        area_map: 2.76,
        owner_name_map: "Hanumantharayappa"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5920, 12.9720],
          [77.5925, 12.9720],
          [77.5940, 12.9716],
          [77.5940, 12.9708],
          [77.5930, 12.9705],
          [77.5918, 12.9710],
          [77.5920, 12.9720]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-014",
        area_map: 1.89,
        owner_name_map: "Thimmaiah R"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5985, 12.9728],
          [77.6000, 12.9735],
          [77.6005, 12.9725],
          [77.5995, 12.9715],
          [77.5985, 12.9718],
          [77.5985, 12.9728]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        plot_id: "VLG-015",
        area_map: 2.55,
        owner_name_map: "Kemparaju T"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.5965, 12.9672],
          [77.5980, 12.9675],
          [77.5988, 12.9665],
          [77.5978, 12.9655],
          [77.5965, 12.9660],
          [77.5965, 12.9672]
        ]]
      }
    }
  ]
};
