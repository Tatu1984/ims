"use client";

import { useState } from "react";
import {
  Search,
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Plus,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApi } from "@/frontend/hooks/use-api";
import {
  getSoftware,
  createSoftware,
  updateSoftware,
} from "@/frontend/api/endpoints/software.api";

type LicenseStatus = "Licensed" | "Unlicensed" | "Trial" | "Unauthorized";

interface SoftwareItem {
  id: string;
  name: string;
  publisher: string;
  version: string;
  installCount: number;
  licenseStatus: LicenseStatus;
  category: string;
  createdAt: string;
}

function statusBadgeClass(status: LicenseStatus) {
  switch (status) {
    case "Licensed":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case "Unlicensed":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "Trial":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Unauthorized":
      return "bg-red-500/15 text-red-400 border-red-500/30";
  }
}

export default function SoftwarePage() {
  const { data: software, loading, error, refetch } = useApi<SoftwareItem[]>(
    () => getSoftware(),
    []
  );
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    publisher: "",
    version: "",
    category: "",
  });

  // Detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSw, setSelectedSw] = useState<SoftwareItem | null>(null);

  // Manage License dialog
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [licenseSwId, setLicenseSwId] = useState("");
  const [licenseSwName, setLicenseSwName] = useState("");
  const [newLicenseStatus, setNewLicenseStatus] = useState<LicenseStatus>("Licensed");

  // Flag as Unauthorized confirm
  const [flagOpen, setFlagOpen] = useState(false);
  const [flagSwId, setFlagSwId] = useState("");
  const [flagSwName, setFlagSwName] = useState("");

  const items = software || [];

  const filtered = items.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.publisher.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Software", value: String(items.length), icon: Package, color: "bg-blue-500" },
    { label: "Licensed", value: String(items.filter((s) => s.licenseStatus === "Licensed").length), icon: ShieldCheck, color: "bg-green-500" },
    { label: "Unauthorized", value: String(items.filter((s) => s.licenseStatus === "Unauthorized" || s.licenseStatus === "Unlicensed").length), icon: ShieldAlert, color: "bg-red-500" },
    { label: "Trial", value: String(items.filter((s) => s.licenseStatus === "Trial").length), icon: Clock, color: "bg-amber-500" },
  ];

  async function handleSubmit() {
    if (!formData.name.trim()) return;
    setSubmitting(true);
    try {
      await createSoftware({
        name: formData.name.trim(),
        publisher: formData.publisher.trim() || "Unknown",
        version: formData.version.trim() || "1.0.0",
        category: formData.category.trim() || "Other",
      });
      setDialogOpen(false);
      setFormData({ name: "", publisher: "", version: "", category: "" });
      await refetch();
    } catch {
      // error is handled by useApi on refetch
    } finally {
      setSubmitting(false);
    }
  }

  function handleViewDetails(sw: SoftwareItem) {
    setSelectedSw(sw);
    setDetailOpen(true);
  }

  function handleManageLicense(sw: SoftwareItem) {
    setLicenseSwId(sw.id);
    setLicenseSwName(sw.name);
    setNewLicenseStatus(sw.licenseStatus);
    setLicenseOpen(true);
  }

  async function handleSaveLicense() {
    setSubmitting(true);
    try {
      await updateSoftware(licenseSwId, { licenseStatus: newLicenseStatus });
      setLicenseOpen(false);
      await refetch();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  function handleFlagUnauthorized(sw: SoftwareItem) {
    setFlagSwId(sw.id);
    setFlagSwName(sw.name);
    setFlagOpen(true);
  }

  async function confirmFlag() {
    setSubmitting(true);
    try {
      await updateSoftware(flagSwId, { licenseStatus: "Unauthorized" });
      setFlagOpen(false);
      await refetch();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <Button variant="outline" onClick={refetch} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Software Inventory</h1>
          <p className="text-sm text-zinc-400">Track installed software across all devices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Software
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-50">Add New Software</DialogTitle>
              <DialogDescription>Enter software details to add to the inventory.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Software Name</Label>
                <Input
                  placeholder="e.g. Microsoft Office 365"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Publisher</Label>
                <Input
                  placeholder="e.g. Microsoft"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Version</Label>
                <Input
                  placeholder="e.g. 16.0.17328"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Category</Label>
                <Input
                  placeholder="e.g. Productivity"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
            </div>
            <DialogFooter className="bg-zinc-900 border-zinc-800">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Software
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} text-white`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-zinc-50">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search software, publisher, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Software Name</TableHead>
                <TableHead className="text-zinc-400">Publisher</TableHead>
                <TableHead className="text-zinc-400">Version</TableHead>
                <TableHead className="text-zinc-400 text-right">Install Count</TableHead>
                <TableHead className="text-zinc-400">License Status</TableHead>
                <TableHead className="text-zinc-400">Category</TableHead>
                <TableHead className="text-zinc-400 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sw) => (
                <TableRow key={sw.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium text-zinc-100">{sw.name}</TableCell>
                  <TableCell className="text-zinc-400">{sw.publisher}</TableCell>
                  <TableCell className="font-mono text-zinc-400">{sw.version}</TableCell>
                  <TableCell className="text-right text-zinc-400">{sw.installCount}</TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClass(sw.licenseStatus)}>
                      {sw.licenseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{sw.category}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100" onClick={() => handleViewDetails(sw)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100" onClick={() => handleManageLicense(sw)}>
                          Manage License
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400" onClick={() => handleFlagUnauthorized(sw)}>
                          Flag as Unauthorized
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow className="border-zinc-800">
                  <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
                    No software found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Software Details</DialogTitle>
          </DialogHeader>
          {selectedSw && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Name</p>
                  <p className="text-sm text-zinc-100">{selectedSw.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Publisher</p>
                  <p className="text-sm text-zinc-100">{selectedSw.publisher}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Version</p>
                  <p className="text-sm font-mono text-zinc-100">{selectedSw.version}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Category</p>
                  <p className="text-sm text-zinc-100">{selectedSw.category}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Install Count</p>
                  <p className="text-sm text-zinc-100">{selectedSw.installCount} devices</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">License Status</p>
                  <Badge className={statusBadgeClass(selectedSw.licenseStatus)}>
                    {selectedSw.licenseStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="bg-zinc-900 border-zinc-800">
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage License Dialog */}
      <Dialog open={licenseOpen} onOpenChange={setLicenseOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Manage License</DialogTitle>
            <DialogDescription>Update the license status for {licenseSwName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">License Status</Label>
              <Select value={newLicenseStatus} onValueChange={(val) => setNewLicenseStatus(val as LicenseStatus)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="Licensed">Licensed</SelectItem>
                  <SelectItem value="Unlicensed">Unlicensed</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="bg-zinc-900 border-zinc-800">
            <Button variant="outline" onClick={() => setLicenseOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button onClick={handleSaveLicense} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag as Unauthorized Confirmation */}
      <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Flag as Unauthorized</DialogTitle>
            <DialogDescription>
              Are you sure you want to flag <span className="font-medium text-zinc-200">{flagSwName}</span> as unauthorized software?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            This will mark the software as unauthorized across all devices where it is installed.
          </div>
          <DialogFooter className="bg-zinc-900 border-zinc-800">
            <Button variant="outline" onClick={() => setFlagOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmFlag} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Flag as Unauthorized
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
