"use client";

import {
  FileText,
  Shield,
  ShieldCheck,
  ClipboardCheck,
  KeyRound,
  Package,
  Plus,
  Download,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ReportTemplate {
  title: string;
  description: string;
  icon: React.ReactNode;
  lastGenerated: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    title: "Asset Inventory Report",
    description:
      "Complete inventory of all hardware and software assets with lifecycle status and assignment details.",
    icon: <Package className="h-6 w-6 text-blue-600" />,
    lastGenerated: "Mar 14, 2026",
  },
  {
    title: "Software Compliance Report",
    description:
      "Audit of installed software against approved licenses and compliance policies.",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
    lastGenerated: "Mar 12, 2026",
  },
  {
    title: "Security Audit Report",
    description:
      "Security posture assessment including vulnerabilities, patch levels, and policy violations.",
    icon: <Shield className="h-6 w-6 text-red-600" />,
    lastGenerated: "Mar 10, 2026",
  },
  {
    title: "License Usage Report",
    description:
      "Software license utilization metrics with renewal dates and cost optimization insights.",
    icon: <KeyRound className="h-6 w-6 text-amber-600" />,
    lastGenerated: "Mar 11, 2026",
  },
  {
    title: "Warranty Expiration Report",
    description:
      "Hardware assets with upcoming warranty expirations and renewal recommendations.",
    icon: <ClipboardCheck className="h-6 w-6 text-purple-600" />,
    lastGenerated: "Mar 13, 2026",
  },
  {
    title: "Depreciation Report",
    description:
      "Asset depreciation tracking with current book value and scheduled write-off dates.",
    icon: <FileText className="h-6 w-6 text-cyan-600" />,
    lastGenerated: "Mar 14, 2026",
  },
];

interface RecentReport {
  name: string;
  type: string;
  generatedBy: string;
  date: string;
  size: string;
  status: "Ready" | "Generating";
}

const recentReports: RecentReport[] = [
  {
    name: "Asset Inventory - Q1 2026",
    type: "Inventory",
    generatedBy: "John Smith",
    date: "2026-03-14 10:30",
    size: "2.4 MB",
    status: "Ready",
  },
  {
    name: "Security Audit - March 2026",
    type: "Security",
    generatedBy: "Sarah Kim",
    date: "2026-03-14 09:15",
    size: "—",
    status: "Generating",
  },
  {
    name: "Patch Compliance Report",
    type: "Patch",
    generatedBy: "Mike Chen",
    date: "2026-03-13 16:45",
    size: "1.8 MB",
    status: "Ready",
  },
  {
    name: "License Usage - Feb 2026",
    type: "License",
    generatedBy: "John Smith",
    date: "2026-03-12 14:00",
    size: "856 KB",
    status: "Ready",
  },
  {
    name: "Network Discovery Summary",
    type: "Network",
    generatedBy: "James Liu",
    date: "2026-03-11 11:20",
    size: "3.1 MB",
    status: "Ready",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and manage reports
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Report Templates Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Report Templates
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((tpl) => (
            <div
              key={tpl.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  {tpl.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {tpl.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex-1">
                {tpl.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  Last: {tpl.lastGenerated}
                </span>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Generate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reports
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Generated By
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentReports.map((report) => (
                <tr
                  key={report.name}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {report.name}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700">
                    {report.generatedBy}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{report.date}</td>
                  <td className="px-6 py-3.5 text-gray-500">{report.size}</td>
                  <td className="px-6 py-3.5">
                    {report.status === "Ready" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Generating
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      disabled={report.status !== "Ready"}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        report.status === "Ready"
                          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
