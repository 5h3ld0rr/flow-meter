"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getBillForPayment } from "@/lib/data/payments";

/**
 * Records a payment with parameterized SQL queries
 * Handles bill status update and customer balance adjustment
 * Protected against SQL injection via parameterized queries
 */
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

    // Get internal bill ID
    const billResult = await query<{ id: number; customer_id: number }>(
      "SELECT id, customer_id FROM Bills WHERE bill_id = @billId",
      { billId: data.bill_id }
    );

    if (!billResult.recordset[0]) {
      return { success: false, error: "Bill not found" };
    }

    const billIntId = billResult.recordset[0].id;
    const customerIntId = billResult.recordset[0].customer_id;

    // Insert payment and get ID in same batch (works with triggers)
    const paymentResult = await query<{ id: number; payment_id: string }>(
      `INSERT INTO Payments (
        bill_id, customer_id, amount, payment_method,
        transaction_reference, payment_date, status, notes, created_by
      )
      VALUES (
        @billId, @customerId, @amount, @paymentMethod,
        @transactionRef, @paymentDate, 'completed', @notes, @userId
      );
      
      DECLARE @insertedId INT = CAST(SCOPE_IDENTITY() AS INT);
      SELECT @insertedId as id, payment_id FROM Payments WHERE id = @insertedId;`,
      {
        billId: billIntId,
        customerId: customerIntId,
        amount: data.amount,
        paymentMethod: data.payment_method,
        transactionRef: data.transaction_reference || null,
        paymentDate: data.payment_date,
        notes: data.notes || null,
        userId,
      }
    );

    const paymentId = paymentResult.recordset[0].payment_id;

    // REFACTORED: Simple UPDATE with parameterized query
    await query(
      `UPDATE Bills
       SET status = @status, updated_at = GETUTCDATE()
       WHERE id = @billId`,
      {
        billId: billIntId,
        status: "paid",
      }
    );

    // REFACTORED: Simple UPDATE with parameterized query for customer balance
    await query(
      `UPDATE Customers
       SET balance = balance - @amount, updated_at = GETUTCDATE()
       WHERE id = @customerId`,
      {
        customerId: customerIntId,
        amount: data.amount,
      }
    );

    revalidatePath("/UMS/Payments");
    revalidatePath("/UMS/Dashboard");
    return { success: true, paymentId };
  } catch (error) {
    console.error("Error recording payment:", error);
    return { success: false, error: "Failed to record payment" };
  }
};
