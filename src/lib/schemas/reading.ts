import { z } from "zod";

/**
 * Reading validation schemas using Zod
 */

export const readingSchema = z.object({
  meter_id: z.string(),

  reading_value: z.number().nonnegative("Reading value cannot be negative"),

  reading_date: z.date().or(z.string().transform((str) => new Date(str))),
});

// Schema with previous reading validation
export const createReadingSchema = readingSchema
  .extend({
    previous_reading: z.number().nonnegative().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.previous_reading !== undefined) {
        return data.reading_value >= data.previous_reading;
      }
      return true;
    },
    {
      message: "Reading value cannot be less than previous reading",
      path: ["reading_value"],
    }
  );

export const updateReadingSchema = readingSchema.partial();

// Date range validation
export const dateRangeSchema = z
  .object({
    startDate: z.date().or(z.string().transform((str) => new Date(str))),
    endDate: z.date().or(z.string().transform((str) => new Date(str))),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

// Type exports
export type ReadingInput = z.infer<typeof readingSchema>;
export type CreateReadingInput = z.infer<typeof createReadingSchema>;
export type UpdateReadingInput = z.infer<typeof updateReadingSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
