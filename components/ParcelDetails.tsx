import { ParcelMatchResult, getStatusColor, getStatusLabel } from "@/lib/matching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, AlertTriangle, CheckCircle, HelpCircle, Pencil } from "lucide-react";

interface ParcelDetailsProps {
  parcel: ParcelMatchResult | null;
  onEditClick?: () => void;
}

export function ParcelDetails({ parcel, onEditClick }: ParcelDetailsProps) {
  if (!parcel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Parcel Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Click on a parcel on the map or search by Plot ID to view details.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const StatusIcon = parcel.status === "matched" 
    ? CheckCircle 
    : parcel.status === "mismatch" 
      ? AlertTriangle 
      : HelpCircle;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {parcel.plot_id}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              style={{ backgroundColor: getStatusColor(parcel.status) }}
              className="text-white"
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {getStatusLabel(parcel.status)}
            </Badge>
            {onEditClick && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEditClick}
                className="h-7 gap-1.5 text-xs"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Data Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            From Map (GeoJSON)
          </h4>
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Area:</span>
              <span className="font-medium">{Number(parcel.area_map.toFixed(2))} hectares</span>
            </div>
            {parcel.owner_name_map && (
              <div className="flex justify-between text-sm">
                <span>Owner:</span>
                <span className="font-medium">{parcel.owner_name_map}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Record Data Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            From Records (CSV)
          </h4>
          {parcel.status === "missing" ? (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground italic">
                No matching record found for this plot
              </p>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Area:</span>
                <span className="font-medium">{parcel.area_record?.toFixed(2)} hectares</span>
              </div>
              {parcel.owner_name_record && (
                <div className="flex justify-between text-sm">
                  <span>Owner:</span>
                  <span className="font-medium">{parcel.owner_name_record}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Discrepancy Analysis */}
        {parcel.status === "mismatch" && parcel.areaDifference !== undefined && parcel.areaDifference !== 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-destructive uppercase tracking-wide">
              Discrepancy Detected
            </h4>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm">
                Area difference: <strong>{parcel.areaDifference.toFixed(1)}%</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Threshold exceeded (max 5% allowed)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
