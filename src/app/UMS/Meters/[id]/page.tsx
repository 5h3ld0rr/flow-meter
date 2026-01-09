import { Badge, Button, GlassCard } from "@/components/ui";
import { Header } from "@/components/layout";
import { getMeterById } from "@/lib/data/meters";
import { getReadings } from "@/lib/data/readings";
import { getBills } from "@/lib/data/billing";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Activity } from "lucide-react";
import { UTILITIES } from "@/constants";
import { cn } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: meterId } = await params;

  const [meter, readings, bills] = await Promise.all([
    getMeterById(meterId),
    getReadings({ meterId }),
    getBills({ meterId }),
  ]);

  if (!meter) {
    notFound();
  }

  const utilityConfig = UTILITIES[meter.utility_type as keyof typeof UTILITIES];
  const Icon = utilityConfig.icon;
  const iconColor = utilityConfig.textClassName;

  // Calculate statistics
  const totalConsumption = readings.reduce(
    (sum, reading) => sum + Number(reading.consumption),
    0
  );
  const avgConsumption =
    readings.length > 0 ? totalConsumption / readings.length : 0;
  const totalBilled = bills.reduce(
    (sum, bill) => sum + Number(bill.total_amount),
    0
  );

  return (
    <>
      <Header
        title={meter.serial_number}
        subtitle={`Meter ID: ${meter.meter_id}`}
        showBackButton
        copyText={meter.meter_id}
      />
      {/* Meter Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className={cn(
                "p-3 rounded-lg",
                utilityConfig.backgroundClassName
              )}
            >
              <Icon size={24} className={iconColor} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {meter.serial_number}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {meter.utility_type} Meter
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {meter.location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Install Date
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(meter.install_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Reading
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {meter.last_reading_value
                    ? `${meter.last_reading_value} ${utilityConfig.unit}`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Reading Date
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {meter.last_reading_date
                    ? new Date(meter.last_reading_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Customer Information
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {meter.customer_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {meter.customer_email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                href={`/UMS/Customers/${meter.customer_id}`}
              >
                View Customer
              </Button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Meter Statistics
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <Badge
                variant={
                  meter.status === "active"
                    ? "success"
                    : meter.status === "maintenance"
                    ? "warning"
                    : "danger"
                }
                className="mt-1"
              >
                {meter.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Consumption
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalConsumption.toLocaleString()} {utilityConfig.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Consumption
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {avgConsumption.toFixed(2)} {utilityConfig.unit}
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
                Total Readings
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {readings.length}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Reading History */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reading History
          </h2>
          <Button variant="primary" size="sm" href="/UMS/Readings/New">
            Add Reading
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reading Value
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Consumption
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {readings.slice(0, 10).map((reading) => (
                <tr
                  key={reading.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(reading.reading_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {Number(reading.reading_value).toLocaleString()}{" "}
                    {utilityConfig.unit}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {Number(reading.consumption).toLocaleString()}{" "}
                    {utilityConfig.unit}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        reading.status === "verified"
                          ? "success"
                          : reading.status === "disputed"
                          ? "danger"
                          : "warning"
                      }
                      size="sm"
                    >
                      {reading.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {reading.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {readings.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No readings found for this meter
            </p>
          )}
        </div>
      </GlassCard>

      {/* Billing History */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Billing History
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
                  Base Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.slice(0, 10).map((bill) => (
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
                    {Number(bill.consumption).toLocaleString()}{" "}
                    {utilityConfig.unit}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    ${Number(bill.base_amount).toFixed(2)}
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
              No bills found for this meter
            </p>
          )}
        </div>
      </GlassCard>
    </>
  );
}
