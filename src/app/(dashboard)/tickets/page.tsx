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

type Priority = "High" | "Medium" | "Low";
type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

interface HelpTicket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo: string;
  initials: string;
  device: string;
  created: string;
  sla: "On Track" | "At Risk" | "Breached";
}

const initialTickets: HelpTicket[] = [
  {
    id: "TKT-1042",
    title: "Unable to connect to network printer on 3rd floor",
    description: "Users on the 3rd floor cannot print to the shared printer.",
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
    description: "Performance degradation after latest Windows update.",
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
    description: "Remote users experiencing frequent VPN disconnections.",
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
    description: "HR department requesting dual monitor configuration.",
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
    description: "Outlook not syncing new emails on marketing workstation.",
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
    description: "UPS unit in rack 2 reporting battery degradation alerts.",
    priority: "High",
    status: "Closed",
    assignedTo: "James Liu",
    initials: "JL",
    device: "ups-rack-02",
    created: "2026-03-12 11:30",
    sla: "On Track",
  },
];

const priorityColor: Record<Priority, string> = {
  High: "bg-red-500/15 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const statusColor: Record<TicketStatus, string> = {
  Open: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Closed: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const slaColor: Record<string, string> = {
  "On Track": "text-emerald-400",
  "At Risk": "text-amber-400",
  Breached: "text-red-400",
};

const assets = [
  "prn-floor3-01",
  "ws-eng-042",
  "rtr-vpn-01",
  "ws-hr-015",
  "ws-mkt-008",
  "ups-rack-02",
  "srv-db-01",
  "sw-core-01",
];

const teamMembers = [
  { name: "Mike Chen", initials: "MC" },
  { name: "Sarah Kim", initials: "SK" },
  { name: "James Liu", initials: "JL" },
];

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [tickets, setTickets] = useState<HelpTicket[]>(initialTickets);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newAsset, setNewAsset] = useState(assets[0]);
  const [newAssignee, setNewAssignee] = useState(teamMembers[0].name);

  // View Details dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);

  // Assign dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTicketId, setAssignTicketId] = useState("");
  const [assignTo, setAssignTo] = useState(teamMembers[0].name);

  // Change Status dialog
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTicketId, setStatusTicketId] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus>("Open");

  // Close Ticket confirm
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeTicketId, setCloseTicketId] = useState("");

  const filteredTickets =
    activeTab === "All"
      ? tickets
      : tickets.filter((t) => t.status === activeTab);

  function handleCreateTicket() {
    if (!newTitle.trim()) return;
    const member = teamMembers.find((m) => m.name === newAssignee) ?? teamMembers[0];
    const newTicket: HelpTicket = {
      id: `TKT-${1043 + tickets.length - initialTickets.length}`,
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      status: "Open",
      assignedTo: member.name,
      initials: member.initials,
      device: newAsset,
      created: new Date().toISOString().slice(0, 16).replace("T", " "),
      sla: "On Track",
    };
    setTickets([newTicket, ...tickets]);
    setNewTitle("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewAsset(assets[0]);
    setNewAssignee(teamMembers[0].name);
    setDialogOpen(false);
  }

  function handleViewDetails(ticket: HelpTicket) {
    setSelectedTicket(ticket);
    setDetailOpen(true);
  }

  function handleAssign(ticket: HelpTicket) {
    setAssignTicketId(ticket.id);
    setAssignTo(ticket.assignedTo);
    setAssignOpen(true);
  }

  function confirmAssign() {
    const member = teamMembers.find((m) => m.name === assignTo) ?? teamMembers[0];
    setTickets((prev) =>
      prev.map((t) =>
        t.id === assignTicketId ? { ...t, assignedTo: member.name, initials: member.initials } : t
      )
    );
    setAssignOpen(false);
  }

  function handleChangeStatus(ticket: HelpTicket) {
    setStatusTicketId(ticket.id);
    setNewStatus(ticket.status);
    setStatusOpen(true);
  }

  function confirmChangeStatus() {
    setTickets((prev) =>
      prev.map((t) => (t.id === statusTicketId ? { ...t, status: newStatus } : t))
    );
    setStatusOpen(false);
  }

  function handleCloseTicket(ticket: HelpTicket) {
    setCloseTicketId(ticket.id);
    setCloseOpen(true);
  }

  function confirmClose() {
    setTickets((prev) =>
      prev.map((t) => (t.id === closeTicketId ? { ...t, status: "Closed" as TicketStatus } : t))
    );
    setCloseOpen(false);
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
      value: String(tickets.filter((t) => t.status === "In Progress").length),
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
                  <Select value={newAssignee} onValueChange={(val) => { if (val) setNewAssignee(val); }}>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {teamMembers.map((m) => (
                        <SelectItem key={m.name} value={m.name}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Asset</Label>
                <Select value={newAsset} onValueChange={(val) => { if (val) setNewAsset(val); }}>
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {assets.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>Create Ticket</Button>
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
          <TabsTrigger value="In Progress">In Progress</TabsTrigger>
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
                      {ticket.id}
                    </span>
                    <Badge
                      className={`text-[11px] border ${priorityColor[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      className={`text-[11px] border ${statusColor[ticket.status]}`}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                    {ticket.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <Monitor className="h-3.5 w-3.5" />
                      {ticket.device}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {ticket.created}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${slaColor[ticket.sla]}`}
                    >
                      SLA: {ticket.sla}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-700"
                      title={ticket.assignedTo}
                    >
                      {ticket.initials}
                    </div>
                    <span className="text-xs text-zinc-400 hidden sm:block">
                      {ticket.assignedTo}
                    </span>
                  </div>
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
                <span className="text-xs font-mono text-zinc-500">{selectedTicket.id}</span>
                <Badge className={`text-[11px] border ${priorityColor[selectedTicket.priority]}`}>
                  {selectedTicket.priority}
                </Badge>
                <Badge className={`text-[11px] border ${statusColor[selectedTicket.status]}`}>
                  {selectedTicket.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{selectedTicket.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Assigned To</p>
                  <p className="text-sm text-zinc-100">{selectedTicket.assignedTo}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Device</p>
                  <p className="text-sm font-mono text-zinc-100">{selectedTicket.device}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Created</p>
                  <p className="text-sm text-zinc-100">{selectedTicket.created}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">SLA Status</p>
                  <p className={`text-sm font-medium ${slaColor[selectedTicket.sla]}`}>{selectedTicket.sla}</p>
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
              <Select value={assignTo} onValueChange={(val) => { if (val) setAssignTo(val); }}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {teamMembers.map((m) => (
                    <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={confirmAssign}>Assign</Button>
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
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancel</Button>
            <Button onClick={confirmChangeStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Ticket Confirmation */}
      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Close Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to close ticket <span className="font-medium text-zinc-200">{closeTicketId}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            Closed tickets cannot be reopened. If the issue recurs, a new ticket will need to be created.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmClose}>Close Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
