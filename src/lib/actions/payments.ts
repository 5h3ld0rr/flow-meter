"use server";

import { execute } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getBillForPayment, getPaymentCount } from "@/lib/data/payments";

export const recordPayment = async (
  data: RecordPaymentRequest,
  userId: number
): Promise<{ success: boolean; error?: string; paymentId?: string }> => {
  try {
    if (
      !data.bill_id ||
      !data.amount ||
      !data.payment_method ||
      !data.payment_date
    ) {
      return { success: false, error: "All required fields must be provided" };
    }

    const bill = await getBillForPayment(String(data.bill_id));

    if (!bill) {
      return { success: false, error: "Bill not found" };
    }

    if (bill.status === "paid") {
      return { success: false, error: "Bill is already paid" };
    }

    const paymentCount = await getPaymentCount();
    const paymentId = `PAY${String(paymentCount + 1).padStart(3, "0")}`;

    // Call stored procedure to insert payment - trigger handles activity logging
    await execute("sp_CreatePayment", {
      paymentId,
      billId: data.bill_id,
      customerId: bill.customer_id,
      amount: data.amount,
      paymentMethod: data.payment_method,
      transactionRef: data.transaction_reference || null,
      paymentDate: data.payment_date,
      notes: data.notes || null,
      userId,
    });

    // Update bill status
    await execute("sp_UpdateBillStatus", {
      billId: data.bill_id,
      status: "paid",
    });

    // Update customer balance
    await execute("sp_UpdateCustomerBalance", {
      customerId: bill.customer_id,
      amount: data.amount,
      operation: "subtract",
    });

    revalidatePath("/UMS/Payments");
    revalidatePath("/UMS/Dashboard");
    return { success: true, paymentId };
  } catch (error) {
    console.error("Error recording payment:", error);
    return { success: false, error: "Failed to record payment" };
  }
};
