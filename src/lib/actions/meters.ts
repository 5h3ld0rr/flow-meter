"use server";

import { execute } from "@/lib/db";
import { createMeterSchema, updateMeterSchema } from "@/lib/schemas/meter";
import { redirect } from "next/navigation";
import { checkSerialNumberExists, getMeterCount } from "@/lib/data/meters";

export const createMeter = async (prevState: unknown, formData: FormData) => {
  const rawData = {
    serial_number: formData.get("serial_number") as string,
    customer_id: formData.get("customer_id") as string,
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

    // Call stored procedure directly - trigger handles activity logging
    await execute("sp_CreateMeter", {
      meterId,
      serialNumber: data.serial_number,
      customerId: data.customer_id,
      utilityType: data.utility_type,
      location: data.location,
      installDate: data.install_date,
    });

    redirect("/UMS/Meters");
  } catch (error) {
    console.error("Error creating meter:", error);
    return { success: false, error: "Failed to create meter" };
  }
};

export const updateMeter = async (prevState: unknown, formData: FormData) => {
  try {
    const rawData = {
      meter_id: formData.get("meter_id") as string,
      serial_number: formData.get("serial_number") as string,
      customer_id: formData.get("customer_id") as string,
      utility_type: formData.get("utility_type") as string,
      location: formData.get("location") as string,
      install_date: new Date(formData.get("install_date") as string),
      status: formData.get("status") as string,
    };

    const validationResult = updateMeterSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues.map((issue) => issue.message),
      };
    }

    // Call stored procedure directly
    await execute("sp_UpdateMeter", validationResult.data);

    return { success: true, message: "Meter updated successfully" };
  } catch (error) {
    console.error("Error updating meter:", error);
    return { success: false, message: "Failed to update meter" };
  }
};

export const deleteMeter = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Call stored procedure directly
    await execute("sp_DeleteMeter", { id });

    return { success: true, message: "Meter deleted successfully" };
  } catch (error) {
    console.error("Error deleting meter:", error);
    return { success: false, message: "Failed to delete meter" };
  }
};
