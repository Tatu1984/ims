"use client";

import { useState } from "react";
import {
  Search,
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Total Software", value: "342", icon: Package, color: "bg-blue-500" },
  { label: "Licensed", value: "287", icon: ShieldCheck, color: "bg-green-500" },
  { label: "Unauthorized", value: "12", icon: ShieldAlert, color: "bg-red-500" },
  { label: "Expiring Soon", value: "8", icon: Clock, color: "bg-amber-500" },
];

type LicenseStatus = "Licensed" | "Unlicensed" | "Trial";

interface SoftwareItem {
  name: string;
  publisher: string;
  version: string;
  installCount: number;
  licenseStatus: LicenseStatus;
  category: string;
}

const softwareData: SoftwareItem[] = [
  { name: "Microsoft Office 365", publisher: "Microsoft", version: "16.0.17328", installCount: 245, licenseStatus: "Licensed", category: "Productivity" },
  { name: "Adobe Creative Suite", publisher: "Adobe Inc.", version: "2024.1.0", installCount: 48, licenseStatus: "Licensed", category: "Design" },
  { name: "Google Chrome", publisher: "Google LLC", version: "122.0.6261", installCount: 312, licenseStatus: "Licensed", category: "Browser" },
  { name: "Visual Studio Code", publisher: "Microsoft", version: "1.87.2", installCount: 87, licenseStatus: "Licensed", category: "Development" },
  { name: "Slack", publisher: "Salesforce", version: "4.36.140", installCount: 198, licenseStatus: "Licensed", category: "Communication" },
  { name: "Zoom Workplace", publisher: "Zoom Video", version: "5.17.11", installCount: 276, licenseStatus: "Licensed", category: "Communication" },
  { name: "AutoCAD 2024", publisher: "Autodesk", version: "2024.1", installCount: 15, licenseStatus: "Trial", category: "Engineering" },
  { name: "WinRAR", publisher: "win.rar GmbH", version: "7.0.0", installCount: 34, licenseStatus: "Unlicensed", category: "Utility" },
  { name: "Postman", publisher: "Postman Inc.", version: "10.23.5", installCount: 42, licenseStatus: "Licensed", category: "Development" },
  { name: "Norton 360", publisher: "Gen Digital", version: "22.24.1.12", installCount: 189, licenseStatus: "Licensed", category: "Security" },
];

const statusBadge: Record<LicenseStatus, string> = {
  Licensed: "bg-green-100 text-green-700",
  Unlicensed: "bg-red-100 text-red-700",
  Trial: "bg-amber-100 text-amber-700",
};

export default function SoftwarePage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filtered = softwareData.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.publisher.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Software Inventory</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Track installed software across all devices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} text-white`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search software, publisher, or category..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Software Name</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Publisher</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Version</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Install Count</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">License Status</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((sw) => (
              <tr key={sw.name} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{sw.name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{sw.publisher}</td>
                <td className="px-4 py-3 font-mono text-zinc-600 dark:text-zinc-400">{sw.version}</td>
                <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{sw.installCount}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[sw.licenseStatus]}`}>
                    {sw.licenseStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{sw.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
