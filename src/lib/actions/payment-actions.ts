"use server";

import { recordPayment } from "./payments";
import { getBillForPayment } from "@/lib/data/payments";
import { query } from "@/lib/db";

export async function processPaymentAction(
    prevState: any,
    formData: FormData
) {
    const billId = formData.get("bill_id") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentMethod = formData.get("payment_method") as "cash" | "card" | "online" | "check";
    const transactionRef = formData.get("transaction_reference") as string;

    // Default system user ID for now
    const userId = 1;

    if (!billId || isNaN(amount) || !paymentMethod) {
        return { success: false, message: "Please fill in all required fields" };
    }

    const result = await recordPayment({
        bill_id: billId,
        amount,
        payment_method: paymentMethod,
        transaction_reference: transactionRef,
        payment_date: new Date(),
        notes: "Processed via web form"
    }, userId);

    if (result.success) {
        return { success: true, message: `Payment processed successfully. Payment ID: ${result.paymentId}` };
    } else {
        return { success: false, message: result.error || "Failed to process payment" };
    }
}

export async function validateBillAction(billId: string) {
    const bill = await getBillForPayment(billId);

    if (!bill) {
        return { success: false, error: "Bill not found" };
    }
    if (bill.status === 'paid') {
        return { success: false, error: "Bill is already paid" };
    }

    // Fetch readable customer ID
    // customer_id in 'bill' object is the integer ID.
    const customer = await query<{ customer_id: string }>(
        "SELECT customer_id FROM Customers WHERE id = @id",
        { id: bill.customer_id }
    );

    return {
        success: true,
        customerId: customer.recordset[0]?.customer_id || "Unknown",
        amount: bill.total_amount
    };
}
