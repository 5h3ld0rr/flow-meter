import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import {
  getConsumptionReport,
  getRevenueByUtilityType,
} from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const [consumptionData, utilityData] = await Promise.all([
    getConsumptionReport(startDate, endDate),
    getRevenueByUtilityType(),
  ]);

  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Total Consumption Trend (kWh)
          </h3>
          <div className="h-64">
            <AreaChart
              data={consumptionData}
              xAxisKey="month"
              dataKeys={[
                {
                  key: "consumption",
                  color: "#3B82F6",
                  name: "Actual Consumption",
                },
                {
                  key: "target",
                  color: "#94A3B8",
                  name: "Forecasted",
                },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Consumption by Utility Type
          </h3>
          <div className="h-64">
            <BarChart
              data={utilityData}
              xAxisKey="utility_type"
              dataKeys={[
                {
                  key: "consumption",
                  color: "#51a2ff",
                  name: "Consumption (kWh)",
                },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      {/* Detailed Tables */}
      <GlassCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed Utility Consumption Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Utility Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Active Meters
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Consumption (kWh)
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Avg per Meter
                </th>
              </tr>
            </thead>
            <tbody>
              {utilityData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium capitalize">
                    {row.utility_type}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                    {row.customers}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-semibold">
                    {row.consumption.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                    {row.customers > 0
                      ? (row.consumption / row.customers).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="consumption" />
    </>
  );
}
