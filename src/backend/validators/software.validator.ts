import { z } from "zod/v4";

export const createSoftwareSchema = z.object({
  name: z.string().min(1, "Name is required"),
  publisher: z.string().min(1, "Publisher is required"),
  version: z.string().min(1, "Version is required"),
  category: z.string().optional(),
  licenseStatus: z.enum(["Licensed", "Unlicensed", "Trial", "Unauthorized"]).optional(),
  installCount: z.number().int().min(0).optional(),
});

export const updateSoftwareSchema = createSoftwareSchema.partial();
