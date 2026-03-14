"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
import { getAuditLogs } from "@/frontend/api/endpoints/audit-log.api";

type ActionType = "Create" | "Update" | "Delete" | "Login" | "Export";

interface AuditEntry {
  id: string;
  action: ActionType;
  resource: string;
  details: string;
  ipAddress: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    initials: string;
  };
}

const actionBadgeClass: Record<ActionType, string> = {
  Create: "border-green-500/30 bg-green-500/10 text-green-400",
  Update: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Delete: "border-red-500/30 bg-red-500/10 text-red-400",
  Login: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  Export: "border-purple-500/30 bg-purple-500/10 text-purple-400",
};

const allActions: Array<"All" | ActionType> = [
  "All",
  "Create",
  "Update",
  "Delete",
  "Login",
  "Export",
];

const pageSize = 5;

export default function AuditLogPage() {
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState<"All" | ActionType>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collect unique users from fetched entries for the filter dropdown
  const [knownUsers, setKnownUsers] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: String(pageSize),
      };
      if (userFilter !== "All Users") params.userId = userFilter;
      if (actionFilter !== "All") params.action = actionFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await getAuditLogs(params) as { success: boolean; data: { data: AuditEntry[]; total: number } };
      if (res.success) {
        const data = res.data;
        setEntries(data.data);
        setTotal(data.total);

        // Build unique user list for filter
        const names = data.data.map((e: AuditEntry) => e.user.name);
        setKnownUsers((prev) => {
          const combined = new Set([...prev, ...names]);
          return Array.from(combined).sort();
        });
      } else {
        setError("Failed to load audit logs.");
      }
    } catch {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, userFilter, actionFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function formatTimestamp(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

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
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 w-auto"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
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
                <SelectItem value="All Users">All Users</SelectItem>
                {knownUsers.map((u) => (
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

      {/* Error State */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30 p-4">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchData}>
            Retry
          </Button>
        </Card>
      )}

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
            {loading ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading audit logs...
                  </div>
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  No entries match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-zinc-800 hover:bg-zinc-800/50"
                >
                  <TableCell className="px-4 font-mono text-xs text-zinc-400">
                    {formatTimestamp(entry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-zinc-700 text-zinc-300 text-[10px]">
                          {entry.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-200">{entry.user.name}</span>
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
              {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-zinc-200">
              {Math.min(currentPage * pageSize, total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-zinc-200">
              {total}
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
