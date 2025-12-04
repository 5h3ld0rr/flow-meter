"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

    const billResult = await query<{
      id: number;
      customer_id: number;
      total_amount: number;
      status: string;
    }>(
      `SELECT id, customer_id, total_amount, status FROM Bills WHERE id = @billId`,
      { billId: data.bill_id }
    );

    if (billResult.recordset.length === 0) {
      return { success: false, error: "Bill not found" };
    }

    const bill = billResult.recordset[0];

    if (bill.status === "paid") {
      return { success: false, error: "Bill is already paid" };
    }

    const countResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Payments`
    );
    const paymentCount = countResult.recordset[0].count;
    const paymentId = `PAY${String(paymentCount + 1).padStart(3, "0")}`;

    await query(
      `INSERT INTO Payments (
        payment_id, bill_id, customer_id, amount, payment_method,
        transaction_reference, payment_date, status, notes, created_by
      )
      VALUES (
        @paymentId, @billId, @customerId, @amount, @paymentMethod,
        @transactionRef, @paymentDate, 'completed', @notes, @userId
      )`,
      {
        paymentId,
        billId: data.bill_id,
        customerId: bill.customer_id,
        amount: data.amount,
        paymentMethod: data.payment_method,
        transactionRef: data.transaction_reference || null,
        paymentDate: data.payment_date,
        notes: data.notes || null,
        userId,
      }
    );

    await query(
      `UPDATE Bills 
       SET status = 'paid', updated_at = GETDATE()
       WHERE id = @billId`,
      { billId: data.bill_id }
    );

    await query(
      `UPDATE Customers 
       SET balance = balance - @amount, updated_at = GETDATE()
       WHERE id = @customerId`,
      { customerId: bill.customer_id, amount: data.amount }
    );

    await query(
      `INSERT INTO Activities (activity_type, description, customer_id, amount)
       VALUES ('payment', 'Payment received', @customerId, @amount)`,
      { customerId: bill.customer_id, amount: data.amount }
    );

    revalidatePath("/UMS/Payments");
    revalidatePath("/UMS/Dashboard");
    return { success: true, paymentId };
  } catch (error) {
    console.error("Error recording payment:", error);
    return { success: false, error: "Failed to record payment" };
  }
};
