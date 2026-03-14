"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  TicketPlus,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type AssetType = "desktop" | "laptop" | "server" | "printer" | "peripheral";
type AssetStatus = "Active" | "In Storage" | "Maintenance" | "Retired";

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  assignedTo: string;
  status: AssetStatus;
  department: string;
  purchaseDate: string;
}

const typeLabels: Record<AssetType, string> = {
  desktop: "Desktop",
  laptop: "Laptop",
  server: "Server",
  printer: "Printer",
  peripheral: "Peripheral",
};

const typeBadgeClasses: Record<AssetType, string> = {
  desktop: "border-blue-500/50 text-blue-400 bg-blue-500/10",
  laptop: "border-purple-500/50 text-purple-400 bg-purple-500/10",
  server: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10",
  printer: "border-orange-500/50 text-orange-400 bg-orange-500/10",
  peripheral: "border-teal-500/50 text-teal-400 bg-teal-500/10",
};

const statusBadgeClasses: Record<AssetStatus, string> = {
  Active: "bg-green-500/15 text-green-400",
  "In Storage": "bg-zinc-500/15 text-zinc-400",
  Maintenance: "bg-amber-500/15 text-amber-400",
  Retired: "bg-red-500/15 text-red-400",
};

const initialAssets: Asset[] = [
  {
    id: "ast-001",
    assetTag: "LPT-2025-0451",
    name: "Dell Latitude 7450",
    type: "laptop",
    serialNumber: "DL7450-XK9R2",
    assignedTo: "James Thompson",
    status: "Active",
    department: "Engineering",
    purchaseDate: "Jan 15, 2025",
  },
  {
    id: "ast-002",
    assetTag: "DSK-2024-0089",
    name: "HP EliteDesk 800 G9",
    type: "desktop",
    serialNumber: "HP800G9-M3J7K",
    assignedTo: "Priya Patel",
    status: "Active",
    department: "Finance",
    purchaseDate: "Sep 3, 2024",
  },
  {
    id: "ast-003",
    assetTag: "SRV-2024-0012",
    name: "Dell PowerEdge R760",
    type: "server",
    serialNumber: "DPR760-2NV8P",
    assignedTo: "Server Room A",
    status: "Active",
    department: "Infrastructure",
    purchaseDate: "Jun 20, 2024",
  },
  {
    id: "ast-004",
    assetTag: "LPT-2024-0523",
    name: 'MacBook Pro 16" M4 Pro',
    type: "laptop",
    serialNumber: "MBP16-C9QF4R",
    assignedTo: "Anika Singh",
    status: "Active",
    department: "Design",
    purchaseDate: "Nov 8, 2024",
  },
  {
    id: "ast-005",
    assetTag: "PRN-2023-0034",
    name: "HP LaserJet Pro M404dn",
    type: "printer",
    serialNumber: "HPLJ404-7K2X9",
    assignedTo: "Floor 2 - Shared",
    status: "Active",
    department: "Shared Services",
    purchaseDate: "Mar 12, 2023",
  },
  {
    id: "ast-006",
    assetTag: "DSK-2023-0167",
    name: "Lenovo ThinkCentre M90q",
    type: "desktop",
    serialNumber: "LTC90Q-P5M2N",
    assignedTo: "Mark Williams",
    status: "Maintenance",
    department: "Sales",
    purchaseDate: "Jul 28, 2023",
  },
  {
    id: "ast-007",
    assetTag: "PRF-2025-0022",
    name: "Dell UltraSharp U2723QE",
    type: "peripheral",
    serialNumber: "DU2723-K8R3V",
    assignedTo: "James Thompson",
    status: "Active",
    department: "Engineering",
    purchaseDate: "Jan 15, 2025",
  },
  {
    id: "ast-008",
    assetTag: "LPT-2022-0298",
    name: "Dell Latitude 5530",
    type: "laptop",
    serialNumber: "DL5530-W4N6T",
    assignedTo: "Unassigned",
    status: "In Storage",
    department: "IT Pool",
    purchaseDate: "Apr 5, 2022",
  },
  {
    id: "ast-009",
    assetTag: "SRV-2023-0008",
    name: "HPE ProLiant DL380 Gen10",
    type: "server",
    serialNumber: "HPE380-J2K9M",
    assignedTo: "Server Room B",
    status: "Retired",
    department: "Infrastructure",
    purchaseDate: "Feb 14, 2023",
  },
  {
    id: "ast-010",
    assetTag: "DSK-2025-0002",
    name: "HP EliteOne 870 G9 AiO",
    type: "desktop",
    serialNumber: "HP870G9-R6V3Q",
    assignedTo: "Sarah Chen",
    status: "Active",
    department: "HR",
    purchaseDate: "Feb 1, 2025",
  },
];

const ITEMS_PER_PAGE = 5;

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add asset form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<AssetType>("laptop");
  const [newSerial, setNewSerial] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newPurchaseDate, setNewPurchaseDate] = useState("");

  // Edit Asset dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editStatus, setEditStatus] = useState<AssetStatus>("Active");

  // Create Ticket dialog
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketAssetId, setTicketAssetId] = useState("");
  const [ticketAssetName, setTicketAssetName] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");

  // Export confirmation
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter = activeFilter === "all" || asset.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      asset.name.toLowerCase().includes(q) ||
      asset.assetTag.toLowerCase().includes(q) ||
      asset.serialNumber.toLowerCase().includes(q) ||
      asset.assignedTo.toLowerCase().includes(q) ||
      asset.department.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const rangeStart = filteredAssets.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + ITEMS_PER_PAGE, filteredAssets.length);

  function handleAddAsset() {
    if (!newName.trim()) return;
    const prefixMap: Record<AssetType, string> = {
      desktop: "DSK",
      laptop: "LPT",
      server: "SRV",
      printer: "PRN",
      peripheral: "PRF",
    };
    const id = `ast-${String(assets.length + 1).padStart(3, "0")}`;
    const tag = `${prefixMap[newType]}-2026-${String(assets.length + 1).padStart(4, "0")}`;
    const newAsset: Asset = {
      id,
      assetTag: tag,
      name: newName.trim(),
      type: newType,
      serialNumber: newSerial.trim() || "N/A",
      assignedTo: newAssignedTo.trim() || "Unassigned",
      status: "Active",
      department: newDepartment.trim() || "General",
      purchaseDate: newPurchaseDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setAssets((prev) => [...prev, newAsset]);
    setAddDialogOpen(false);
    setNewName("");
    setNewType("laptop");
    setNewSerial("");
    setNewAssignedTo("");
    setNewDepartment("");
    setNewPurchaseDate("");
  }

  function handleExport(format: string) {
    setExportFormat(format);
    setExportOpen(true);
  }

  function confirmExport() {
    // Generate CSV data
    const headers = ["Asset Tag", "Name", "Type", "Serial Number", "Assigned To", "Status", "Department", "Purchase Date"];
    const rows = filteredAssets.map((a) => [a.assetTag, a.name, typeLabels[a.type], a.serialNumber, a.assignedTo, a.status, a.department, a.purchaseDate]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assets-export.${exportFormat.toLowerCase() === "csv" ? "csv" : exportFormat.toLowerCase() === "excel" ? "csv" : "csv"}`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  function handleRetire(id: string) {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Retired" as AssetStatus } : a))
    );
  }

  function handleEditAsset(asset: Asset) {
    setEditId(asset.id);
    setEditName(asset.name);
    setEditAssignedTo(asset.assignedTo);
    setEditDepartment(asset.department);
    setEditStatus(asset.status);
    setEditOpen(true);
  }

  function handleSaveEdit() {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== editId) return a;
        return {
          ...a,
          name: editName.trim() || a.name,
          assignedTo: editAssignedTo.trim() || a.assignedTo,
          department: editDepartment.trim() || a.department,
          status: editStatus,
        };
      })
    );
    setEditOpen(false);
  }

  function handleCreateTicket(asset: Asset) {
    setTicketAssetId(asset.id);
    setTicketAssetName(`${asset.name} (${asset.assetTag})`);
    setTicketTitle("");
    setTicketDescription("");
    setTicketOpen(true);
  }

  function confirmCreateTicket() {
    setTicketOpen(false);
    setTicketTitle("");
    setTicketDescription("");
  }

  // Reset page when filter/search changes
  function onFilterChange(val: string) {
    setActiveFilter(val);
    setCurrentPage(1);
  }

  function onSearchChange(val: string) {
    setSearchQuery(val);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen space-y-6 bg-zinc-950 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Hardware Assets</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Track and manage all hardware assets across your organization
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={(val) => onFilterChange(val as string)}>
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="desktop">Desktops</TabsTrigger>
            <TabsTrigger value="laptop">Laptops</TabsTrigger>
            <TabsTrigger value="server">Servers</TabsTrigger>
            <TabsTrigger value="printer">Printers</TabsTrigger>
            <TabsTrigger value="peripheral">Peripherals</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4" />
              Add Asset
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-zinc-100">Add New Asset</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Fill in the details below to register a new hardware asset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Name</Label>
                  <Input
                    placeholder="e.g. Dell Latitude 7450"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Type</Label>
                  <Select value={newType} onValueChange={(val) => setNewType(val as AssetType)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                      <SelectItem value="printer">Printer</SelectItem>
                      <SelectItem value="peripheral">Peripheral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Serial Number</Label>
                  <Input
                    placeholder="e.g. DL7450-XK9R2"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Assigned To</Label>
                    <Input
                      placeholder="e.g. James Thompson"
                      value={newAssignedTo}
                      onChange={(e) => setNewAssignedTo(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Department</Label>
                    <Input
                      placeholder="e.g. Engineering"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Purchase Date</Label>
                  <Input
                    type="date"
                    value={newPurchaseDate}
                    onChange={(e) => setNewPurchaseDate(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  Cancel
                </Button>
                <Button onClick={handleAddAsset}>Save Asset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" />}>
              <Download className="h-4 w-4" />
              Export
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuItem onClick={() => handleExport("CSV")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("PDF")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search by name, asset tag, serial number, assigned to, or department..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-zinc-900 border-zinc-800 pl-10 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600"
        />
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Asset Tag</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Type</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Serial Number</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Assigned To</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Department</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Purchase Date</TableHead>
              <TableHead className="text-zinc-400 text-xs font-semibold uppercase tracking-wider w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAssets.map((asset) => (
              <TableRow
                key={asset.id}
                className="border-zinc-800 hover:bg-zinc-800/60 transition-colors"
              >
                <TableCell>
                  <Link
                    href={`/assets/${asset.id}`}
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {asset.assetTag}
                  </Link>
                </TableCell>
                <TableCell className="text-sm font-medium text-zinc-100">
                  {asset.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={typeBadgeClasses[asset.type]}>
                    {typeLabels[asset.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-mono text-zinc-400">
                  {asset.serialNumber}
                </TableCell>
                <TableCell className="text-sm text-zinc-300">
                  {asset.assignedTo}
                </TableCell>
                <TableCell>
                  <Badge className={statusBadgeClasses[asset.status]}>
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-300">
                  {asset.department}
                </TableCell>
                <TableCell className="text-sm text-zinc-400">
                  {asset.purchaseDate}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" className="text-zinc-400 hover:text-zinc-100" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem render={<Link href={`/assets/${asset.id}`} />}>
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAsset(asset)}>
                        <Pencil className="h-4 w-4" />
                        Edit Asset
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateTicket(asset)}>
                        <TicketPlus className="h-4 w-4" />
                        Create Ticket
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleRetire(asset.id)}
                      >
                        <Archive className="h-4 w-4" />
                        Retire Asset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedAssets.length === 0 && (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={9} className="text-center py-12 text-zinc-500">
                  No assets found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
          <p className="text-sm text-zinc-400">
            Showing <span className="font-medium text-zinc-200">{rangeStart}-{rangeEnd}</span> of{" "}
            <span className="font-medium text-zinc-200">{filteredAssets.length}</span> assets
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === safePage ? "default" : "ghost"}
                size="sm"
                className={
                  page === safePage
                    ? ""
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Asset Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Edit Asset</DialogTitle>
            <DialogDescription className="text-zinc-400">Update the asset information.</DialogDescription>
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
              <Label className="text-zinc-300">Status</Label>
              <Select value={editStatus} onValueChange={(val) => setEditStatus(val as AssetStatus)}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Storage">In Storage</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Dialog */}
      <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Create Support Ticket</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a ticket for {ticketAssetName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-zinc-300">Title</Label>
              <Input
                placeholder="Brief description of the issue"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                placeholder="Provide details about the issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={confirmCreateTicket}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Confirmation Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Export Assets</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Export {filteredAssets.length} assets as {exportFormat}.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-300">
            The export will include all currently filtered assets with their full details.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
            <Button onClick={confirmExport}>
              <Download className="h-4 w-4 mr-1" />
              Download {exportFormat}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
