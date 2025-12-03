"use server";

import { query } from "@/lib/db";
import { createMeterSchema, updateMeterSchema } from "@/lib/schemas/meter";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkSerialNumberExists, getMeterCount } from "@/lib/data/meters";

export async function createMeter(prevState: unknown, formData: FormData) {
  const rawData = {
    serial_number: formData.get("serial_number") as string,
    customer_id: parseInt(formData.get("customer_id") as string),
    utility_type: formData.get("utility_type") as string,
    location: formData.get("location") as string,
    install_date: formData.get("install_date")
      ? new Date(formData.get("install_date") as string)
      : new Date(),
  };

  try {
    const validationResult = createMeterSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const data = validationResult.data;

    const serialExists = await checkSerialNumberExists(data.serial_number);
    if (serialExists) {
      return { success: false, error: "Serial number already exists" };
    }

    const meterCount = await getMeterCount();
    const meterId = `M${String(meterCount + 1).padStart(3, "0")}`;

    await query(
      `INSERT INTO Meters (meter_id, serial_number, customer_id, utility_type, location, status, install_date)
       VALUES (@meterId, @serialNumber, @customerId, @utilityType, @location, 'active', @installDate)`,
      {
        meterId,
        serialNumber: data.serial_number,
        customerId: data.customer_id,
        utilityType: data.utility_type,
        location: data.location,
        installDate: data.install_date,
      }
    );

    await query(
      `INSERT INTO Activities (activity_type, description, customer_id)
       VALUES ('meter', 'New meter installed', @customerId)`,
      { customerId: data.customer_id }
    );

    revalidatePath("/UMS/Meters");
    redirect("/UMS/Meters");
  } catch (error) {
    console.error("Error creating meter:", error);
    return { error: "Failed to create meter" };
  }
}

export async function updateMeter(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const validationResult = updateMeterSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const validData = validationResult.data;

    const updates: string[] = [];
    const params: Record<string, string | number> = { id };

    if (validData.location) {
      updates.push("location = @location");
      params.location = validData.location;
    }

    if (validData.status) {
      updates.push("status = @status");
      params.status = validData.status;
    }

    if (updates.length === 0) {
      return { success: false, error: "No fields to update" };
    }

    updates.push("updated_at = GETDATE()");

    await query(
      `UPDATE Meters SET ${updates.join(", ")} WHERE meter_id = @id`,
      params
    );

    revalidatePath("/UMS/Meters");
    return { success: true };
  } catch (error) {
    console.error("Error updating meter:", error);
    return { success: false, error: "Failed to update meter" };
  }
}

/**
 * Delete meter (set status to inactive)
 */
export async function deleteMeter(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await query(
      `UPDATE Meters SET status = 'inactive', updated_at = GETDATE() WHERE id = @id`,
      { id }
    );

    revalidatePath("/UMS/Meters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting meter:", error);
    return { success: false, error: "Failed to delete meter" };
  }
}
