"use client";

import { useState, useEffect, useCallback } from "react";
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
  MoreHorizontal,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getReports,
  createReport,
  deleteReport,
} from "@/frontend/api/endpoints/reports.api";
import { useAuthStore } from "@/frontend/store/auth.store";

interface ReportTemplate {
  title: string;
  description: string;
  icon: React.ReactNode;
  lastGenerated: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    title: "Asset Inventory",
    description:
      "Complete inventory of all hardware and software assets with lifecycle status and assignment details.",
    icon: <Package className="h-6 w-6 text-blue-400" />,
    lastGenerated: "Mar 14, 2026",
  },
  {
    title: "Software Compliance",
    description:
      "Audit of installed software against approved licenses and compliance policies.",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    lastGenerated: "Mar 12, 2026",
  },
  {
    title: "Security Audit",
    description:
      "Security posture assessment including vulnerabilities, patch levels, and policy violations.",
    icon: <Shield className="h-6 w-6 text-red-400" />,
    lastGenerated: "Mar 10, 2026",
  },
  {
    title: "License Usage",
    description:
      "Software license utilization metrics with renewal dates and cost optimization insights.",
    icon: <KeyRound className="h-6 w-6 text-amber-400" />,
    lastGenerated: "Mar 11, 2026",
  },
  {
    title: "Warranty Expiration",
    description:
      "Hardware assets with upcoming warranty expirations and renewal recommendations.",
    icon: <ClipboardCheck className="h-6 w-6 text-purple-400" />,
    lastGenerated: "Mar 13, 2026",
  },
  {
    title: "Depreciation Report",
    description:
      "Asset depreciation tracking with current book value and scheduled write-off dates.",
    icon: <TrendingDown className="h-6 w-6 text-cyan-400" />,
    lastGenerated: "Mar 14, 2026",
  },
];

interface ApiReport {
  id: string;
  name: string;
  type: string;
  status: "Ready" | "Generating";
  fileSize: string | null;
  filePath: string | null;
  createdAt: string;
  generatedBy: {
    id: string;
    name: string;
    initials: string;
  };
}

const typeBadgeColor: Record<string, string> = {
  Inventory: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Security: "bg-red-500/15 text-red-400 border-red-500/30",
  Compliance: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  License: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Network: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("Asset Inventory");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [format, setFormat] = useState("PDF");

  // View report dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewReport, setViewReport] = useState<ApiReport | null>(null);

  // Share dialog
  const [shareOpen, setShareOpen] = useState(false);
  const [shareReportName, setShareReportName] = useState("");
  const [shareEmail, setShareEmail] = useState("");

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [deleteReportName, setDeleteReportName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReports() as { success: boolean; data: ApiReport[] };
      if (res.success) {
        setReports(res.data);
      } else {
        setError("Failed to load reports.");
      }
    } catch {
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleGenerate() {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    setGenerating(true);
    try {
      const name = `${reportType} - ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
      await createReport({
        name,
        type: reportType.split(" ")[0],
        generatedById: userId,
      });
      setDialogOpen(false);
      await fetchReports();
    } catch {
      setError("Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  }

  function handleTemplateGenerate(templateTitle: string) {
    setReportType(templateTitle);
    setDialogOpen(true);
  }

  function handleViewReport(report: ApiReport) {
    setViewReport(report);
    setViewOpen(true);
  }

  function handleShareReport(report: ApiReport) {
    setShareReportName(report.name);
    setShareEmail("");
    setShareOpen(true);
  }

  function confirmShare() {
    setShareOpen(false);
  }

  function handleDeleteReport(report: ApiReport) {
    setDeleteReportId(report.id);
    setDeleteReportName(report.name);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deleteReportId) return;
    setDeleting(true);
    try {
      await deleteReport(deleteReportId);
      setDeleteOpen(false);
      await fetchReports();
    } catch {
      setError("Failed to delete report.");
    } finally {
      setDeleting(false);
    }
  }

  function handleDownload(report: ApiReport) {
    // Create a sample text file download
    const blob = new Blob(
      [
        `Report: ${report.name}\nType: ${report.type}\nGenerated: ${formatDate(report.createdAt)}\nGenerated By: ${report.generatedBy.name}`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Generate and manage reports
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Report
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Generate Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Report Type</Label>
                <Select value={reportType} onValueChange={(val) => { if (val) setReportType(val); }}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {reportTemplates.map((t) => (
                      <SelectItem key={t.title} value={t.title}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Date From</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Date To</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Format</Label>
                <Select value={format} onValueChange={(val) => { if (val) setFormat(val); }}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={generating}>
                {generating && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                Generate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error State */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30 p-4">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchReports}>
            Retry
          </Button>
        </Card>
      )}

      {/* Report Templates Grid */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Report Templates
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((tpl) => (
            <Card
              key={tpl.title}
              className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors flex flex-col"
            >
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                    {tpl.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {tpl.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 mb-4 flex-1">
                  {tpl.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3.5 w-3.5" />
                    Last: {tpl.lastGenerated}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleTemplateGenerate(tpl.title)}>
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports Table */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">
            Recent Reports
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Report Name</TableHead>
              <TableHead className="text-zinc-400">Type</TableHead>
              <TableHead className="text-zinc-400">Generated By</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Size</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading reports...
                  </div>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="border-zinc-800 hover:bg-zinc-800/50"
                >
                  <TableCell className="font-medium text-zinc-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-zinc-500" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[11px] border ${
                        typeBadgeColor[report.type] ??
                        "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                      }`}
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {report.generatedBy.name}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {report.fileSize || "\u2014"}
                  </TableCell>
                  <TableCell>
                    {report.status === "Ready" ? (
                      <Badge className="text-[11px] border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                    ) : (
                      <Badge className="text-[11px] border bg-amber-500/15 text-amber-400 border-amber-500/30">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Generating
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={report.status !== "Ready"}
                        className="gap-1"
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-900 border-zinc-800"
                        >
                          <DropdownMenuItem className="text-zinc-300" onClick={() => handleViewReport(report)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-zinc-300" onClick={() => handleShareReport(report)}>
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-zinc-800" />
                          <DropdownMenuItem className="text-red-400" onClick={() => handleDeleteReport(report)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Report Details</DialogTitle>
          </DialogHeader>
          {viewReport && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Report Name</p>
                  <p className="text-sm text-zinc-100">{viewReport.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Type</p>
                  <p className="text-sm text-zinc-100">{viewReport.type}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Generated By</p>
                  <p className="text-sm text-zinc-100">{viewReport.generatedBy.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Date</p>
                  <p className="text-sm text-zinc-100">{formatDate(viewReport.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Size</p>
                  <p className="text-sm text-zinc-100">{viewReport.fileSize || "\u2014"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Status</p>
                  <Badge className={`text-[11px] border ${viewReport.status === "Ready" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"}`}>
                    {viewReport.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Report Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Share Report</DialogTitle>
            <DialogDescription>Share &quot;{shareReportName}&quot; via email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Email Address</Label>
              <Input
                type="email"
                placeholder="recipient@company.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareOpen(false)}>Cancel</Button>
            <Button onClick={confirmShare}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Report Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteReportName}&quot;?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            This action will permanently delete the report. This cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
