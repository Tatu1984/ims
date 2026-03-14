import { z } from "zod/v4";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
  assignedToId: z.string().optional(),
  assetId: z.string().optional(),
  device: z.string().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
  status: z.enum(["Open", "InProgress", "Resolved", "Closed"]).optional(),
  sla: z.enum(["OnTrack", "AtRisk", "Breached"]).optional(),
  assignedToId: z.string().optional(),
});
