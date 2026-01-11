import { Badge, GlassCard } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getBills, getTariffRate } from "@/lib/data/billing";
import { getMeterById } from "@/lib/data/meters";
import { getReadings } from "@/lib/data/readings";
import { Header } from "@/components/layout";
import { BillingStepOne } from "@/components/Billing/BillingStepOne";
import { BillingForm } from "@/components/Billing/BillingForm";
import { BillsTable } from "@/components/Billing/BillsTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    step?: string;
    customerId?: string;
    meterId?: string;
    readingId?: string;
    currentReading?: string;
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
    startDate: "",
    endDate: "",
    readingId: params.readingId,
    consumption: 0,
    tariffRate: 0,
    taxPercentage: 0,
    amount: 0,
    tax: 0,
    total: 0,
    meterFound: false,
    internalMeterId: 0,
    internalCustomerId: 0,
    error: "",
    utilityType: "",
  };

  if (stepNumber > 1 && params.meterId) {
    const meter = await getMeterById(params.meterId);
    if (meter) {
      billingSummary.meterFound = true;
      billingSummary.customerName = meter.customer_name;
      billingSummary.customerId = meter.customer_display_id;
      billingSummary.internalCustomerId = meter.customer_id;
      billingSummary.internalMeterId = meter.id;
      billingSummary.utilityType = meter.utility_type;

      const latestReadings = await getReadings({ meterId: params.meterId }, 2);

      const latest = latestReadings[0];
      const previous = latestReadings[1];

      billingSummary.previousReading = previous?.reading_value || 0;

      if (!params.currentReading && latest) {
        billingSummary.currentReading = latest.reading_value;
      }

      const formatDate = (date: Date | null | undefined) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      // If there are only 2 readings, the first is the initial reading
      // Use install date as the billing period start
      if (latestReadings.length <= 2 && meter.install_date) {
        billingSummary.startDate = formatDate(meter.install_date);
      } else if (previous?.reading_date) {
        billingSummary.startDate = formatDate(previous.reading_date);
      } else if (meter.install_date) {
        // Fallback to install date if no previous reading
        billingSummary.startDate = formatDate(meter.install_date);
      }

      if (latest?.reading_date) {
        billingSummary.endDate = formatDate(latest.reading_date);
      }

      const tariffData = await getTariffRate(meter.utility_type);
      billingSummary.tariffRate = tariffData.rate;
      billingSummary.taxPercentage = tariffData.taxPercentage;

      if (stepNumber >= 2) {
        billingSummary.consumption =
          billingSummary.currentReading - billingSummary.previousReading;
        if (billingSummary.consumption < 0) billingSummary.consumption = 0;

        billingSummary.amount =
          billingSummary.consumption * billingSummary.tariffRate;
        billingSummary.tax =
          billingSummary.amount * (billingSummary.taxPercentage / 100);
        billingSummary.total = billingSummary.amount + billingSummary.tax;
      }
    } else {
      billingSummary.error = "Meter not found";
    }
  }
  const STEPS = ["Select Customer", "Generate"];

  return (
    <>
      <Header
        title="Billing Management"
        subtitle="Generate and manage utility bills"
      />

      {/* Wizard Steps */}
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
            />
          )}

          {stepNumber === 2 && <BillingForm billingSummary={billingSummary} />}
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
                Billing Period
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Start Date:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.startDate || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    End Date:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {billingSummary.endDate || "-"}
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
          </div>
        </GlassCard>
      </div>

      {/* Recent Bills Section */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Billing History
        </h2>
        <BillsTable bills={bills} />
      </GlassCard>
    </>
  );
}
