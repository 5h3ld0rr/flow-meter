"use server";

import { query } from "@/lib/db";
import { CreateReadingInput, createReadingSchema } from "@/lib/schemas/reading";
import { revalidatePath } from "next/cache";
import { getMeterLastReading } from "@/lib/data/meters";

export async function createReading(
  data: CreateReadingInput,
  userId: string
): Promise<{ success: boolean; error?: string }> {
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

    await query(
      `INSERT INTO Readings (meter_id, reading_value, reading_date, consumption, status, notes, created_by)
       VALUES (@meterId, @readingValue, @readingDate, @consumption, 'submitted', @notes, @userId)`,
      {
        meterId: validData.meter_id,
        readingValue: validData.reading_value,
        readingDate: validData.reading_date,
        consumption,
        notes: data.notes || null,
        userId,
      }
    );

    await query(
      `UPDATE Meters 
       SET last_reading_value = @readingValue, 
           last_reading_date = @readingDate,
           updated_at = GETDATE()
       WHERE id = @meterId`,
      {
        meterId: validData.meter_id,
        readingValue: validData.reading_value,
        readingDate: validData.reading_date,
      }
    );

    await query(
      `INSERT INTO Activities (activity_type, description, customer_id)
       VALUES ('reading', 'New meter reading submitted', @customerId)`,
      { customerId: meter.customer_id }
    );

    revalidatePath("/UMS/Readings");
    revalidatePath("/UMS/Dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating reading:", error);
    return { success: false, error: "Failed to create reading" };
  }
}

export async function validateReading(
  meterId: string,
  value: number
): Promise<{ valid: boolean; error?: string; previousReading?: number }> {
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
}
