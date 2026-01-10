"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader2, Calculator } from "lucide-react";
import { validateCustomerAndGetMeters } from "@/lib/actions/billing";
import { toast } from "sonner";
interface BillingStepOneProps {
  initialCustomerId?: string;
  initialMeterId?: string;
  initialBillingDate?: string;
}

export function BillingStepOne({
  initialCustomerId = "",
  initialMeterId = "",
  initialBillingDate = "",
}: BillingStepOneProps) {
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [meters, setMeters] = useState<{ value: string; label: string }[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const handleBlur = async () => {
    if (!customerId) return;

    setIsValidating(true);
    setCustomerName("");
    setMeters([]);

    const result = await validateCustomerAndGetMeters(customerId);

    setIsValidating(false);

    if (result.success && result.meters) {
      setMeters(result.meters);
      setCustomerName(result.customerName || "");
      toast.success(`Customer found: ${result.customerName}`);
    } else {
      toast.error(result.error || "Invalid Customer ID");
    }
  };

  return (
    <form action="/UMS/Billing" method="GET">
      <input type="hidden" name="step" value="2" />
      <div className="space-y-4">
        <div className="relative">
          <Input
            name="customerId"
            label="Customer ID"
            placeholder="Enter customer ID (e.g. C001)"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            onBlur={handleBlur}
            required
          />
          {isValidating && (
            <div className="absolute right-3 top-[38px] text-gray-400">
              <Loader2 size={16} className="animate-spin" />
            </div>
          )}
        </div>

        {meters.length > 0 ? (
          <Input
            type="select"
            name="meterId"
            label="Select Meter"
            options={[{ value: "", label: "Select a meter" }, ...meters]}
            defaultValue={initialMeterId}
            required
          />
        ) : (
          <Input
            name="meterId"
            label="Meter ID"
            placeholder="Validate customer first"
            defaultValue={initialMeterId}
            readOnly={!customerName && !initialMeterId}
            required
          />
        )}

        <Input
          label="Billing Period"
          type="date"
          name="billingDate"
          defaultValue={initialBillingDate}
        />

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            icon={<Calculator size={18} />}
            disabled={!customerName && !initialMeterId}
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
