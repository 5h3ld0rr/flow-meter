import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import { getRevenueReport, getRevenueByUtilityType } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const [revenueData, utilityData] = await Promise.all([
    getRevenueReport(startDate, endDate),
    getRevenueByUtilityType(),
  ]);

  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <div className="h-64">
            <AreaChart
              data={revenueData}
              xAxisKey="month"
              dataKeys={[
                {
                  key: "revenue",
                  color: "#b15eff",
                  name: "Revenue",
                },
                {
                  key: "target",
                  color: "#51a2ff",
                  name: "Target",
                },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Utility Performance
          </h3>
          <div className="h-64">
            <BarChart
              data={utilityData}
              xAxisKey="utility_type"
              dataKeys={[
                {
                  key: "revenue",
                  color: "#3B82F6",
                  name: "Revenue ($)",
                },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      {/* Detailed Tables */}
      <GlassCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue by Utility Type
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Utility Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Customers
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Consumption
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {utilityData.map((row, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium capitalize">
                      {row.utility_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {row.customers}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {row.consumption.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      +8%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="revenue" />
    </>
  );
}
