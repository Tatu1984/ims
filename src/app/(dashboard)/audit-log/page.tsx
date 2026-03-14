"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ActionType = "Create" | "Update" | "Delete" | "Login" | "Scan";

interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  action: ActionType;
  resource: string;
  details: string;
  ipAddress: string;
}

const auditEntries: AuditEntry[] = [
  {
    id: 1,
    timestamp: "2026-03-14 12:45:02",
    user: "John Smith",
    action: "Create",
    resource: "Asset #A-1248",
    details: "Created new workstation asset ws-eng-050",
    ipAddress: "10.0.1.45",
  },
  {
    id: 2,
    timestamp: "2026-03-14 12:30:18",
    user: "Sarah Kim",
    action: "Update",
    resource: "Ticket #TKT-1041",
    details: "Changed status from Open to In Progress",
    ipAddress: "10.0.1.22",
  },
  {
    id: 3,
    timestamp: "2026-03-14 12:15:44",
    user: "Mike Chen",
    action: "Scan",
    resource: "Network 192.168.1.0/24",
    details: "Initiated network discovery scan, found 47 devices",
    ipAddress: "10.0.1.30",
  },
  {
    id: 4,
    timestamp: "2026-03-14 11:58:31",
    user: "James Liu",
    action: "Login",
    resource: "System",
    details: "Successful login via SSO",
    ipAddress: "192.168.5.12",
  },
  {
    id: 5,
    timestamp: "2026-03-14 11:42:09",
    user: "Emily Davis",
    action: "Delete",
    resource: "License #LIC-089",
    details: "Removed expired Adobe Creative Suite license",
    ipAddress: "10.0.1.55",
  },
  {
    id: 6,
    timestamp: "2026-03-14 11:20:55",
    user: "John Smith",
    action: "Update",
    resource: "Asset #A-0892",
    details: "Updated firmware version to v4.2.1 for prn-lobby-01",
    ipAddress: "10.0.1.45",
  },
  {
    id: 7,
    timestamp: "2026-03-14 10:50:12",
    user: "Rachel Torres",
    action: "Create",
    resource: "Ticket #TKT-1042",
    details: "Created new ticket: Unable to connect to network printer",
    ipAddress: "192.168.1.100",
  },
  {
    id: 8,
    timestamp: "2026-03-14 10:35:28",
    user: "Sarah Kim",
    action: "Update",
    resource: "Patch #P-2026-03",
    details: "Deployed Windows security patch KB5034441 to 12 endpoints",
    ipAddress: "10.0.1.22",
  },
  {
    id: 9,
    timestamp: "2026-03-14 09:15:40",
    user: "Mike Chen",
    action: "Login",
    resource: "System",
    details: "Successful login via password",
    ipAddress: "10.0.1.30",
  },
  {
    id: 10,
    timestamp: "2026-03-14 08:45:03",
    user: "James Liu",
    action: "Delete",
    resource: "User rachel.torres",
    details: "Deactivated user account (role: Technician)",
    ipAddress: "192.168.5.12",
  },
];

const actionBadge: Record<ActionType, string> = {
  Create: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Update: "border-blue-200 bg-blue-50 text-blue-700",
  Delete: "border-red-200 bg-red-50 text-red-700",
  Login: "border-purple-200 bg-purple-50 text-purple-700",
  Scan: "border-amber-200 bg-amber-50 text-amber-700",
};

const allUsers = [
  "All Users",
  "John Smith",
  "Sarah Kim",
  "Mike Chen",
  "James Liu",
  "Emily Davis",
  "Rachel Torres",
];
const allActions = [
  "All Actions",
  "Create",
  "Update",
  "Delete",
  "Login",
  "Scan",
];

export default function AuditLogPage() {
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [dateFrom, setDateFrom] = useState("2026-03-14");
  const [dateTo, setDateTo] = useState("2026-03-14");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEntries = auditEntries.filter((entry) => {
    if (userFilter !== "All Users" && entry.user !== userFilter) return false;
    if (actionFilter !== "All Actions" && entry.action !== actionFilter)
      return false;
    return true;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredEntries.length / pageSize);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all system activities
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              User
            </label>
            <select
              value={userFilter}
              onChange={(e) => {
                setUserFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              {allUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              {allActions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Action
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Resource
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Details
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="px-6 py-3.5 text-gray-900 whitespace-nowrap">
                    {entry.user}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${actionBadge[entry.action]}`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-medium text-gray-700 whitespace-nowrap">
                    {entry.resource}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 max-w-xs truncate">
                    {entry.details}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                    {entry.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * pageSize, filteredEntries.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {filteredEntries.length}
            </span>{" "}
            entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
