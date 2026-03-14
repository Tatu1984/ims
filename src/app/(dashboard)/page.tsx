"use client";

import {
  Monitor,
  Package,
  KeyRound,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
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

const statCards = [
  {
    title: "Hardware Assets",
    value: "847",
    icon: Monitor,
    color: "blue",
    trend: "+8 this week",
    trendDir: "up" as const,
  },
  {
    title: "Software Titles",
    value: "342",
    icon: Package,
    color: "purple",
    trend: "+3 new detected",
    trendDir: "up" as const,
  },
  {
    title: "Active Licenses",
    value: "287",
    icon: KeyRound,
    color: "emerald",
    trend: "94% compliant",
    trendDir: "up" as const,
  },
  {
    title: "Expiring Soon",
    value: "12",
    icon: AlertTriangle,
    color: "amber",
    trend: "Next 30 days",
    trendDir: "down" as const,
  },
];

const iconBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  amber: "bg-amber-100 text-amber-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

const trendColor: Record<string, string> = {
  up: "text-green-600",
  down: "text-amber-600",
};

const pieData = [
  { name: "Desktops", value: 312 },
  { name: "Laptops", value: 285 },
  { name: "Servers", value: 64 },
  { name: "Printers", value: 47 },
  { name: "Peripherals", value: 139 },
];

const PIE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
];

const barData = [
  { month: "Oct", "Procured": 18, "Retired": 5 },
  { month: "Nov", "Procured": 24, "Retired": 8 },
  { month: "Dec", "Procured": 12, "Retired": 14 },
  { month: "Jan", "Procured": 31, "Retired": 6 },
  { month: "Feb", "Procured": 22, "Retired": 9 },
  { month: "Mar", "Procured": 28, "Retired": 4 },
];

const recentAssets = [
  {
    tag: "LPT-2026-0134",
    name: 'Dell Latitude 7450 - 14"',
    assignedTo: "James Thompson",
    department: "Engineering",
    date: "Mar 13, 2026",
  },
  {
    tag: "DSK-2026-0089",
    name: "HP EliteDesk 800 G9",
    assignedTo: "Priya Patel",
    department: "Finance",
    date: "Mar 12, 2026",
  },
  {
    tag: "PRN-2026-0012",
    name: "HP LaserJet Pro M404dn",
    assignedTo: "Floor 3 - Shared",
    department: "Shared Services",
    date: "Mar 11, 2026",
  },
  {
    tag: "LPT-2026-0131",
    name: "MacBook Pro 16\" M4 Pro",
    assignedTo: "Anika Singh",
    department: "Design",
    date: "Mar 10, 2026",
  },
  {
    tag: "SRV-2026-0005",
    name: "Dell PowerEdge R760",
    assignedTo: "Server Room A",
    department: "Infrastructure",
    date: "Mar 9, 2026",
  },
];

const expiringLicenses = [
  {
    software: "Microsoft 365 Business",
    licenses: 150,
    expiry: "Apr 15, 2026",
    daysLeft: 32,
    severity: "warning",
  },
  {
    software: "Adobe Creative Cloud",
    licenses: 25,
    expiry: "Mar 28, 2026",
    daysLeft: 14,
    severity: "critical",
  },
  {
    software: "Slack Business+",
    licenses: 200,
    expiry: "Apr 30, 2026",
    daysLeft: 47,
    severity: "info",
  },
  {
    software: "Zoom Workplace",
    licenses: 100,
    expiry: "Mar 22, 2026",
    daysLeft: 8,
    severity: "critical",
  },
  {
    software: "AutoCAD LT",
    licenses: 10,
    expiry: "May 15, 2026",
    daysLeft: 62,
    severity: "info",
  },
];

const severityBadge: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your hardware and software assets
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${iconBg[card.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                {card.trendDir === "up" ? (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-amber-600" />
                )}
                <span className={trendColor[card.trendDir]}>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Asset Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hardware by Category
          </h2>
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
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Procurement vs Retirement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Asset Lifecycle Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Procured" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Retired" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Assets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recently Added Hardware
          </h2>
          <div className="space-y-4">
            {recentAssets.map((asset, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="p-2 rounded-lg bg-blue-50 shrink-0">
                  <Monitor className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {asset.tag} &middot; {asset.assignedTo} &middot; {asset.department}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{asset.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Licenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming License Expirations
          </h2>
          <div className="space-y-4">
            {expiringLicenses.map((license, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {license.software}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {license.licenses} licenses &middot; Expires {license.expiry}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${severityBadge[license.severity]}`}
                >
                  {license.daysLeft} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
