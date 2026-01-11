import { Badge, Button, GlassCard } from "@/components/ui";
import { Printer } from "lucide-react";
import { getBillByBillId } from "@/lib/data/billing";
import { Header } from "@/components/layout";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const billId = decodeURIComponent(id);

  const bill = await getBillByBillId(billId);

  if (!bill) {
    notFound();
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Header
        title={bill.bill_id}
        subtitle="View bill information"
        showBackButton
      />

      <div className="max-w-4xl mx-auto">
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Utility Bill
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Issued: {formatDate(bill.created_at)}
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  bill.status === "paid"
                    ? "success"
                    : bill.status === "overdue"
                      ? "danger"
                      : "warning"
                }
                className="text-lg px-4 py-1"
              >
                {bill.status}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">{bill.bill_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Customer Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bill.customer_name}
                </span>
                <span className="text-gray-600 dark:text-gray-400">ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bill.customer_display_id}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Meter Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Meter ID:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bill.meter_display_id}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Serial:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bill.meter_serial}
                </span>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Consumption & Charges
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm mb-6">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Billing Period Start
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(bill.billing_period_start)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Billing Period End
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(bill.billing_period_end)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Previous Reading
                </span>
                <span className="text-gray-900 dark:text-white">
                  {bill.previous_reading}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Current Reading
                </span>
                <span className="text-gray-900 dark:text-white">
                  {bill.current_reading}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-2 rounded">
                <span className="font-medium text-gray-900 dark:text-white">
                  Total Consumption
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {bill.consumption} units
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Tariff Rate
                </span>
                <span className="text-gray-900 dark:text-white">
                  LKR {bill.tariff_rate}/unit
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Base Amount
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  LKR {bill.base_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  LKR {bill.tax_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-cyan-400">
                  LKR {bill.total_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-sm text-red-500 font-medium">
                  Due Date: {formatDate(bill.due_date)}
                </span>
              </div>
            </div>
          </div>

          <Button variant="primary">
            <Printer size={18} className="mr-2" />
            Print / Download
          </Button>
        </GlassCard>
      </div>
    </>
  );
}
