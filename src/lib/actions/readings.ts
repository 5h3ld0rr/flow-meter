"use server";

import { execute } from "@/lib/db";
import { CreateReadingInput, createReadingSchema } from "@/lib/schemas/reading";
import { revalidatePath } from "next/cache";
import { getMeterLastReading } from "@/lib/data/meters";

export const createReading = async (
  data: CreateReadingInput,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const meter = await getMeterLastReading(data.meter_id);

    if (!meter) {
      return { success: false, error: "Meter not found" };
    }

    const previousReading = meter.last_reading_value || 0;

    const validationResult = createReadingSchema.safeParse({
      ...data,
      previous_reading: previousReading,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const validData = validationResult.data;
    const consumption = validData.reading_value - previousReading;

    // Call stored procedure to insert reading
    await execute("sp_CreateReading", {
      meterId: validData.meter_id,
      readingValue: validData.reading_value,
      readingDate: validData.reading_date,
      consumption,
      notes: data.notes || null,
      userId,
    });

    // Update meter with last reading
    await execute("sp_UpdateMeterLastReading", {
      meterId: validData.meter_id,
      readingValue: validData.reading_value,
      readingDate: validData.reading_date,
    });

    revalidatePath("/UMS/Readings");
    revalidatePath("/UMS/Dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating reading:", error);
    return { success: false, error: "Failed to create reading" };
  }
};

export const validateReading = async (
  meterId: string,
  value: number
): Promise<{ valid: boolean; error?: string; previousReading?: number }> => {
  try {
    const meter = await getMeterLastReading(meterId);

    if (!meter) {
      return { valid: false, error: "Meter not found" };
    }

    const previousReading = meter.last_reading_value || 0;

    const validationResult = createReadingSchema.safeParse({
      meter_id: meterId,
      reading_value: value,
      reading_date: new Date(),
      previous_reading: previousReading,
    });

    if (!validationResult.success) {
      return {
        valid: false,
        error: `Reading must be >= ${previousReading}`,
        previousReading,
      };
    }

    return { valid: true, previousReading };
  } catch (error) {
    console.error("Error validating reading:", error);
    return { valid: false, error: "Validation failed" };
  }
};
