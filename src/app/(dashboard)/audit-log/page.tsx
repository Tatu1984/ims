"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ActionType = "Create" | "Update" | "Delete" | "Login" | "Export";

interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  initials: string;
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
    initials: "JS",
    action: "Create",
    resource: "Asset #A-1248",
    details: "Created new workstation asset ws-eng-050",
    ipAddress: "10.0.1.45",
  },
  {
    id: 2,
    timestamp: "2026-03-14 12:30:18",
    user: "Sarah Kim",
    initials: "SK",
    action: "Update",
    resource: "Ticket #TKT-1041",
    details: "Changed status from Open to In Progress",
    ipAddress: "10.0.1.22",
  },
  {
    id: 3,
    timestamp: "2026-03-14 12:15:44",
    user: "Mike Chen",
    initials: "MC",
    action: "Export",
    resource: "Asset Report",
    details: "Exported full asset inventory to CSV (1,247 records)",
    ipAddress: "10.0.1.30",
  },
  {
    id: 4,
    timestamp: "2026-03-14 11:58:31",
    user: "James Liu",
    initials: "JL",
    action: "Login",
    resource: "System",
    details: "Successful login via SSO",
    ipAddress: "192.168.5.12",
  },
  {
    id: 5,
    timestamp: "2026-03-14 11:42:09",
    user: "Emily Davis",
    initials: "ED",
    action: "Delete",
    resource: "License #LIC-089",
    details: "Removed expired Adobe Creative Suite license",
    ipAddress: "10.0.1.55",
  },
  {
    id: 6,
    timestamp: "2026-03-14 11:20:55",
    user: "John Smith",
    initials: "JS",
    action: "Update",
    resource: "Asset #A-0892",
    details: "Updated firmware version to v4.2.1 for prn-lobby-01",
    ipAddress: "10.0.1.45",
  },
  {
    id: 7,
    timestamp: "2026-03-14 10:50:12",
    user: "Rachel Torres",
    initials: "RT",
    action: "Create",
    resource: "Ticket #TKT-1042",
    details: "Created new ticket: Unable to connect to network printer",
    ipAddress: "192.168.1.100",
  },
  {
    id: 8,
    timestamp: "2026-03-14 10:35:28",
    user: "Sarah Kim",
    initials: "SK",
    action: "Update",
    resource: "Patch #P-2026-03",
    details: "Deployed Windows security patch KB5034441 to 12 endpoints",
    ipAddress: "10.0.1.22",
  },
  {
    id: 9,
    timestamp: "2026-03-14 09:15:40",
    user: "Mike Chen",
    initials: "MC",
    action: "Login",
    resource: "System",
    details: "Successful login via password",
    ipAddress: "10.0.1.30",
  },
  {
    id: 10,
    timestamp: "2026-03-14 08:45:03",
    user: "James Liu",
    initials: "JL",
    action: "Delete",
    resource: "User rachel.torres",
    details: "Deactivated user account (role: Technician)",
    ipAddress: "192.168.5.12",
  },
];

const actionBadgeClass: Record<ActionType, string> = {
  Create: "border-green-500/30 bg-green-500/10 text-green-400",
  Update: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Delete: "border-red-500/30 bg-red-500/10 text-red-400",
  Login: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  Export: "border-purple-500/30 bg-purple-500/10 text-purple-400",
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

const allActions: Array<"All" | ActionType> = [
  "All",
  "Create",
  "Update",
  "Delete",
  "Login",
  "Export",
];

export default function AuditLogPage() {
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState<"All" | ActionType>("All");
  const [dateFrom, setDateFrom] = useState("2026-03-14");
  const [dateTo, setDateTo] = useState("2026-03-14");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEntries = auditEntries.filter((entry) => {
    if (userFilter !== "All Users" && entry.user !== userFilter) return false;
    if (actionFilter !== "All" && entry.action !== actionFilter) return false;
    return true;
  });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Audit Log</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Track all system activities
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="bg-zinc-900 border-zinc-800 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">From</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 w-auto"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 w-auto"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">User</Label>
            <Select
              value={userFilter}
              onValueChange={(val) => {
                setUserFilter(val as string);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {allUsers.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Action Type</Label>
            <Select
              value={actionFilter}
              onValueChange={(val) => {
                setActionFilter(val as "All" | ActionType);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {allActions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a === "All" ? "All Actions" : a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Audit Table */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 px-4">Timestamp</TableHead>
              <TableHead className="text-zinc-400">User</TableHead>
              <TableHead className="text-zinc-400">Action</TableHead>
              <TableHead className="text-zinc-400">Resource</TableHead>
              <TableHead className="text-zinc-400">Details</TableHead>
              <TableHead className="text-zinc-400">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEntries.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  No entries match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEntries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-zinc-800 hover:bg-zinc-800/50"
                >
                  <TableCell className="px-4 font-mono text-xs text-zinc-400">
                    {entry.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-zinc-700 text-zinc-300 text-[10px]">
                          {entry.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-200">{entry.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={actionBadgeClass[entry.action]}
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-zinc-300">
                    {entry.resource}
                  </TableCell>
                  <TableCell className="text-zinc-400 max-w-xs truncate">
                    {entry.details}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-500">
                    {entry.ipAddress}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
          <p className="text-sm text-zinc-400">
            Showing{" "}
            <span className="font-medium text-zinc-200">
              {filteredEntries.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-zinc-200">
              {Math.min(currentPage * pageSize, filteredEntries.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-zinc-200">
              {filteredEntries.length}
            </span>{" "}
            entries
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon-sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? ""
                    : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
