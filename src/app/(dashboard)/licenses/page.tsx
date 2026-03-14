"use client";

import { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

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

const initialLicenseData: LicenseItem[] = [
  { software: "Microsoft Office 365", licenseType: "Subscription", totalLicenses: 300, inUse: 245, available: 55, compliancePct: 82, expiryDate: "2026-12-31" },
  { software: "Adobe Creative Suite", licenseType: "Per-seat", totalLicenses: 50, inUse: 48, available: 2, compliancePct: 96, expiryDate: "2026-09-15" },
  { software: "AutoCAD 2024", licenseType: "Volume", totalLicenses: 20, inUse: 15, available: 5, compliancePct: 75, expiryDate: "2027-03-01" },
  { software: "Slack Business+", licenseType: "Subscription", totalLicenses: 200, inUse: 198, available: 2, compliancePct: 99, expiryDate: "2026-06-30" },
  { software: "Zoom Workplace", licenseType: "Subscription", totalLicenses: 300, inUse: 276, available: 24, compliancePct: 92, expiryDate: "2026-08-15" },
  { software: "Windows 11 Pro", licenseType: "OEM", totalLicenses: 500, inUse: 487, available: 13, compliancePct: 97, expiryDate: "Perpetual" },
  { software: "Norton 360", licenseType: "Volume", totalLicenses: 200, inUse: 189, available: 11, compliancePct: 95, expiryDate: "2026-04-20" },
  { software: "Postman Enterprise", licenseType: "Per-seat", totalLicenses: 30, inUse: 42, available: -12, compliancePct: 40, expiryDate: "2026-11-01" },
];

function typeBadgeClass(type: LicenseType) {
  switch (type) {
    case "Volume":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "Per-seat":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "Subscription":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "OEM":
      return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  }
}

function complianceFillColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<LicenseItem[]>(initialLicenseData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    software: "",
    licenseType: "Volume" as LicenseType,
    totalLicenses: "",
    expiryDate: "",
  });

  // Edit License dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    software: "",
    licenseType: "Volume" as LicenseType,
    totalLicenses: "",
    expiryDate: "",
  });
  const [editOriginalName, setEditOriginalName] = useState("");

  // Renew dialog
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewName, setRenewName] = useState("");
  const [renewDate, setRenewDate] = useState("");

  // Remove dialog
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeName, setRemoveName] = useState("");

  const stats = [
    { label: "Total Licenses", value: String(licenses.length), icon: KeyRound, color: "bg-blue-500" },
    { label: "Compliant", value: String(licenses.filter((l) => l.compliancePct >= 80).length), icon: ShieldCheck, color: "bg-green-500" },
    { label: "Over-allocated", value: String(licenses.filter((l) => l.available < 0).length), icon: AlertTriangle, color: "bg-red-500" },
    { label: "Expiring Soon", value: String(licenses.filter((l) => { if (l.expiryDate === "Perpetual") return false; const d = new Date(l.expiryDate); const now = new Date(); const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24); return diff <= 90 && diff > 0; }).length), icon: Clock, color: "bg-amber-500" },
  ];

  function handleSubmit() {
    if (!formData.software.trim()) return;
    const total = parseInt(formData.totalLicenses) || 0;
    const newLic: LicenseItem = {
      software: formData.software.trim(),
      licenseType: formData.licenseType,
      totalLicenses: total,
      inUse: 0,
      available: total,
      compliancePct: 100,
      expiryDate: formData.expiryDate || "Perpetual",
    };
    setLicenses((prev) => [...prev, newLic]);
    setDialogOpen(false);
    setFormData({ software: "", licenseType: "Volume", totalLicenses: "", expiryDate: "" });
  }

  function handleEditLicense(lic: LicenseItem) {
    setEditOriginalName(lic.software);
    setEditData({
      software: lic.software,
      licenseType: lic.licenseType,
      totalLicenses: String(lic.totalLicenses),
      expiryDate: lic.expiryDate === "Perpetual" ? "" : lic.expiryDate,
    });
    setEditOpen(true);
  }

  function handleSaveEdit() {
    const total = parseInt(editData.totalLicenses) || 0;
    setLicenses((prev) =>
      prev.map((l) => {
        if (l.software !== editOriginalName) return l;
        const available = total - l.inUse;
        return {
          ...l,
          software: editData.software.trim() || l.software,
          licenseType: editData.licenseType,
          totalLicenses: total,
          available,
          compliancePct: total > 0 ? Math.round(Math.min((l.inUse / total) * 100, 100)) : 0,
          expiryDate: editData.expiryDate || "Perpetual",
        };
      })
    );
    setEditOpen(false);
  }

  function handleRenew(lic: LicenseItem) {
    setRenewName(lic.software);
    setRenewDate("");
    setRenewOpen(true);
  }

  function handleSaveRenew() {
    if (!renewDate) return;
    setLicenses((prev) =>
      prev.map((l) => (l.software === renewName ? { ...l, expiryDate: renewDate } : l))
    );
    setRenewOpen(false);
  }

  function handleRemove(lic: LicenseItem) {
    setRemoveName(lic.software);
    setRemoveOpen(true);
  }

  function confirmRemove() {
    setLicenses((prev) => prev.filter((l) => l.software !== removeName));
    setRemoveOpen(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">License Management</h1>
          <p className="text-sm text-zinc-400">Software license compliance tracking</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add License
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-50">Add New License</DialogTitle>
              <DialogDescription>Enter software license details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Software Name</Label>
                <Input
                  placeholder="e.g. Microsoft Office 365"
                  value={formData.software}
                  onChange={(e) => setFormData({ ...formData, software: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">License Type</Label>
                <Select
                  value={formData.licenseType}
                  onValueChange={(val) => setFormData({ ...formData, licenseType: val as LicenseType })}
                >
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="Volume">Volume</SelectItem>
                    <SelectItem value="Per-seat">Per-seat</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="OEM">OEM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Total Licenses</Label>
                <Input
                  type="number"
                  placeholder="e.g. 300"
                  value={formData.totalLicenses}
                  onChange={(e) => setFormData({ ...formData, totalLicenses: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Expiry Date</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>
            <DialogFooter className="bg-zinc-900 border-zinc-800">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add License</Button>
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

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Software</TableHead>
                <TableHead className="text-zinc-400">License Type</TableHead>
                <TableHead className="text-zinc-400 text-right">Total</TableHead>
                <TableHead className="text-zinc-400 text-right">In Use</TableHead>
                <TableHead className="text-zinc-400 text-right">Available</TableHead>
                <TableHead className="text-zinc-400">Compliance %</TableHead>
                <TableHead className="text-zinc-400">Expiry Date</TableHead>
                <TableHead className="text-zinc-400 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((lic) => (
                <TableRow key={lic.software} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium text-zinc-100">{lic.software}</TableCell>
                  <TableCell>
                    <Badge className={typeBadgeClass(lic.licenseType)}>
                      {lic.licenseType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-zinc-400">{lic.totalLicenses}</TableCell>
                  <TableCell className="text-right text-zinc-400">{lic.inUse}</TableCell>
                  <TableCell className={`text-right font-medium ${lic.available < 0 ? "text-red-400" : "text-zinc-400"}`}>
                    {lic.available}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-zinc-700">
                        <div
                          className={`h-2 rounded-full ${complianceFillColor(lic.compliancePct)}`}
                          style={{ width: `${Math.min(lic.compliancePct, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-zinc-400">{lic.compliancePct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400">{lic.expiryDate}</TableCell>
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
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100" onClick={() => handleEditLicense(lic)}>
                          Edit License
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100" onClick={() => handleRenew(lic)}>
                          Renew
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400" onClick={() => handleRemove(lic)}>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit License Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Edit License</DialogTitle>
            <DialogDescription>Update license details for {editOriginalName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Software Name</Label>
              <Input
                value={editData.software}
                onChange={(e) => setEditData({ ...editData, software: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">License Type</Label>
              <Select value={editData.licenseType} onValueChange={(val) => setEditData({ ...editData, licenseType: val as LicenseType })}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="Volume">Volume</SelectItem>
                  <SelectItem value="Per-seat">Per-seat</SelectItem>
                  <SelectItem value="Subscription">Subscription</SelectItem>
                  <SelectItem value="OEM">OEM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Total Licenses</Label>
              <Input
                type="number"
                value={editData.totalLicenses}
                onChange={(e) => setEditData({ ...editData, totalLicenses: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Expiry Date</Label>
              <Input
                type="date"
                value={editData.expiryDate}
                onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter className="bg-zinc-900 border-zinc-800">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew License Dialog */}
      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Renew License</DialogTitle>
            <DialogDescription>Set a new expiry date for {renewName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">New Expiry Date</Label>
              <Input
                type="date"
                value={renewDate}
                onChange={(e) => setRenewDate(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter className="bg-zinc-900 border-zinc-800">
            <Button variant="outline" onClick={() => setRenewOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={handleSaveRenew}>Renew License</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove License Confirmation */}
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Remove License</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the license for <span className="font-medium text-zinc-200">{removeName}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            This action will permanently remove the license record. This cannot be undone.
          </div>
          <DialogFooter className="bg-zinc-900 border-zinc-800">
            <Button variant="outline" onClick={() => setRemoveOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button variant="destructive" onClick={confirmRemove}>Remove License</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
