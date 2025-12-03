"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function calculateBill(meterId: number, consumption: number) {
  try {
    const meterResult = await query<{ utility_type: string }>(
      `SELECT utility_type FROM Meters WHERE id = @meterId`,
      { meterId }
    );

    if (meterResult.recordset.length === 0) {
      throw new Error("Meter not found");
    }

    const utilityType = meterResult.recordset[0].utility_type;

    const tariffResult = await query<{ rate_per_unit: number }>(
      `SELECT rate_per_unit FROM Tariffs WHERE utility_type = @utilityType`,
      { utilityType }
    );

    const ratePerUnit =
      tariffResult.recordset.length > 0
        ? tariffResult.recordset[0].rate_per_unit
        : 0.15;

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
}

export async function generateBill(data: {
  customerId: number;
  meterId: number;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  consumption: number;
}) {
  try {
    const { baseAmount, taxAmount, totalAmount } = await calculateBill(
      data.meterId,
      data.consumption
    );

    // Generate bill ID
    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Bills`
    );
    const billCount = countResult.recordset[0].count;
    const billId = `BILL-${String(billCount + 1).padStart(6, "0")}`;

    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Insert bill
    await query(
      `INSERT INTO Bills (
        bill_id, customer_id, meter_id, billing_period_start, billing_period_end,
        consumption, base_amount, tax_amount, total_amount, status, due_date
      ) VALUES (
        @billId, @customerId, @meterId, @billingPeriodStart, @billingPeriodEnd,
        @consumption, @baseAmount, @taxAmount, @totalAmount, 'pending', @dueDate
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

    // Update customer balance
    await query(
      `UPDATE Customers 
       SET balance = balance + @totalAmount, updated_at = GETDATE()
       WHERE id = @customerId`,
      { totalAmount, customerId: data.customerId }
    );

    // Log activity
    await query(
      `INSERT INTO Activities (activity_type, description, customer_id, amount)
       VALUES ('billing', 'New bill generated', @customerId, @totalAmount)`,
      { customerId: data.customerId, totalAmount }
    );

    revalidatePath("/UMS/Billing");
    return { success: true, billId };
  } catch (error) {
    console.error("Error generating bill:", error);
    return { success: false, error: "Failed to generate bill" };
  }
}
