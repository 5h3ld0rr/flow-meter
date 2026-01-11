"use client";

import { Button, Input, toast } from "@/components/ui";
import { CheckCircle, DollarSign, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import {
  processPaymentAction,
  validateBillAction,
} from "@/lib/actions/payments";

export const ProcessPaymentForm = () => {
  const [state, action, isPending] = useActionState(
    processPaymentAction,
    undefined
  );

  const [billId, setBillId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (state?.message) {
      toast(state.success ? "success" : "error", state.message);
      if (state.success) {
        // Reset form
        setBillId("");
        setCustomerId("");
        setAmount("");
      }
    }
  }, [state]);

  const handleBillBlur = async () => {
    if (!billId) return;

    setIsValidating(true);
    try {
      const result = await validateBillAction(billId);
      if (result.success && result.customerId) {
        setCustomerId(result.customerId);
        if (result.amount) setAmount(result.amount.toString());
        toast("success", "Bill found");
      } else if (result.error) {
        toast("error", result.error);
        setCustomerId("");
        setAmount("");
      }
    } catch (error) {
      console.error(error);
      toast("error", "Failed to validate bill");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form action={action} className="space-y-4">
      <div className="relative">
        <Input
          name="bill_id"
          label="Bill ID"
          placeholder="Enter bill ID (e.g. BILL-2024-XXXX)"
          required
          value={billId}
          onChange={(e) => setBillId(e.target.value)}
          onBlur={handleBillBlur}
        />
        {isValidating && (
          <div className="absolute right-3 top-[34px] text-gray-400">
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}
      </div>

      <Input
        label="Customer ID"
        placeholder="Auto-filled"
        value={customerId}
        disabled
        readOnly
      />

      <Input
        name="amount"
        label="Amount"
        type="number"
        placeholder="0.00"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        icon={<DollarSign size={18} />}
        step="0.01"
      />

      <Input
        name="payment_method"
        label="Payment Method"
        type="select"
        placeholder="Select payment method"
        required
        options={[
          { value: "cash", label: "Cash" },
          { value: "card", label: "Card" },
          { value: "online_transfer", label: "Online Transfer" },
          { value: "check", label: "Check" },
        ]}
      />

      <Input
        name="transaction_reference"
        label="Transaction Reference"
        placeholder="Optional"
      />

      <Button variant="primary" fullWidth type="submit" disabled={isPending}>
        {isPending ? (
          <>Processing...</>
        ) : (
          <>
            <CheckCircle size={18} className="mr-2" />
            Process Payment
          </>
        )}
      </Button>
    </form>
  );
};
