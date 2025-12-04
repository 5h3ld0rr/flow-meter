import { UTILITIES } from "@/constants";
import { getCustomerById } from "@/lib/data/customers";
import { getMeters } from "@/lib/data/meters";
import { getPayments } from "@/lib/data/payments";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { getBills } from "@/lib/queries/billing";
import { Badge, GlassCard } from "@/components/ui";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: customerId } = await params;
  const customer = await getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const [meters, payments, bills] = await Promise.all([
    getMeters(undefined, customerId),
    getPayments({ customerId }),
    getBills({ customerId }),
  ]);

  const totalBilled = bills.reduce(
    (sum, bill) => sum + Number(bill.total_amount),
    0
  );
  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  return (
    <>
      <Header
        title={customer.name}
        subtitle={`Customer ID: ${customer.customer_id}`}
        showBackButton
      />

      {/* Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customer.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customer.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customer.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customer Since
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Summary
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <Badge
                variant={customer.status === "active" ? "success" : "danger"}
                className="mt-1"
              >
                {customer.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Balance
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  customer.balance > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                ${customer.balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Billed
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                ${totalBilled.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Paid
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                ${totalPaid.toFixed(2)}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Meters */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Meters ({meters.length})
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meters.map((meter) => {
            const utilityConfig = UTILITIES[meter.utility_type];

            return (
              <Link key={meter.meter_id} href={`/UMS/Meters/${meter.meter_id}`}>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <utilityConfig.icon
                      size={20}
                      className={utilityConfig.textClassName}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {meter.serial_number}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {meter.utility_type}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Location:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {meter.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Last Reading:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {meter.last_reading_value || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      <Badge
                        variant={
                          meter.status === "active" ? "success" : "warning"
                        }
                        size="sm"
                      >
                        {meter.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {meters.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
              No meters installed for this customer
            </p>
          )}
        </div>
      </GlassCard>

      {/* Recent Bills */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Bills
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bill ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Period
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Consumption
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.slice(0, 5).map((bill) => (
                <tr
                  key={bill.bill_id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {bill.bill_id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(bill.billing_period_start).toLocaleDateString()} -{" "}
                    {new Date(bill.billing_period_end).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {bill.consumption}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                    ${Number(bill.total_amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
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
                </tr>
              ))}
            </tbody>
          </table>
          {bills.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No bills found for this customer
            </p>
          )}
        </div>
      </GlassCard>

      {/* Payment History */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Method
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 5).map((payment) => (
                <tr
                  key={payment.payment_id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {payment.payment_id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {payment.payment_method}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        payment.status === "completed" ? "success" : "warning"
                      }
                      size="sm"
                    >
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No payments found for this customer
            </p>
          )}
        </div>
      </GlassCard>
    </>
  );
}
