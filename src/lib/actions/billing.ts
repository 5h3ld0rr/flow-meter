"use server";

import { getCustomerById } from "@/lib/data/customers";
import { getMeters } from "@/lib/data/meters";
import { addTariffRate } from "@/lib/data/billing";
import { revalidatePath } from "next/cache";

export async function updateTariffRates(
  prevState: { success: boolean; message: string } | undefined | null,
  formData: FormData
) {
  try {
    const utilityTypes = ["electricity", "water", "gas"];
    const customerTypes = ["household", "business", "government"];

    for (const utility of utilityTypes) {
      for (const customerType of customerTypes) {
        const key = `${utility}_${customerType}`;
        const rate = parseFloat(formData.get(key) as string);

        if (!isNaN(rate)) {
          await addTariffRate(utility, rate, customerType);
        }
      }
    }

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
