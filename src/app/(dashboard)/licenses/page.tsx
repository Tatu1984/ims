"use client";

import { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
} from "lucide-react";

const stats = [
  { label: "Total Licenses", value: "287", icon: KeyRound, color: "bg-blue-500" },
  { label: "Compliant", value: "256", icon: ShieldCheck, color: "bg-green-500" },
  { label: "Over-allocated", value: "12", icon: AlertTriangle, color: "bg-red-500" },
  { label: "Expiring", value: "8", icon: Clock, color: "bg-amber-500" },
];

type LicenseType = "Volume" | "Per-seat" | "Subscription" | "OEM";

interface LicenseItem {
  software: string;
  licenseType: LicenseType;
  totalLicenses: number;
  inUse: number;
  available: number;
  compliancePct: number;
  expiryDate: string;
}

const licenseData: LicenseItem[] = [
  { software: "Microsoft Office 365", licenseType: "Subscription", totalLicenses: 300, inUse: 245, available: 55, compliancePct: 82, expiryDate: "2026-12-31" },
  { software: "Adobe Creative Suite", licenseType: "Per-seat", totalLicenses: 50, inUse: 48, available: 2, compliancePct: 96, expiryDate: "2026-09-15" },
  { software: "AutoCAD 2024", licenseType: "Volume", totalLicenses: 20, inUse: 15, available: 5, compliancePct: 75, expiryDate: "2027-03-01" },
  { software: "Slack Business+", licenseType: "Subscription", totalLicenses: 200, inUse: 198, available: 2, compliancePct: 99, expiryDate: "2026-06-30" },
  { software: "Zoom Workplace", licenseType: "Subscription", totalLicenses: 300, inUse: 276, available: 24, compliancePct: 92, expiryDate: "2026-08-15" },
  { software: "Windows 11 Pro", licenseType: "OEM", totalLicenses: 500, inUse: 487, available: 13, compliancePct: 97, expiryDate: "Perpetual" },
  { software: "Norton 360", licenseType: "Volume", totalLicenses: 200, inUse: 189, available: 11, compliancePct: 95, expiryDate: "2026-04-20" },
  { software: "Postman Enterprise", licenseType: "Per-seat", totalLicenses: 30, inUse: 42, available: -12, compliancePct: 40, expiryDate: "2026-11-01" },
];

const typeBadge: Record<LicenseType, string> = {
  Volume: "bg-purple-100 text-purple-700",
  "Per-seat": "bg-blue-100 text-blue-700",
  Subscription: "bg-cyan-100 text-cyan-700",
  OEM: "bg-zinc-100 text-zinc-700",
};

function complianceColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function complianceTrackColor(pct: number) {
  if (pct >= 80) return "bg-green-100 dark:bg-green-900/30";
  if (pct >= 50) return "bg-amber-100 dark:bg-amber-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

export default function LicensesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">License Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Software license compliance tracking</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add License
        </button>
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Software</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">License Type</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Total Licenses</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">In Use</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Available</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Compliance</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {licenseData.map((lic) => (
              <tr key={lic.software} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{lic.software}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadge[lic.licenseType]}`}>
                    {lic.licenseType}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{lic.totalLicenses}</td>
                <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{lic.inUse}</td>
                <td className={`px-4 py-3 text-right font-medium ${lic.available < 0 ? "text-red-600" : "text-zinc-600 dark:text-zinc-400"}`}>
                  {lic.available}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-24 rounded-full ${complianceTrackColor(lic.compliancePct)}`}>
                      <div
                        className={`h-2 rounded-full ${complianceColor(lic.compliancePct)}`}
                        style={{ width: `${Math.min(lic.compliancePct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{lic.compliancePct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{lic.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add License Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add New License</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Enter software license details below.</p>
            <div className="mt-4 space-y-3">
              <input placeholder="Software Name" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
              <select className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                <option>Volume</option>
                <option>Per-seat</option>
                <option>Subscription</option>
                <option>OEM</option>
              </select>
              <input type="number" placeholder="Total Licenses" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
              <input type="date" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Add License
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
