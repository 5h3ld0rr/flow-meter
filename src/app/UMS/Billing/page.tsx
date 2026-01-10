import { Badge, Button, GlassCard, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FileText, Calculator, Send, ArrowLeft } from "lucide-react";
import { getBills, getTariffRate } from "@/lib/data/billing";
import { getMeterById, getMeterLastReading } from "@/lib/data/meters";
import { Header } from "@/components/layout";
import { BillingStepOne } from "@/components/Billing/BillingStepOne";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    step?: string;
    customerId?: string;
    meterId?: string;
    currentReading?: string;
    billingDate?: string;
  }>;
}) {
  const params = await searchParams;
  const step = params.step || "1";
  const stepNumber = parseInt(step);
  const bills = await getBills();

  const billingSummary = {
    customerId: params.customerId || "",
    customerName: "",
    meterId: params.meterId || "",
    previousReading: 0,
    currentReading: parseFloat(params.currentReading || "0"),
    consumption: 0,
    tariffRate: 0,
    amount: 0,
    tax: 0,
    total: 0,
    meterFound: false,
    error: "",
  };

  if (stepNumber > 1 && params.meterId) {
    const meter = await getMeterById(params.meterId);
    if (meter) {
      billingSummary.meterFound = true;
      billingSummary.customerName = meter.customer_name;
      billingSummary.customerId = meter.customer_display_id;
      const lastReading = await getMeterLastReading(params.meterId);
      billingSummary.previousReading = lastReading?.last_reading_value || 0;

      billingSummary.tariffRate = await getTariffRate(meter.utility_type);

      if (stepNumber > 2) {
        billingSummary.consumption =
          billingSummary.currentReading - billingSummary.previousReading;
        if (billingSummary.consumption < 0) billingSummary.consumption = 0;

        billingSummary.amount =
          billingSummary.consumption * billingSummary.tariffRate;
        billingSummary.tax = billingSummary.amount * 0.1;
        billingSummary.total = billingSummary.amount + billingSummary.tax;
      }
    } else {
      billingSummary.error = "Meter not found";
    }
  }
  const STEPS = ["Select Customer", "Calculate", "Generate"];

  return (
    <>
      <Header
        title="Billing Management"
        subtitle="Generate and manage utility bills"
      />

      {/* Wizard Steps */}
      <GlassCard className="p-12 mb-6 pt-6">
        <div className="flex items-center justify-between">
          {STEPS.map((stepLabel, stepIndex) => (
            <div
              key={stepIndex}
              className={cn(
                "flex items-center",
                stepIndex + 1 < STEPS.length ? "flex-1" : ""
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth relative",
                  stepNumber >= stepIndex + 1
                    ? "bg-blue-600 dark:bg-cyan-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {stepIndex + 1}
                <span className="absolute -bottom-8 z-10 text-sm font-medium text-gray-700 dark:text-gray-300 text-nowrap">
                  {stepLabel}
                </span>
              </div>
              {stepIndex + 1 < STEPS.length && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-4",
                    stepNumber > stepIndex + 1
                      ? "bg-blue-600 dark:bg-cyan-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bill Generation Form */}
        <GlassCard className="p-6 relative">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Bill Details
          </h2>

          {stepNumber === 1 && (
            <BillingStepOne
              initialCustomerId={billingSummary.customerId}
              initialMeterId={billingSummary.meterId}
              initialBillingDate={params.billingDate}
            />
          )}

          {stepNumber === 2 && (
            <form action="/UMS/Billing" method="GET">
              <input type="hidden" name="step" value="3" />
              <input
                type="hidden"
                name="customerId"
                value={billingSummary.customerId}
              />
              <input
                type="hidden"
                name="meterId"
                value={billingSummary.meterId}
              />

              <div className="space-y-4">
                {billingSummary.error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {billingSummary.error}
                  </div>
                )}

                <div className="glass p-3 rounded-lg mb-2">
                  <p className="text-sm text-gray-500">
                    Customer:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {billingSummary.customerName || "Unknown"}
                    </span>
                  </p>
                </div>

                <Input
                  label="Previous Reading"
                  type="number"
                  value={billingSummary.previousReading}
                  readOnly
                  disabled
                />
                <Input
                  name="currentReading"
                  label="Current Reading"
                  type="number"
                  placeholder="Enter current reading"
                  min={billingSummary.previousReading}
                  required
                />
                <div className="glass rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tariff Rate
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Rs. {billingSummary.tariffRate}/unit
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 absolute bottom-0 left-0 p-6 w-full">
                  <Button
                    variant="secondary"
                    href={`/UMS/Billing?step=1&meterId=${billingSummary.meterId}&customerId=${billingSummary.customerId}`}
                    fullWidth
                    icon={<ArrowLeft size={18} />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    icon={<Calculator size={18} />}
                    disabled={!!billingSummary.error}
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </form>
          )}

          {stepNumber === 3 && (
            <div className="space-y-4">
              <div className="glass rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Consumption
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {billingSummary.consumption.toFixed(2)} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Base Amount
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Rs. {billingSummary.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tax (10%)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Rs. {billingSummary.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-cyan-400">
                    Rs. {billingSummary.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 absolute bottom-0 left-0 p-6 w-full">
                <Button
                  variant="secondary"
                  href={`/UMS/Billing?step=2&meterId=${billingSummary.meterId}&customerId=${billingSummary.customerId}`}
                  fullWidth
                >
                  <ArrowLeft size={18} />
                  Back
                </Button>
                <Button variant="primary" fullWidth>
                  <Send size={18} />
                  Generate Bill
                </Button>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Bill Preview */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bill Preview
            </h2>
            <Badge variant="info">Draft</Badge>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Customer ID:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.customerId || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Name:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.customerName || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Meter ID:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.meterId || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Consumption Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Previous Reading:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.previousReading} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current Reading:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.currentReading || "-"} units
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Total Consumption:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-cyan-400">
                    {billingSummary.consumption.toFixed(2)} units
                  </span>
                </div>
              </div>
            </div>

            <Button variant="secondary" fullWidth>
              <FileText size={18} className="mr-2" />
              Download PDF
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Recent Bills Section */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Bills
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Bill ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.bill_id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {bill.bill_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {bill.customer_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(bill.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Rs. {bill.total_amount}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        bill.status === "paid"
                          ? "success"
                          : bill.status === "overdue"
                          ? "danger"
                          : "warning"
                      }
                      size="sm"
                    >
                      {bill.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}
