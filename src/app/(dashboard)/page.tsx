"use client";

import {
  Monitor,
  Package,
  KeyRound,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/frontend/hooks/use-api";
import { getDashboardData } from "@/frontend/api/endpoints/dashboard.api";

interface DashboardData {
  stats: {
    totalAssets: number;
    totalSoftware: number;
    totalLicenses: number;
  };
  assetsByType: { name: string; value: number }[];
  assetsByStatus: { name: string; value: number }[];
  recentAssets: {
    id: string;
    assetTag: string;
    name: string;
    type: string;
    assignedToName: string;
    department: string;
    createdAt: string;
  }[];
  expiringLicenses: {
    software: string;
    licenses: number;
    expiry: string;
    daysLeft: number;
  }[];
}

const iconBg: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  amber: "bg-amber-500/10 text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
};

const trendColor: Record<string, string> = {
  up: "text-emerald-400",
  down: "text-amber-400",
};

const PIE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
];

// Mock data for bar chart (no lifecycle trend endpoint exists yet)
const barData = [
  { month: "Oct", Procured: 18, Retired: 5 },
  { month: "Nov", Procured: 24, Retired: 8 },
  { month: "Dec", Procured: 12, Retired: 14 },
  { month: "Jan", Procured: 31, Retired: 6 },
  { month: "Feb", Procured: 22, Retired: 9 },
  { month: "Mar", Procured: 28, Retired: 4 },
];

function getDaysLeftBadgeClass(daysLeft: number): string {
  if (daysLeft < 14) return "bg-red-500/10 text-red-400 border-red-500/20";
  if (daysLeft < 30) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-blue-500/10 text-blue-400 border-blue-500/20";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 space-y-6 p-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="h-4 w-72 bg-zinc-800 rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-zinc-900 border border-zinc-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-xl" />
        <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-zinc-900 border border-zinc-800 rounded-xl" />
        <div className="h-80 bg-zinc-900 border border-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useApi<DashboardData>(getDashboardData);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <Card className="bg-zinc-900 border-zinc-800 ring-0 max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="p-3 rounded-full bg-red-500/10 inline-block">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-100">Failed to load dashboard</p>
              <p className="text-sm text-zinc-400 mt-1">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats;
  const pieData = data?.assetsByType ?? [];
  const recentAssets = data?.recentAssets ?? [];
  const expiringLicenses = data?.expiringLicenses ?? [];

  const statCards = [
    {
      title: "Hardware Assets",
      value: String(stats?.totalAssets ?? 0),
      icon: Monitor,
      color: "blue",
      trend: `${stats?.totalAssets ?? 0} total`,
      trendDir: "up" as const,
    },
    {
      title: "Software Titles",
      value: String(stats?.totalSoftware ?? 0),
      icon: Package,
      color: "purple",
      trend: `${stats?.totalSoftware ?? 0} tracked`,
      trendDir: "up" as const,
    },
    {
      title: "Active Licenses",
      value: String(stats?.totalLicenses ?? 0),
      icon: KeyRound,
      color: "emerald",
      trend: `${stats?.totalLicenses ?? 0} active`,
      trendDir: "up" as const,
    },
    {
      title: "Expiring Soon",
      value: String(expiringLicenses.length),
      icon: AlertTriangle,
      color: "amber",
      trend: "Next 30 days",
      trendDir: "down" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Overview of your hardware and software assets
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="bg-zinc-900 border-zinc-800 ring-0"
            >
              <CardContent className="pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-zinc-100 mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${iconBg[card.color]}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  {card.trendDir === "up" ? (
                    <ArrowUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-amber-400" />
                  )}
                  <span className={trendColor[card.trendDir]}>
                    {card.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Hardware by Category */}
        <Card className="bg-zinc-900 border-zinc-800 ring-0">
          <CardHeader>
            <CardTitle className="text-zinc-100">
              Hardware by Category
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Distribution across asset types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      color: "#e4e4e7",
                    }}
                    itemStyle={{ color: "#a1a1aa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-zinc-500 text-sm">
                No asset data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Asset Lifecycle Trends */}
        <Card className="bg-zinc-900 border-zinc-800 ring-0">
          <CardHeader>
            <CardTitle className="text-zinc-100">
              Asset Lifecycle Trends
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Procured vs retired over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 13, fill: "#71717a" }}
                  axisLine={{ stroke: "#27272a" }}
                  tickLine={{ stroke: "#27272a" }}
                />
                <YAxis
                  tick={{ fontSize: 13, fill: "#71717a" }}
                  axisLine={{ stroke: "#27272a" }}
                  tickLine={{ stroke: "#27272a" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                  }}
                  itemStyle={{ color: "#a1a1aa" }}
                />
                <Legend
                  wrapperStyle={{ color: "#a1a1aa" }}
                />
                <Bar
                  dataKey="Procured"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Retired"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Hardware */}
        <Card className="bg-zinc-900 border-zinc-800 ring-0">
          <CardHeader>
            <CardTitle className="text-zinc-100">
              Recently Added Hardware
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Latest assets registered in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.length > 0 ? (
                recentAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-start gap-3 pb-4 border-b border-zinc-800 last:border-0 last:pb-0"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                      <Monitor className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100">
                        {asset.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {asset.assetTag} &middot; {asset.assignedToName || "Unassigned"} &middot;{" "}
                        {asset.department || "N/A"}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 shrink-0">
                      {formatDate(asset.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No recent assets
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming License Expirations */}
        <Card className="bg-zinc-900 border-zinc-800 ring-0">
          <CardHeader>
            <CardTitle className="text-zinc-100">
              Upcoming License Expirations
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Licenses requiring renewal attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiringLicenses.length > 0 ? (
                expiringLicenses.map((license, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-4 border-b border-zinc-800 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100">
                        {license.software}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {license.licenses} licenses &middot; Expires{" "}
                        {formatDate(license.expiry)}
                      </p>
                    </div>
                    <Badge
                      className={`shrink-0 ${getDaysLeftBadgeClass(license.daysLeft)}`}
                    >
                      {license.daysLeft} days
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No expiring licenses
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
