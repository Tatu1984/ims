import { z } from "zod/v4";

export const createLicenseSchema = z.object({
  softwareId: z.string().min(1, "Software is required"),
  licenseType: z.enum(["Volume", "PerSeat", "Subscription", "OEM"]),
  totalLicenses: z.number().int().min(0, "Total licenses must be non-negative"),
  inUse: z.number().int().min(0).optional(),
  expiryDate: z.string().optional(),
});

export const updateLicenseSchema = createLicenseSchema.partial();
