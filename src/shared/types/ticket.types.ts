export type Priority = "High" | "Medium" | "Low";
export type TicketStatus = "Open" | "InProgress" | "Resolved" | "Closed";
export type TicketSla = "OnTrack" | "AtRisk" | "Breached";

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  sla: TicketSla;
  assignedToId: string | null;
  assignedToName?: string;
  assignedToInitials?: string;
  assetId: string | null;
  device: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ticketStatusDisplay: Record<TicketStatus, string> = {
  Open: "Open",
  InProgress: "In Progress",
  Resolved: "Resolved",
  Closed: "Closed",
};

export const ticketSlaDisplay: Record<TicketSla, string> = {
  OnTrack: "On Track",
  AtRisk: "At Risk",
  Breached: "Breached",
};
