import { GlassCard } from "@/components/ui";
import { Header } from "@/components/layout";
import { CreditCard, DollarSign } from "lucide-react";
import { PaymentsTable } from "@/components/Payments/PaymentsTable";
import { ProcessPaymentForm } from "@/components/Payments/ProcessPaymentForm";
import { getPayments, getPaymentStats } from "@/lib/data/payments";

export default async function Page() {
  const [payments, stats] = await Promise.all([
    getPayments(),
    getPaymentStats(),
  ]);

  return (
    <>
      <Header
        title="Payment Management"
        subtitle="Record and track customer payments"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment Entry Form */}
        <GlassCard className="lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Record Payment
          </h2>

          <ProcessPaymentForm />
        </GlassCard>

        {/* Payment Summary Cards */}
        <div className="lg:gap-16 gap-6 flex flex-col py-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Today&apos;s Collection
              </span>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.todayCollection.toLocaleString()}
            </p>
            <p
              className={`text-sm mt-1 ${stats.todayTrend >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
                }`}
            >
              {stats.todayTrend >= 0 ? "+" : ""}
              {stats.todayTrend}% from yesterday
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                This Month
              </span>
              <DollarSign size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.monthlyCollection.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              {stats.monthlyPercentage}% of target
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </span>
              <CreditCard size={20} className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.pendingAmount.toLocaleString()}
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              {stats.pendingCount} transactions
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Payment History Table */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Payment History
        </h2>
        <PaymentsTable data={payments} />
      </GlassCard>
    </>
  );
}
