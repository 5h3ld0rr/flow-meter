"use server";

import { getCustomerById } from "@/lib/data/customers";
import { getMeters } from "@/lib/data/meters";
import { addTariffRate } from "@/lib/data/billing";
import { revalidatePath } from "next/cache";

export async function updateTariffRates(prevState: any, formData: FormData) {
  try {
    const electricity = parseFloat(formData.get("electricity") as string);
    const water = parseFloat(formData.get("water") as string);
    const gas = parseFloat(formData.get("gas") as string);

    if (!isNaN(electricity)) await addTariffRate("electricity", electricity);
    if (!isNaN(water)) await addTariffRate("water", water);
    if (!isNaN(gas)) await addTariffRate("gas", gas);

    revalidatePath("/UMS/Settings");
    return { success: true, message: "Tariff rates updated successfully" };
  } catch (error) {
    console.error("Error updating tariffs:", error);
    return { success: false, message: "Failed to update tariff rates" };
  }
}

export async function validateCustomerAndGetMeters(customerId: string) {
  try {
    const customer = await getCustomerById(customerId);

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    // customerId argument for getMeters is expected to be the external customer_id (e.g. C001)
    // Looking at meters.ts check: 'c.customer_id = @customerId'
    const meters = await getMeters(undefined, customerId);

    return {
      success: true,
      customerName: customer.name,
      meters: meters.map((m) => ({
        value: m.meter_id,
        label: `${m.serial_number} (${m.utility_type})`,
      })),
    };
  } catch (error) {
    console.error("Error validating customer:", error);
    return { success: false, error: "Failed to validate customer" };
  }
}
