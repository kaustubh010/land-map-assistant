import { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parcelsGeoJSON, ParcelProperties } from "@/data/parcels";
import { matchParcel, getStatusColor, getStatusLabel, ParcelMatchResult } from "@/lib/matching";
import { LandRecord } from "@/data/records";

interface ParcelMapProps {
  searchedPlotId: string | null;
  onParcelClick: (result: ParcelMatchResult) => void;
  onSearchComplete?: () => void; // Add callback to reset search
  records: LandRecord[];
}

export default function ParcelMap({ searchedPlotId, onParcelClick, onSearchComplete, records }: ParcelMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  // Center coordinates for the village
  const center: [number, number] = [12.9700, 77.5960];

  // Style function for each parcel based on match status
  const getFeatureStyle = useCallback((feature: GeoJSON.Feature | undefined, isSelected: boolean) => {
    if (!feature?.properties) return {};
    
    const props = feature.properties as ParcelProperties;
    const matchResult = matchParcel(props, records);
    const color = getStatusColor(matchResult.status);
    
    return {
      fillColor: color,
      fillOpacity: isSelected ? 0.8 : 0.5,
      color: isSelected ? "#1e40af" : "#374151",
      weight: isSelected ? 4 : 2,
      opacity: 1
    };
  }, [records]);

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 16,
      scrollWheelZoom: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const allCoords: L.LatLngExpression[] = [];

    parcelsGeoJSON.features.forEach(feature => {
      if (feature.geometry.type === "Polygon") {
        const coords = feature.geometry.coordinates[0] as [number, number][];
        coords.forEach(([lng, lat]) => allCoords.push([lat, lng]));
      }
    });

    if (allCoords.length) {
      mapRef.current.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
    }
  }, []);

  // Center on searched parcel and select it
  useEffect(() => {
    if (!mapRef.current || !searchedPlotId) return;

    const feature = parcelsGeoJSON.features.find(
      f => f.properties.plot_id === searchedPlotId
    );

    if (feature && feature.geometry.type === "Polygon") {
      const coords = feature.geometry.coordinates[0] as [number, number][];
      const latLngs = coords.map(([lng, lat]) => L.latLng(lat, lng));
      const bounds = L.latLngBounds(latLngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
      
      // Select the parcel
      setSelectedPlotId(searchedPlotId);
      
      // Trigger the click handler
      const props = feature.properties as ParcelProperties;
      const matchResult = matchParcel(props, records);
      onParcelClick(matchResult);
      
      // Reset the search after handling
      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  }, [searchedPlotId, onParcelClick, onSearchComplete, records]);

  // Add GeoJSON layer and handle updates
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing layer if present
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Create new GeoJSON layer
    const geoJsonLayer = L.geoJSON(parcelsGeoJSON as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const isSelected = feature?.properties?.plot_id === selectedPlotId;
        return getFeatureStyle(feature, isSelected);
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as ParcelProperties;
        const matchResult = matchParcel(props, records);

        // Create popup content
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${props.plot_id}</h3>
            <div style="font-size: 14px;">
              <p><strong>Area (Map):</strong> ${Number(props.area_map).toFixed(2)} ha</p>
              ${matchResult.area_record !== undefined 
                ? `<p><strong>Area (Records):</strong> ${matchResult.area_record.toFixed(2)} ha</p>` 
                : '<p style="color: #6b7280;">No record found</p>'
              }
              ${matchResult.areaDifference !== undefined 
                ? `<p><strong>Difference:</strong> ${matchResult.areaDifference.toFixed(1)}%</p>` 
                : ''
              }
              <p style="margin-top: 8px;">
                <span style="padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; background-color: ${getStatusColor(matchResult.status)}">
                  ${getStatusLabel(matchResult.status)}
                </span>
              </p>
            </div>
          </div>
        `;

        layer.bindPopup(popupContent);

        // Handle click to show details in sidebar
        layer.on('click', () => {
          setSelectedPlotId(props.plot_id);
          onParcelClick(matchResult);
        });

        // Highlight on hover
        layer.on('mouseover', (e) => {
          const l = e.target as L.Path;
          l.setStyle({
            weight: 3,
            fillOpacity: 0.7
          });
        });

        layer.on('mouseout', (e) => {
          const l = e.target as L.Path;
          const isSelected = props.plot_id === selectedPlotId;
          l.setStyle(getFeatureStyle(feature, isSelected));
        });
      }
    });

    geoJsonLayer.addTo(mapRef.current);
    geoJsonLayerRef.current = geoJsonLayer;

  }, [selectedPlotId, onParcelClick, getFeatureStyle, records]);

  return (
    <div 
      ref={mapContainerRef} 
      className="h-full w-full rounded-lg z-0"
      style={{ minHeight: "400px" }}
    />
  );
}