import { z } from "zod/v4";

export const createAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["desktop", "laptop", "server", "printer", "peripheral"]),
  serialNumber: z.string().min(1, "Serial number is required"),
  assignedToId: z.string().optional(),
  assignedToName: z.string().optional(),
  status: z.enum(["Active", "InStorage", "Maintenance", "Retired"]).optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseCost: z.number().optional(),
  warrantyExpiry: z.string().optional(),
  notes: z.string().optional(),
  // Hardware specifications
  processor: z.string().optional(),
  ramSize: z.string().optional(),
  ramType: z.string().optional(),
  storageSize: z.string().optional(),
  storageType: z.string().optional(),
  gpu: z.string().optional(),
  displaySize: z.string().optional(),
  displayRes: z.string().optional(),
  os: z.string().optional(),
  macAddress: z.string().optional(),
  ipAddress: z.string().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();
