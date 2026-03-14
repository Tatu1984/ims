"use client";

import { useState } from "react";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Monitor,
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";
type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

interface HelpTicket {
  id: string;
  title: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: string;
  initials: string;
  device: string;
  created: string;
  sla: "On Track" | "At Risk" | "Breached";
}

const tickets: HelpTicket[] = [
  {
    id: "TKT-1042",
    title: "Unable to connect to network printer on 3rd floor",
    priority: "High",
    status: "Open",
    assignedTo: "Mike Chen",
    initials: "MC",
    device: "prn-floor3-01",
    created: "2026-03-14 09:15",
    sla: "At Risk",
  },
  {
    id: "TKT-1041",
    title: "Laptop running extremely slow after update",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Sarah Kim",
    initials: "SK",
    device: "ws-eng-042",
    created: "2026-03-14 08:30",
    sla: "On Track",
  },
  {
    id: "TKT-1040",
    title: "VPN connection drops intermittently",
    priority: "High",
    status: "Open",
    assignedTo: "James Liu",
    initials: "JL",
    device: "rtr-vpn-01",
    created: "2026-03-13 16:45",
    sla: "Breached",
  },
  {
    id: "TKT-1039",
    title: "Request for additional monitor setup",
    priority: "Low",
    status: "In Progress",
    assignedTo: "Mike Chen",
    initials: "MC",
    device: "ws-hr-015",
    created: "2026-03-13 14:20",
    sla: "On Track",
  },
  {
    id: "TKT-1038",
    title: "Email sync failing on Outlook desktop client",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Sarah Kim",
    initials: "SK",
    device: "ws-mkt-008",
    created: "2026-03-13 10:00",
    sla: "On Track",
  },
  {
    id: "TKT-1037",
    title: "Server room UPS battery replacement needed",
    priority: "High",
    status: "Closed",
    assignedTo: "James Liu",
    initials: "JL",
    device: "ups-rack-02",
    created: "2026-03-12 11:30",
    sla: "On Track",
  },
];

type FilterTab = "All" | "Open" | "In Progress" | "Resolved" | "Closed";

const priorityBadge: Record<Priority, string> = {
  High: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-gray-200 bg-gray-50 text-gray-600",
};

const statusBadge: Record<TicketStatus, string> = {
  Open: "border-blue-200 bg-blue-50 text-blue-700",
  "In Progress": "border-purple-200 bg-purple-50 text-purple-700",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Closed: "border-gray-200 bg-gray-100 text-gray-500",
};

const slaBadge: Record<string, string> = {
  "On Track": "text-emerald-600",
  "At Risk": "text-amber-600",
  Breached: "text-red-600",
};

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filteredTickets =
    activeTab === "All"
      ? tickets
      : tickets.filter((t) => t.status === activeTab);

  const tabs: FilterTab[] = [
    "All",
    "Open",
    "In Progress",
    "Resolved",
    "Closed",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Helpdesk Tickets
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            IT support ticket management
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Create Ticket
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Open</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Ticket className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Resolved Today
              </p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg Resolution
              </p>
              <p className="text-2xl font-bold text-gray-900">4.2 hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ticket Cards */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-gray-400">
                    {ticket.id}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityBadge[ticket.priority]}`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadge[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {ticket.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Monitor className="h-3.5 w-3.5" />
                    {ticket.device}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {ticket.created}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${slaBadge[ticket.sla]}`}
                  >
                    SLA: {ticket.sla}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600"
                  title={ticket.assignedTo}
                >
                  {ticket.initials}
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {ticket.assignedTo}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              No tickets in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
