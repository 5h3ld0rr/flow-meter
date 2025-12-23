"use server";

import { execute } from "@/lib/db";
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

    // Call stored procedure to insert bill - trigger handles activity logging
    await execute("sp_CreateBill", {
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
    });

    // Update customer balance
    await execute("sp_UpdateCustomerBalance", {
      customerId: data.customerId,
      amount: totalAmount,
      operation: "add",
    });

    revalidatePath("/UMS/Billing");
    return { success: true, billId };
  } catch (error) {
    console.error("Error generating bill:", error);
    return { success: false, error: "Failed to generate bill" };
  }
};
