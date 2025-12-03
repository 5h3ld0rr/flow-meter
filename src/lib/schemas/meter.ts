import { z } from "zod";

/**
 * Meter validation schemas using Zod
 */

export const meterSchema = z.object({
  serial_number: z
    .string()
    .min(3, "Serial number must be at least 3 characters")
    .max(50, "Serial number must be less than 50 characters"),

  customer_id: z.string(),

  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must be less than 200 characters"),

  utility_type: z.enum(["electricity", "water", "gas"]),

  install_date: z
    .date()
    .or(z.string().transform((str) => new Date(str)))
    .optional(),
});

export const createMeterSchema = meterSchema;

export const updateMeterSchema = meterSchema.partial().extend({
  status: z.enum(["active", "inactive", "maintenance"]).optional(),
});

// Type exports
export type MeterInput = z.infer<typeof meterSchema>;
export type CreateMeterInput = z.infer<typeof createMeterSchema>;
export type UpdateMeterInput = z.infer<typeof updateMeterSchema>;
