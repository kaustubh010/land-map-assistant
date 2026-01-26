"use client";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { parcelsGeoJSON } from "@/data/parcels";
import { landRecords, LandRecord } from "@/data/records";
import {
  matchParcel,
  getStatusLabel,
  getStatusColor,
  MatchStatus,
} from "@/lib/matching";
import {
  MapPin,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const records = landRecords;
  const router = useRouter();

  // Process all parcels and compute statistics
  const { matchResults, stats, areaComparisonData, statusDistribution } =
    useMemo(() => {
      const results = parcelsGeoJSON.features.map((feature) =>
        matchParcel(feature.properties, records),
      );

      const matched = results.filter((r) => r.status === "matched").length;
      const mismatch = results.filter((r) => r.status === "mismatch").length;
      const missing = results.filter((r) => r.status === "missing").length;
      const totalMapArea = results.reduce((sum, r) => sum + r.area_map, 0);
      const totalRecordArea = results.reduce(
        (sum, r) => sum + (r.area_record || 0),
        0,
      );

      const mapPlotIds = parcelsGeoJSON.features.map(
        (f) => f.properties.plot_id,
      );

      return {
        matchResults: results,
        stats: {
          total: results.length,
          matched,
          mismatch,
          missing,
          matchRate: ((matched / results.length) * 100).toFixed(1),
          totalMapArea: totalMapArea.toFixed(2),
          totalRecordArea: totalRecordArea.toFixed(2),
        },
        areaComparisonData: results
          .filter((r) => r.area_record !== undefined)
          .map((r) => ({
            plot_id: r.plot_id,
            "Map Area": r.area_map,
            "Record Area": r.area_record,
          })),
        statusDistribution: [
          { name: "Matched", value: matched, color: getStatusColor("matched") },
          {
            name: "Mismatch",
            value: mismatch,
            color: getStatusColor("mismatch"),
          },
          { name: "Missing", value: missing, color: getStatusColor("missing") },
        ],
      };
    }, [records]);

  const handleDownloadReport = () => {
    // Generate CSV report
    const headers = [
      "Plot ID",
      "Status",
      "Map Area (ha)",
      "Record Area (ha)",
      "Owner (Map)",
      "Owner (Record)",
      "Area Diff (%)",
    ];
    const rows = matchResults.map((r) => [
      r.plot_id,
      getStatusLabel(r.status),
      r.area_map.toFixed(2),
      r.area_record?.toFixed(2) || "N/A",
      r.owner_name_map || "N/A",
      r.owner_name_record || "N/A",
      r.areaDifference?.toFixed(1) || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `land_verification_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getStatusBadgeVariant = (status: MatchStatus) => {
    switch (status) {
      case "matched":
        return "default";
      case "mismatch":
        return "destructive";
      case "missing":
        return "secondary";
    }
  };

  const chartConfig = {
    "Map Area": { label: "Map Area", color: "hsl(var(--primary))" },
    "Record Area": {
      label: "Record Area",
      color: "hsl(var(--muted-foreground))",
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Main Content */}
      <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto overflow-hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total Parcels
              </CardTitle>
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold">
                {stats.total}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Parcels on map
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Matched
              </CardTitle>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.matched}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {stats.matchRate}% match rate
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Mismatches
              </CardTitle>
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.mismatch}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Area discrepancies &gt;5%
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-gray-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Missing
              </CardTitle>
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.missing}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                No matching record
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Status Distribution Pie Chart */}
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-5 w-5" />
                Status Distribution
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Parcel verification results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="h-[220px] sm:h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={{
                        stroke: "hsl(var(--foreground))",
                        strokeWidth: 1,
                      }}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      itemStyle={{
                        color: "hsl(var(--foreground))",
                      }}
                      labelStyle={{
                        color: "hsl(var(--foreground))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 mt-3 sm:mt-4 flex-wrap">
                {statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Area Comparison Bar Chart */}
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-5 w-5" />
                Area Comparison
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Map vs Record (hectares)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="w-full overflow-x-auto no-scrollbar">
                <div
                  style={{
                    minWidth: `${Math.max(400, areaComparisonData.length * 60)}px`,
                  }}
                  className="h-[250px] sm:h-[280px]"
                >
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <BarChart
                      data={areaComparisonData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="plot_id"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 10 }}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10 }} width={40} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="Map Area"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="Record Area"
                        fill="hsl(var(--muted-foreground))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Map Area</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Record Area</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Area Summary */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Area Summary</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Total land area statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-muted rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Total Map Area
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.totalMapArea} ha
                </p>
              </div>
              <div className="p-4 sm:p-5 bg-muted rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Total Record Area
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {stats.totalRecordArea} ha
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Data Table */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">
              Detailed Parcel Report
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Complete list of all parcels with verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      Plot ID
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right whitespace-nowrap">
                      Map (ha)
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm text-right whitespace-nowrap">
                      Record (ha)
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm text-right whitespace-nowrap hidden sm:table-cell">
                      Diff (%)
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                      Owner (Map)
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                      Owner (Record)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchResults.map((result) => (
                    <TableRow key={result.plot_id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {result.plot_id}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(result.status)}
                          className="text-[10px] sm:text-xs"
                        >
                          {getStatusLabel(result.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">
                        {result.area_map.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">
                        {result.area_record?.toFixed(2) || "—"}
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm hidden sm:table-cell">
                        {result.areaDifference !== undefined ? (
                          <span
                            className={
                              result.areaDifference > 5
                                ? "text-red-600 dark:text-red-400 font-medium"
                                : "text-green-600 dark:text-green-400"
                            }
                          >
                            {result.areaDifference.toFixed(1)}%
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                        {result.owner_name_map || "—"}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                        {result.owner_name_record || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Report Footer */}
        <Card className="bg-muted/50 overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="text-center sm:text-left">
                <p className="font-medium">
                  Report generated on:{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="hidden sm:block mt-1">
                  Land Record Digitization Assistant — Village Parcel
                  Verification System
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="h-8 px-3 text-xs"
                >
                  <MapPin className="mr-1.5 h-3.5 w-3.5" />
                  Map
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadReport}
                  className="h-8 px-3 text-xs"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
