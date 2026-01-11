"use server";

import { query } from "@/lib/db";
import { createMeterSchema, updateMeterSchema } from "@/lib/schemas/meter";
import { redirect } from "next/navigation";
import { checkSerialNumberExists, getMeterById } from "@/lib/data/meters";

export const createMeter = async (prevState: unknown, formData: FormData) => {
  const rawData = {
    serial_number: formData.get("serial_number") as string,
    customer_id: formData.get("customer_id") as string,
    utility_type: formData.get("utility_type") as string,

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

    const customerResult = await query<{ id: number; address: string }>(
      "SELECT id, address FROM Customers WHERE customer_id = @customerId",
      { customerId: data.customer_id }
    );

    if (!customerResult.recordset[0]) {
      return { success: false, error: "Customer not found" };
    }

    const custIntId = customerResult.recordset[0].id;
    const customerAddress = customerResult.recordset[0].address;

    // Insert meter without meter_id (it's a computed column)
    await query(
      `INSERT INTO Meters (serial_number, customer_id, utility_type, location, install_date, status)
       VALUES (@serialNumber, @customerId, @utilityType, @location, @installDate, 'active')`,
      {
        serialNumber: data.serial_number,
        customerId: custIntId,
        utilityType: data.utility_type,
        location: customerAddress,
        installDate: data.install_date,
      }
    );
  } catch (error) {
    console.error("Error creating meter:", error);
    return { success: false, error: "Failed to create meter" };
  }

  // Redirect outside try-catch to allow Next.js redirect to work properly
  redirect("/UMS/Meters");
};

export const updateMeter = async (prevState: unknown, formData: FormData) => {
  try {
    const meterId = formData.get("meter_id") as string;

    const rawData = {
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

    const data = validationResult.data;

    let custIntId: number | undefined;
    if (data.customer_id) {
      const customerResult = await query<{ id: number }>(
        "SELECT id FROM Customers WHERE customer_id = @customerId",
        { customerId: data.customer_id }
      );

      if (!customerResult.recordset[0]) {
        return { success: false, message: "Customer not found" };
      }

      custIntId = customerResult.recordset[0].id;
    }

    const updates: string[] = [];
    const params: Record<string, string | number | Date> = {
      meter_id: meterId,
    };

    if (data.serial_number !== undefined) {
      updates.push("serial_number = @serial_number");
      params.serial_number = data.serial_number;
    }
    if (custIntId !== undefined) {
      updates.push("customer_id = @customerId");
      params.customerId = custIntId;
    }
    if (data.utility_type !== undefined) {
      updates.push("utility_type = @utility_type");
      params.utility_type = data.utility_type;
    }
    if (data.location !== undefined) {
      updates.push("location = @location");
      params.location = data.location;
    }
    if (data.install_date !== undefined) {
      updates.push("install_date = @install_date");
      params.install_date = data.install_date;
    }
    if (data.status !== undefined) {
      updates.push("status = @status");
      params.status = data.status;
    }

    updates.push("updated_at = GETUTCDATE()");

    await query(
      `UPDATE Meters SET ${updates.join(", ")} WHERE meter_id = @meter_id`,
      params
    );

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
    await query(
      `UPDATE Meters 
       SET status = 'inactive', 
           updated_at = GETUTCDATE() 
       WHERE meter_id = @id`,
      { id }
    );

    return { success: true, message: "Meter deleted successfully" };
  } catch (error) {
    console.error("Error deleting meter:", error);
    return { success: false, message: "Failed to delete meter" };
  }
};

export const verifyMeterIdAction = async (meterId: string) => {
  try {
    const meter = await getMeterById(meterId);
    if (!meter) {
      return { success: false, error: "Meter not found" };
    }

    return {
      success: true,
      data: {
        customer_name: meter.customer_name,
        location: meter.location,
        utility_type: meter.utility_type,
        last_reading_value: meter.last_reading_value,
      },
    };
  } catch (error) {
    console.error("Error verifying meter ID:", error);
    return { success: false, error: "Failed to verify meter ID" };
  }
};
