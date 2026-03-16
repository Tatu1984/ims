import { z } from "zod/v4";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "Technician", "Auditor", "Manager"]),
  department: z.string().min(1, "Department is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["Admin", "Technician", "Auditor", "Manager"]).optional(),
  department: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
