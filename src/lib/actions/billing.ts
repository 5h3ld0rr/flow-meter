"use server";

import { getCustomerById } from "@/lib/data/customers";
import { getMeters } from "@/lib/data/meters";
import { addTariffRate } from "@/lib/data/billing";
import { getReadings } from "@/lib/data/readings";
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

    const metersWithReadings = await Promise.all(
      meters.map(async (m) => {
        const readings = await getReadings({ meterId: m.meter_id }, 2);
        return {
          ...m,
          readings,
        };
      })
    );

    return {
      success: true,
      customerName: customer.name,
      meters: metersWithReadings.map((m) => {
        const latest = m.readings[0];
        const previous = m.readings[1];
        return {
          value: m.meter_id,
          label: `${m.serial_number} (${m.utility_type})`,
          latestReadingId: latest?.id,
          latestReadingDate: latest?.reading_date,
          latestReadingValue: latest?.reading_value,
          previousReadingDate: previous?.reading_date,
        };
      }),
    };
  } catch (error) {
    console.error("Error validating customer:", error);
    return { success: false, error: "Failed to validate customer" };
  }
}

import { createBill } from "@/lib/data/billing";
import { redirect } from "next/navigation";

export async function generateBillAction(formData: FormData) {
  const customerId = parseInt(formData.get("customerId") as string);
  const meterId = parseInt(formData.get("meterId") as string);
  const readingId = formData.get("readingId")
    ? parseInt(formData.get("readingId") as string)
    : undefined;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const consumption = parseFloat(formData.get("consumption") as string);
  const baseAmount = parseFloat(formData.get("baseAmount") as string);
  const taxAmount = parseFloat(formData.get("taxAmount") as string);
  const currentReading = parseFloat(formData.get("currentReading") as string);
  const previousReading = parseFloat(formData.get("previousReading") as string);
  const tariffRate = parseFloat(formData.get("tariffRate") as string);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15); // Due in 15 days

  await createBill({
    customerId,
    meterId,
    readingId,
    billingPeriodStart: startDate,
    billingPeriodEnd: endDate,
    previousReading,
    currentReading,
    consumption,
    tariffRate,
    baseAmount,
    taxAmount,
    dueDate,
  });

  revalidatePath("/UMS/Billing");
  redirect("/UMS/Billing");
}
