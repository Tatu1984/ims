"use client";

import { useState } from "react";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Monitor,
  MoreHorizontal,
  Loader2,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/frontend/hooks/use-api";
import {
  getTickets,
  createTicket,
  updateTicket,
} from "@/frontend/api/endpoints/tickets.api";
import { getUsers } from "@/frontend/api/endpoints/users.api";

type Priority = "High" | "Medium" | "Low";
type TicketStatus = "Open" | "InProgress" | "Resolved" | "Closed";
type SLA = "OnTrack" | "AtRisk" | "Breached";

interface ApiTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TicketStatus;
  sla: SLA;
  assignedTo: { id: string; name: string; initials: string } | null;
  assignedToId: string | null;
  device: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
}

const priorityColor: Record<Priority, string> = {
  High: "bg-red-500/15 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const statusColor: Record<TicketStatus, string> = {
  Open: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  InProgress: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Closed: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const slaColor: Record<SLA, string> = {
  OnTrack: "text-emerald-400",
  AtRisk: "text-amber-400",
  Breached: "text-red-400",
};

const statusDisplayLabel: Record<TicketStatus, string> = {
  Open: "Open",
  InProgress: "In Progress",
  Resolved: "Resolved",
  Closed: "Closed",
};

const slaDisplayLabel: Record<SLA, string> = {
  OnTrack: "On Track",
  AtRisk: "At Risk",
  Breached: "Breached",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch tickets
  const {
    data: ticketsData,
    loading,
    error,
    refetch,
  } = useApi<{ data: ApiTicket[]; total: number }>(() => getTickets());

  // Fetch users for assignee dropdown
  const { data: usersData } = useApi<ApiUser[]>(() => getUsers());

  const tickets = ticketsData?.data ?? [];
  const teamMembers = usersData ?? [];

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newDevice, setNewDevice] = useState("");
  const [newAssigneeId, setNewAssigneeId] = useState("");

  // View Details dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ApiTicket | null>(null);

  // Assign dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTicketId, setAssignTicketId] = useState("");
  const [assignToId, setAssignToId] = useState("");

  // Change Status dialog
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTicketId, setStatusTicketId] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus>("Open");

  // Close Ticket confirm
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeTicketId, setCloseTicketId] = useState("");
  const [closeTicketNumber, setCloseTicketNumber] = useState("");

  const filteredTickets =
    activeTab === "All"
      ? tickets
      : tickets.filter((t) => t.status === activeTab);

  async function handleCreateTicket() {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      await createTicket({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        priority: newPriority,
        assignedToId: newAssigneeId || undefined,
        device: newDevice.trim() || undefined,
      });
      setNewTitle("");
      setNewDescription("");
      setNewPriority("Medium");
      setNewDevice("");
      setNewAssigneeId("");
      setDialogOpen(false);
      await refetch();
    } catch {
      // error handled by useApi on refetch
    } finally {
      setSubmitting(false);
    }
  }

  function handleViewDetails(ticket: ApiTicket) {
    setSelectedTicket(ticket);
    setDetailOpen(true);
  }

  function handleAssign(ticket: ApiTicket) {
    setAssignTicketId(ticket.id);
    setAssignToId(ticket.assignedToId ?? "");
    setAssignOpen(true);
  }

  async function confirmAssign() {
    setSubmitting(true);
    try {
      await updateTicket(assignTicketId, { assignedToId: assignToId || null });
      setAssignOpen(false);
      await refetch();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  function handleChangeStatus(ticket: ApiTicket) {
    setStatusTicketId(ticket.id);
    setNewStatus(ticket.status);
    setStatusOpen(true);
  }

  async function confirmChangeStatus() {
    setSubmitting(true);
    try {
      await updateTicket(statusTicketId, { status: newStatus });
      setStatusOpen(false);
      await refetch();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseTicket(ticket: ApiTicket) {
    setCloseTicketId(ticket.id);
    setCloseTicketNumber(ticket.ticketNumber);
    setCloseOpen(true);
  }

  async function confirmClose() {
    setSubmitting(true);
    try {
      await updateTicket(closeTicketId, { status: "Closed" });
      setCloseOpen(false);
      await refetch();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  const stats = [
    {
      label: "Open",
      value: String(tickets.filter((t) => t.status === "Open").length),
      icon: <AlertCircle className="h-5 w-5 text-blue-400" />,
      iconBg: "bg-blue-500/15",
    },
    {
      label: "In Progress",
      value: String(tickets.filter((t) => t.status === "InProgress").length),
      icon: <Ticket className="h-5 w-5 text-amber-400" />,
      iconBg: "bg-amber-500/15",
    },
    {
      label: "Resolved",
      value: String(tickets.filter((t) => t.status === "Resolved").length),
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      iconBg: "bg-emerald-500/15",
    },
    {
      label: "Closed",
      value: String(tickets.filter((t) => t.status === "Closed").length),
      icon: <Clock className="h-5 w-5 text-purple-400" />,
      iconBg: "bg-purple-500/15",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="outline" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Helpdesk Tickets
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            IT support ticket management
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Ticket
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Create New Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Title</Label>
                <Input
                  placeholder="Brief description of the issue"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                  placeholder="Detailed description of the issue..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Priority</Label>
                  <Select value={newPriority} onValueChange={(val) => { if (val) setNewPriority(val as Priority); }}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Assigned To</Label>
                  <Select value={newAssigneeId} onValueChange={(val) => { if (val) setNewAssigneeId(val); }}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {teamMembers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Device</Label>
                <Input
                  placeholder="e.g. prn-floor3-01"
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket} disabled={submitting}>
                {submitting ? "Creating..." : "Create Ticket"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Open">Open</TabsTrigger>
          <TabsTrigger value="InProgress">In Progress</TabsTrigger>
          <TabsTrigger value="Resolved">Resolved</TabsTrigger>
          <TabsTrigger value="Closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ticket Cards */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-zinc-500">
                      {ticket.ticketNumber}
                    </span>
                    <Badge
                      className={`text-[11px] border ${priorityColor[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      className={`text-[11px] border ${statusColor[ticket.status]}`}
                    >
                      {statusDisplayLabel[ticket.status]}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                    {ticket.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    {ticket.device && (
                      <span className="inline-flex items-center gap-1">
                        <Monitor className="h-3.5 w-3.5" />
                        {ticket.device}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(ticket.createdAt)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${slaColor[ticket.sla]}`}
                    >
                      SLA: {slaDisplayLabel[ticket.sla]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-700"
                        title={ticket.assignedTo.name}
                      >
                        {ticket.assignedTo.initials}
                      </div>
                      <span className="text-xs text-zinc-400 hidden sm:block">
                        {ticket.assignedTo.name}
                      </span>
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-900 border-zinc-800"
                    >
                      <DropdownMenuItem className="text-zinc-300" onClick={() => handleViewDetails(ticket)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-300" onClick={() => handleAssign(ticket)}>
                        Assign
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-300" onClick={() => handleChangeStatus(ticket)}>
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem className="text-red-400" onClick={() => handleCloseTicket(ticket)}>
                        Close Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="mt-3 text-sm text-zinc-500">
                No tickets in this category
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">{selectedTicket.ticketNumber}</span>
                <Badge className={`text-[11px] border ${priorityColor[selectedTicket.priority]}`}>
                  {selectedTicket.priority}
                </Badge>
                <Badge className={`text-[11px] border ${statusColor[selectedTicket.status]}`}>
                  {statusDisplayLabel[selectedTicket.status]}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{selectedTicket.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{selectedTicket.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Assigned To</p>
                  <p className="text-sm text-zinc-100">{selectedTicket.assignedTo?.name ?? "Unassigned"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Device</p>
                  <p className="text-sm font-mono text-zinc-100">{selectedTicket.device || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Created</p>
                  <p className="text-sm text-zinc-100">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">SLA Status</p>
                  <p className={`text-sm font-medium ${slaColor[selectedTicket.sla]}`}>{slaDisplayLabel[selectedTicket.sla]}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Assign Ticket</DialogTitle>
            <DialogDescription>Select a team member to assign this ticket to.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">Assign To</Label>
              <Select value={assignToId} onValueChange={(val) => { if (val) setAssignToId(val); }}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {teamMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={confirmAssign} disabled={submitting}>
              {submitting ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Change Status</DialogTitle>
            <DialogDescription>Update the ticket status.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-300">New Status</Label>
              <Select value={newStatus} onValueChange={(val) => { if (val) setNewStatus(val as TicketStatus); }}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancel</Button>
            <Button onClick={confirmChangeStatus} disabled={submitting}>
              {submitting ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Ticket Confirmation */}
      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Close Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to close ticket <span className="font-medium text-zinc-200">{closeTicketNumber}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            Closed tickets cannot be reopened. If the issue recurs, a new ticket will need to be created.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmClose} disabled={submitting}>
              {submitting ? "Closing..." : "Close Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
