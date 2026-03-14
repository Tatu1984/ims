import { z } from "zod/v4";

export const updateSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  category: z.string().optional(),
});
