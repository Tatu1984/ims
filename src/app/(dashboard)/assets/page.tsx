"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Upload,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const filterTabs = [
  { label: "All", value: "all" },
  { label: "Desktops", value: "desktop" },
  { label: "Laptops", value: "laptop" },
  { label: "Servers", value: "server" },
  { label: "Printers", value: "printer" },
  { label: "Peripherals", value: "peripheral" },
] as const;

type AssetType = "desktop" | "laptop" | "server" | "printer" | "peripheral";
type AssetStatus = "Active" | "In Storage" | "Maintenance" | "Retired";

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  assignedTo: string;
  status: AssetStatus;
  department: string;
  purchaseDate: string;
}

const typeBadgeColors: Record<AssetType, string> = {
  desktop: "bg-blue-100 text-blue-700",
  laptop: "bg-purple-100 text-purple-700",
  server: "bg-cyan-100 text-cyan-700",
  printer: "bg-orange-100 text-orange-700",
  peripheral: "bg-teal-100 text-teal-700",
};

const typeLabels: Record<AssetType, string> = {
  desktop: "Desktop",
  laptop: "Laptop",
  server: "Server",
  printer: "Printer",
  peripheral: "Peripheral",
};

const statusBadgeColors: Record<AssetStatus, string> = {
  Active: "bg-green-100 text-green-700",
  "In Storage": "bg-gray-100 text-gray-700",
  Maintenance: "bg-amber-100 text-amber-700",
  Retired: "bg-red-100 text-red-700",
};

const mockAssets: Asset[] = [
  {
    id: "ast-001",
    assetTag: "LPT-2025-0451",
    name: "Dell Latitude 7450",
    type: "laptop",
    serialNumber: "DL7450-XK9R2",
    assignedTo: "James Thompson",
    status: "Active",
    department: "Engineering",
    purchaseDate: "Jan 15, 2025",
  },
  {
    id: "ast-002",
    assetTag: "DSK-2024-0089",
    name: "HP EliteDesk 800 G9",
    type: "desktop",
    serialNumber: "HP800G9-M3J7K",
    assignedTo: "Priya Patel",
    status: "Active",
    department: "Finance",
    purchaseDate: "Sep 3, 2024",
  },
  {
    id: "ast-003",
    assetTag: "SRV-2024-0012",
    name: "Dell PowerEdge R760",
    type: "server",
    serialNumber: "DPR760-2NV8P",
    assignedTo: "Server Room A",
    status: "Active",
    department: "Infrastructure",
    purchaseDate: "Jun 20, 2024",
  },
  {
    id: "ast-004",
    assetTag: "LPT-2024-0523",
    name: 'MacBook Pro 16" M4 Pro',
    type: "laptop",
    serialNumber: "MBP16-C9QF4R",
    assignedTo: "Anika Singh",
    status: "Active",
    department: "Design",
    purchaseDate: "Nov 8, 2024",
  },
  {
    id: "ast-005",
    assetTag: "PRN-2023-0034",
    name: "HP LaserJet Pro M404dn",
    type: "printer",
    serialNumber: "HPLJ404-7K2X9",
    assignedTo: "Floor 2 - Shared",
    status: "Active",
    department: "Shared Services",
    purchaseDate: "Mar 12, 2023",
  },
  {
    id: "ast-006",
    assetTag: "DSK-2023-0167",
    name: "Lenovo ThinkCentre M90q",
    type: "desktop",
    serialNumber: "LTC90Q-P5M2N",
    assignedTo: "Mark Williams",
    status: "Maintenance",
    department: "Sales",
    purchaseDate: "Jul 28, 2023",
  },
  {
    id: "ast-007",
    assetTag: "PRF-2025-0022",
    name: "Dell UltraSharp U2723QE",
    type: "peripheral",
    serialNumber: "DU2723-K8R3V",
    assignedTo: "James Thompson",
    status: "Active",
    department: "Engineering",
    purchaseDate: "Jan 15, 2025",
  },
  {
    id: "ast-008",
    assetTag: "LPT-2022-0298",
    name: "Dell Latitude 5530",
    type: "laptop",
    serialNumber: "DL5530-W4N6T",
    assignedTo: "Unassigned",
    status: "In Storage",
    department: "IT Pool",
    purchaseDate: "Apr 5, 2022",
  },
  {
    id: "ast-009",
    assetTag: "SRV-2023-0008",
    name: "HPE ProLiant DL380 Gen10",
    type: "server",
    serialNumber: "HPE380-J2K9M",
    assignedTo: "Server Room B",
    status: "Retired",
    department: "Infrastructure",
    purchaseDate: "Feb 14, 2023",
  },
  {
    id: "ast-010",
    assetTag: "DSK-2025-0002",
    name: "HP EliteOne 870 G9 AiO",
    type: "desktop",
    serialNumber: "HP870G9-R6V3Q",
    assignedTo: "Sarah Chen",
    status: "Active",
    department: "HR",
    purchaseDate: "Feb 1, 2025",
  },
];

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesFilter = activeFilter === "all" || asset.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hardware Assets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage all hardware assets across your organization
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === tab.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, asset tag, serial number, assigned to, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Asset Tag
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Serial Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Purchase Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map((asset, index) => (
                <tr
                  key={asset.id}
                  className={`transition-colors hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {asset.assetTag}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-medium">
                    {asset.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColors[asset.type]}`}
                    >
                      {typeLabels[asset.type]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-600">
                    {asset.serialNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {asset.assignedTo}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColors[asset.status]}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {asset.department}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {asset.purchaseDate}
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1-10</span> of{" "}
            <span className="font-medium">847</span> assets
          </p>
          <div className="flex items-center gap-1">
            <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
              2
            </button>
            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
              3
            </button>
            <span className="px-2 text-sm text-gray-400">...</span>
            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
              85
            </button>
            <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
