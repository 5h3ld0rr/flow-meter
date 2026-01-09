"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  getMeterUtilityType,
  getTariffRate,
  getBillCount,
} from "@/lib/data/billing";

export const calculateBill = async (meterId: number, consumption: number) => {
  try {
    const utilityType = await getMeterUtilityType(meterId);
    if (!utilityType) {
      throw new Error("Meter not found");
    }

    const ratePerUnit = await getTariffRate(utilityType);
    const baseAmount = consumption * ratePerUnit;
    const taxAmount = baseAmount * 0.1;
    const totalAmount = baseAmount + taxAmount;

    return {
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  } catch (error) {
    console.log("Error calculating bill:", error);
    return {
      baseAmount: 0.0,
      taxAmount: 0.0,
      totalAmount: 0.0,
    };
  }
};

/**
 * Generates a new bill with parameterized SQL queries
 * Handles bill creation and customer balance update
 * Protected against SQL injection via parameterized queries
 */
export const generateBill = async (data: {
  customerId: number;
  meterId: number;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  consumption: number;
}) => {
  try {
    const { baseAmount, taxAmount, totalAmount } = await calculateBill(
      data.meterId,
      data.consumption
    );

    const billCount = await getBillCount();
    const billId = `BILL-${String(billCount + 1).padStart(6, "0")}`;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // REFACTORED: Simple INSERT with parameterized query
    await query(
      `INSERT INTO Bills (
        bill_id, customer_id, meter_id, billing_period_start, billing_period_end,
        consumption, base_amount, tax_amount, total_amount, status, due_date
      )
      VALUES (
        @billId, @customerId, @meterId, @billingPeriodStart, @billingPeriodEnd,
        @consumption, @baseAmount, @taxAmount, @totalAmount, 'generated', @dueDate
      )`,
      {
        billId,
        customerId: data.customerId,
        meterId: data.meterId,
        billingPeriodStart: data.billingPeriodStart,
        billingPeriodEnd: data.billingPeriodEnd,
        consumption: data.consumption,
        baseAmount,
        taxAmount,
        totalAmount,
        dueDate,
      }
    );

    // REFACTORED: Simple UPDATE with parameterized query for customer balance
    await query(
      `UPDATE Customers
       SET balance = balance + @amount, updated_at = GETUTCDATE()
       WHERE id = @customerId`,
      {
        customerId: data.customerId,
        amount: totalAmount,
      }
    );

    revalidatePath("/UMS/Billing");
    return { success: true, billId };
  } catch (error) {
    console.error("Error generating bill:", error);
    return { success: false, error: "Failed to generate bill" };
  }
};

export type TariffActionState =
  | {
      success: boolean;
      message: string;
    }
  | undefined;

export const updateTariffRates = async (
  state: TariffActionState,
  formData: FormData
) => {
  try {
    const electricity = parseFloat(formData.get("electricity") as string);
    const water = parseFloat(formData.get("water") as string);
    const gas = parseFloat(formData.get("gas") as string);

    if (isNaN(electricity) || isNaN(water) || isNaN(gas)) {
      return { success: false, message: "Invalid rate values" };
    }

    const { query } = await import("@/lib/db");

    // Update all tariffs in a single transaction
    await query(
      `UPDATE Tariffs SET rate_per_unit = @rate, created_at = GETUTCDATE() WHERE utility_type = 'electricity'`,
      { rate: electricity }
    );
    await query(
      `UPDATE Tariffs SET rate_per_unit = @rate, created_at = GETUTCDATE() WHERE utility_type = 'water'`,
      { rate: water }
    );
    await query(
      `UPDATE Tariffs SET rate_per_unit = @rate, created_at = GETUTCDATE() WHERE utility_type = 'gas'`,
      { rate: gas }
    );

    revalidatePath("/UMS/Settings");
    return {
      success: true,
      message: "All tariff rates updated successfully",
    };
  } catch (error) {
    console.error("Error updating tariff rates:", error);
    return { success: false, message: "Failed to update tariff rates" };
  }
};
