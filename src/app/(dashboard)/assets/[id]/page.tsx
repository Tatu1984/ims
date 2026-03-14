"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  MapPin,
  User,
  Building2,
  TicketPlus,
  Pencil,
  Clock,
  Package,
  RefreshCw,
  ShieldCheck,
  ArrowUpCircle,
  Tag,
  Calendar,
  Hash,
  UserCog,
  Archive,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useApi } from "@/frontend/hooks/use-api";
import { getAsset, updateAsset } from "@/frontend/api/endpoints/assets.api";
import { createTicket } from "@/frontend/api/endpoints/tickets.api";

interface AssetDetail {
  id: string;
  assetTag: string;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  assignedToName: string;
  assignedTo?: { id: string; name: string; initials: string } | null;
  department: string;
  location?: string | null;
  purchaseDate?: string | null;
  purchaseCost?: number | string | null;
  warrantyExpiry?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Static mock data (would need separate APIs)
const hardwareComponents = [
  { component: "Processor", spec: "Intel Core Ultra 7 155H", details: "16 cores / 22 threads, up to 4.8 GHz", status: "OK" },
  { component: "Memory Module 1", spec: "16 GB DDR5-5600 SODIMM", details: "Samsung M425R2GA3BB0-CQKOL", status: "OK" },
  { component: "Memory Module 2", spec: "16 GB DDR5-5600 SODIMM", details: "Samsung M425R2GA3BB0-CQKOL", status: "OK" },
  { component: "Storage (NVMe)", spec: "1 TB Samsung 990 Pro", details: "PCIe 4.0 x4, M.2 2280", status: "OK" },
  { component: "Display", spec: '14.0" FHD+ IPS', details: "1920x1200, 60Hz, 300 nits", status: "OK" },
  { component: "Network (WiFi)", spec: "Intel Wi-Fi 6E AX211", details: "2x2, 802.11ax, Bluetooth 5.3", status: "OK" },
  { component: "Network (Ethernet)", spec: "Intel I219-LM", details: "1 GbE", status: "OK" },
  { component: "Battery", spec: "57 Whr, 4-cell", details: "Polymer, integrated", status: "Good - 94% health" },
  { component: "Graphics", spec: "Intel Arc Graphics", details: "Integrated", status: "OK" },
];

const softwareList = [
  { name: "Windows 11 Pro", version: "24H2 (26100.3194)", publisher: "Microsoft", license: "Volume License", installDate: "Jan 15, 2025" },
  { name: "Microsoft 365 Apps", version: "2502 (Build 18526)", publisher: "Microsoft", license: "Subscription", installDate: "Jan 16, 2025" },
  { name: "Visual Studio Code", version: "1.97.2", publisher: "Microsoft", license: "MIT", installDate: "Jan 16, 2025" },
  { name: "Google Chrome", version: "133.0.6943.98", publisher: "Google", license: "Freeware", installDate: "Jan 16, 2025" },
  { name: "Slack", version: "4.41.98", publisher: "Salesforce", license: "Subscription", installDate: "Jan 17, 2025" },
  { name: "Zoom Workplace", version: "6.4.2", publisher: "Zoom", license: "Subscription", installDate: "Jan 17, 2025" },
  { name: "CrowdStrike Falcon", version: "7.20.17606", publisher: "CrowdStrike", license: "Enterprise", installDate: "Jan 15, 2025" },
  { name: "Dell Command Update", version: "5.4.0", publisher: "Dell", license: "OEM", installDate: "Jan 15, 2025" },
];

const historyEvents = [
  {
    id: 1,
    icon: ArrowUpCircle,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    title: "OS updated to Windows 11 24H2",
    description: "Automatic update applied via WSUS. Reboot completed successfully.",
    actor: "System (WSUS)",
    timestamp: "Mar 10, 2026 - 2:15 PM",
  },
  {
    id: 2,
    icon: ShieldCheck,
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
    title: "Annual audit completed - verified",
    description: "Physical asset verified at assigned location. All components accounted for.",
    actor: "IT Audit Team",
    timestamp: "Mar 8, 2026 - 9:00 AM",
  },
  {
    id: 3,
    icon: RefreshCw,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    title: "RAM upgraded from 16 GB to 32 GB",
    description: "Added second 16 GB DDR5-5600 SODIMM module. Verified in BIOS and OS.",
    actor: "Mike Chen (IT Technician)",
    timestamp: "Feb 22, 2026 - 11:30 AM",
  },
  {
    id: 4,
    icon: Wrench,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    title: "Maintenance: Battery diagnostics",
    description: "Battery health check performed. Result: 94% capacity. No replacement needed.",
    actor: "Mike Chen (IT Technician)",
    timestamp: "Feb 20, 2026 - 3:00 PM",
  },
  {
    id: 5,
    icon: User,
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    title: "Reassigned from Sarah Lee to James Thompson",
    description: "Transfer due to department change. Asset physically relocated to Bldg A, Floor 3.",
    actor: "Admin (HR Request #4521)",
    timestamp: "Feb 15, 2026 - 10:00 AM",
  },
  {
    id: 6,
    icon: CheckCircle2,
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
    title: "Initial setup and enrollment completed",
    description: "Domain joined, Intune enrolled, CrowdStrike agent installed, user profile configured.",
    actor: "Priya Patel (IT Support)",
    timestamp: "Jan 16, 2025 - 11:00 AM",
  },
  {
    id: 7,
    icon: Truck,
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    title: "Asset received and inventoried",
    description: "Received from Dell via PO #2025-0041. Unpacked, tagged, and entered into inventory.",
    actor: "Receiving Dock",
    timestamp: "Jan 15, 2025 - 3:45 PM",
  },
];

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(value: string | number | null | undefined): string {
  if (value == null) return "N/A";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "N/A";
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-500/15 text-green-400";
    case "InStorage":
      return "bg-blue-500/15 text-blue-400";
    case "Maintenance":
      return "bg-amber-500/15 text-amber-400";
    case "Retired":
      return "bg-zinc-500/15 text-zinc-400";
    default:
      return "bg-green-500/15 text-green-400";
  }
}

function typeBadgeLabel(type: string): string {
  switch (type) {
    case "desktop": return "Desktop";
    case "laptop": return "Laptop";
    case "server": return "Server";
    case "printer": return "Printer";
    case "peripheral": return "Peripheral";
    default: return type;
  }
}

function ProgressBar({
  value,
  max,
  label,
  unit,
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
}) {
  const pct = Math.round((value / max) * 100);
  const barColor =
    pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-green-500";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium text-zinc-100">
          {value} / {max} {unit} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen space-y-6 bg-zinc-950 p-6 animate-pulse">
      <div className="h-8 w-32 bg-zinc-800 rounded" />
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-800 rounded" />
        <div className="h-4 w-48 bg-zinc-800 rounded" />
      </div>
      <div className="h-10 w-80 bg-zinc-900 border border-zinc-800 rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl" />
          <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl" />
          <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: asset, loading, error, refetch } = useApi<AssetDetail>(
    () => getAsset(id),
    [id]
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [retireDialogOpen, setRetireDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // Ticket form state
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");

  // Reassign form state
  const [reassignTo, setReassignTo] = useState("");
  const [reassignDept, setReassignDept] = useState("");

  // Populate edit form when dialog opens
  const handleEditOpen = (open: boolean) => {
    if (open && asset) {
      setEditName(asset.name);
      setEditAssignedTo(asset.assignedToName || "");
      setEditDepartment(asset.department || "");
      setEditLocation(asset.location || "");
    }
    setEditDialogOpen(open);
  };

  // Save edit
  const handleEditSave = async () => {
    setSaving(true);
    try {
      await updateAsset(id, {
        name: editName,
        assignedToName: editAssignedTo,
        department: editDepartment,
        location: editLocation,
      });
      setEditDialogOpen(false);
      await refetch();
    } catch (err) {
      console.error("Failed to update asset:", err);
    } finally {
      setSaving(false);
    }
  };

  // Create ticket
  const handleCreateTicket = async () => {
    setSaving(true);
    try {
      await createTicket({
        title: ticketTitle,
        description: ticketDescription,
        assetId: id,
      });
      setTicketDialogOpen(false);
      setTicketTitle("");
      setTicketDescription("");
    } catch (err) {
      console.error("Failed to create ticket:", err);
    } finally {
      setSaving(false);
    }
  };

  // Reassign
  const handleReassign = async () => {
    setSaving(true);
    try {
      await updateAsset(id, {
        assignedToName: reassignTo,
        department: reassignDept,
      });
      setReassignDialogOpen(false);
      setReassignTo("");
      setReassignDept("");
      await refetch();
    } catch (err) {
      console.error("Failed to reassign asset:", err);
    } finally {
      setSaving(false);
    }
  };

  // Retire
  const handleRetire = async () => {
    setSaving(true);
    try {
      await updateAsset(id, { status: "Retired" });
      setRetireDialogOpen(false);
      await refetch();
    } catch (err) {
      console.error("Failed to retire asset:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6">
        <Link href="/assets">
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Assets
          </Button>
        </Link>
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Error Loading Asset</h2>
          <p className="text-zinc-400 mb-4">{error}</p>
          <Button onClick={() => refetch()} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6">
        <Link href="/assets">
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Assets
          </Button>
        </Link>
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Package className="h-12 w-12 text-zinc-500 mb-4" />
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Asset Not Found</h2>
          <p className="text-zinc-400">The asset you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const assignedToDisplay = asset.assignedTo?.name || asset.assignedToName || "Unassigned";

  return (
    <div className="min-h-screen space-y-6 bg-zinc-950 p-6">
      {/* Back Button */}
      <Link href="/assets">
        <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Assets
        </Button>
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-100">{asset.name}</h1>
          <Badge className={statusBadgeClass(asset.status)}>
            {asset.status}
          </Badge>
          <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
            {typeBadgeLabel(asset.type)}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          {asset.assetTag} &middot; S/N: {asset.serialNumber}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - 2/3 */}
            <div className="space-y-6 lg:col-span-2">
              {/* Asset Details Card */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">Asset Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Tag className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Asset Tag</p>
                        <p className="text-sm font-mono text-zinc-100">{asset.assetTag}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hash className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Serial Number</p>
                        <p className="text-sm font-mono text-zinc-100">{asset.serialNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Monitor className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Type</p>
                        <p className="text-sm text-zinc-100">{typeBadgeLabel(asset.type)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Assigned To</p>
                        <p className="text-sm text-zinc-100">{assignedToDisplay}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Department</p>
                        <p className="text-sm text-zinc-100">{asset.department || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Location</p>
                        <p className="text-sm text-zinc-100">{asset.location || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Purchase Date / Cost</p>
                        <p className="text-sm text-zinc-100">{formatDate(asset.purchaseDate)} &middot; {formatCurrency(asset.purchaseCost)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-zinc-500" />
                      <div>
                        <p className="text-xs font-medium uppercase text-zinc-500">Warranty Expiry</p>
                        <p className="text-sm text-zinc-100">{formatDate(asset.warrantyExpiry)}</p>
                      </div>
                    </div>
                    {asset.notes && (
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <Package className="mt-0.5 h-5 w-5 text-zinc-500" />
                        <div>
                          <p className="text-xs font-medium uppercase text-zinc-500">Notes</p>
                          <p className="text-sm text-zinc-100">{asset.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Hardware Specs Card (static mock) */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">Hardware Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-sm">
                      <Cpu className="h-4 w-4 text-zinc-500" />
                      <span className="font-medium text-zinc-400">Processor:</span>
                      <span className="text-zinc-100">Intel Core Ultra 7 155H</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MemoryStick className="h-4 w-4 text-zinc-500" />
                      <span className="font-medium text-zinc-400">Memory:</span>
                      <span className="text-zinc-100">32 GB DDR5-5600</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <HardDrive className="h-4 w-4 text-zinc-500" />
                        <span className="font-medium text-zinc-400">Storage:</span>
                        <span className="text-zinc-100">1 TB NVMe SSD (Samsung 990 Pro)</span>
                      </div>
                      <ProgressBar
                        value={470}
                        max={1000}
                        label="Disk Usage"
                        unit="GB"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 1/3 */}
            <div className="space-y-6">
              {/* Quick Actions Card */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Edit Asset Dialog */}
                    <Dialog open={editDialogOpen} onOpenChange={handleEditOpen}>
                      <DialogTrigger render={
                        <Button variant="outline" className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100" />
                      }>
                        <Pencil className="h-4 w-4 text-blue-400" />
                        Edit Asset
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-zinc-100">Edit Asset</DialogTitle>
                          <DialogDescription className="text-zinc-400">
                            Update the asset information below.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">Name</Label>
                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">Assigned To</Label>
                            <Input value={editAssignedTo} onChange={(e) => setEditAssignedTo(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">Department</Label>
                            <Input value={editDepartment} onChange={(e) => setEditDepartment(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">Location</Label>
                            <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
                          <Button onClick={handleEditSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Create Ticket Dialog */}
                    <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
                      <DialogTrigger render={
                        <Button variant="outline" className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100" />
                      }>
                        <TicketPlus className="h-4 w-4 text-orange-400" />
                        Create Ticket
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-zinc-100">Create Support Ticket</DialogTitle>
                          <DialogDescription className="text-zinc-400">
                            Create a ticket for asset {asset.assetTag}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">Title</Label>
                            <Input placeholder="Brief description of the issue" value={ticketTitle} onChange={(e) => setTicketTitle(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">Description</Label>
                            <textarea
                              placeholder="Provide details about the issue..."
                              value={ticketDescription}
                              onChange={(e) => setTicketDescription(e.target.value)}
                              rows={4}
                              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setTicketDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
                          <Button onClick={handleCreateTicket} disabled={saving}>{saving ? "Creating..." : "Create Ticket"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Reassign Dialog */}
                    <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
                      <DialogTrigger render={
                        <Button variant="outline" className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100" />
                      }>
                        <UserCog className="h-4 w-4 text-green-400" />
                        Reassign Asset
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-zinc-100">Reassign Asset</DialogTitle>
                          <DialogDescription className="text-zinc-400">
                            Currently assigned to: {assignedToDisplay}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">New Assignee</Label>
                            <Input placeholder="Enter name" value={reassignTo} onChange={(e) => setReassignTo(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-zinc-300">New Department</Label>
                            <Input placeholder="Enter department" value={reassignDept} onChange={(e) => setReassignDept(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setReassignDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
                          <Button onClick={handleReassign} disabled={saving}>{saving ? "Reassigning..." : "Reassign"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Retire Dialog */}
                    <Dialog open={retireDialogOpen} onOpenChange={setRetireDialogOpen}>
                      <DialogTrigger render={
                        <Button variant="outline" className="w-full justify-start border-zinc-700 text-red-400 hover:bg-red-500/10 hover:text-red-300" />
                      }>
                        <Archive className="h-4 w-4" />
                        Retire Asset
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-zinc-100">Retire Asset</DialogTitle>
                          <DialogDescription className="text-zinc-400">
                            Are you sure you want to retire <span className="font-medium text-zinc-200">{asset.name}</span> ({asset.assetTag})? This will mark the asset as decommissioned.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>This action will remove the asset from active inventory. The record will be preserved for audit purposes.</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRetireDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
                          <Button variant="destructive" onClick={handleRetire} disabled={saving}>{saving ? "Retiring..." : "Confirm Retire"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Lifecycle Timeline Card */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">Lifecycle Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historyEvents.slice(0, 5).map((event, index) => (
                      <div key={event.id} className="relative flex gap-3">
                        {index < 4 && (
                          <div className="absolute left-[11px] top-7 h-full w-px bg-zinc-700" />
                        )}
                        <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${event.bgColor}`}>
                          <event.icon className={`h-4 w-4 ${event.iconColor}`} />
                        </div>
                        <div className="min-w-0 pb-2">
                          <p className="text-sm font-medium text-zinc-100">
                            {event.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Hardware Tab */}
        <TabsContent value="hardware">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Hardware Components</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Component</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Specification</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Details</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hardwareComponents.map((hw, i) => (
                    <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/60">
                      <TableCell className="text-sm font-medium text-zinc-100">{hw.component}</TableCell>
                      <TableCell className="text-sm text-zinc-300">{hw.spec}</TableCell>
                      <TableCell className="text-sm text-zinc-400">{hw.details}</TableCell>
                      <TableCell>
                        <Badge className={hw.status === "OK" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}>
                          {hw.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Software Tab */}
        <TabsContent value="software">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Installed Software</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Name</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Version</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Publisher</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">License</TableHead>
                    <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Install Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {softwareList.map((sw, i) => (
                    <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/60">
                      <TableCell className="text-sm font-medium text-zinc-100">{sw.name}</TableCell>
                      <TableCell className="text-sm font-mono text-zinc-400">{sw.version}</TableCell>
                      <TableCell className="text-sm text-zinc-300">{sw.publisher}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          sw.license === "Subscription" ? "border-blue-500/50 text-blue-400 bg-blue-500/10" :
                          sw.license === "Enterprise" ? "border-purple-500/50 text-purple-400 bg-purple-500/10" :
                          sw.license === "Volume License" ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" :
                          "border-zinc-600 text-zinc-400 bg-zinc-500/10"
                        }>
                          {sw.license}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-400">{sw.installDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Full Asset History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {historyEvents.map((event, index) => (
                  <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Vertical line */}
                    {index < historyEvents.length - 1 && (
                      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-zinc-700" />
                    )}
                    {/* Icon */}
                    <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${event.bgColor}`}>
                      <event.icon className={`h-4 w-4 ${event.iconColor}`} />
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-100">{event.title}</p>
                          <p className="mt-1 text-sm text-zinc-400">{event.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.actor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
