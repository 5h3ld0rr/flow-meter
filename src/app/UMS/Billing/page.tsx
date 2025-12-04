import { Badge, Button, GlassCard, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FileText, Calculator, Send, ArrowLeft, Verified } from "lucide-react";
import { getBills } from "@/lib/queries/billing";
import { Header } from "@/components/layout";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const params = await searchParams;
  const step = params.step || "1";
  const stepNumber = parseInt(step);
  const bills = await getBills();

  const billingSummary = {
    customerId: "C001",
    customerName: "John Smith",
    meterId: "ELC-2024-001",
    previousReading: 1000,
    currentReading: 1245,
    consumption: 245,
    tariffRate: 0.15,
    amount: 36.75,
    tax: 3.68,
    total: 40.43,
  };
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
            <div className="space-y-4">
              <Input label="Customer ID" placeholder="Enter customer ID" />
              <Input label="Meter ID" placeholder="Select meter" />
              <Input label="Billing Period" type="date" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <Button
                  variant="primary"
                  href="/UMS/Billing?step=2"
                  fullWidth
                  icon={<Verified size={18} />}
                >
                  Validate Customer
                </Button>
              </div>
            </div>
          )}

          {stepNumber === 2 && (
            <div className="space-y-4">
              <Input
                label="Previous Reading"
                type="number"
                defaultValue="1000"
                disabled
              />
              <Input
                label="Current Reading"
                type="number"
                defaultValue="1245"
              />
              <div className="glass rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Consumption
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    245 kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tariff Rate
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $0.15/kWh
                  </span>
                </div>
              </div>
              <div className="flex gap-4 absolute bottom-0 left-0 p-6 w-full">
                <Button
                  variant="secondary"
                  href="/UMS/Billing?step=1"
                  fullWidth
                  icon={<ArrowLeft size={18} />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  href="/UMS/Billing?step=3"
                  fullWidth
                  icon={<Calculator size={18} />}
                >
                  Calculate
                </Button>
              </div>
            </div>
          )}

          {stepNumber === 3 && (
            <div className="space-y-4">
              <div className="glass rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Base Amount
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $36.75
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tax (10%)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $3.68
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-cyan-400">
                    $40.43
                  </span>
                </div>
              </div>
              <div className="flex gap-4 absolute bottom-0 left-0 p-6 w-full">
                <Button
                  variant="secondary"
                  href="/UMS/Billing?step=2"
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
                    {billingSummary.customerId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Name:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Meter ID:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.meterId}
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
                    {billingSummary.previousReading} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current Reading:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.currentReading} kWh
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Total Consumption:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-cyan-400">
                    {billingSummary.consumption} kWh
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
                    ${bill.total_amount}
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
