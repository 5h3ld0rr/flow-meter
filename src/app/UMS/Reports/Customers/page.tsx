import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import { getCustomerReport, getRegionalReport } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const [customerData, regionalData] = await Promise.all([
    getCustomerReport(startDate, endDate),
    getRegionalReport(),
  ]);

  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Growth Trend
          </h3>
          <div className="h-64">
            <AreaChart
              data={customerData}
              xAxisKey="month"
              dataKeys={[
                {
                  key: "customers",
                  color: "#10B981",
                  name: "New Customers",
                },
                {
                  key: "target",
                  color: "#94A3B8",
                  name: "Target Growth",
                },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customers by Region
          </h3>
          <div className="h-64">
            <BarChart
              data={regionalData}
              xAxisKey="region"
              dataKeys={[
                {
                  key: "customers",
                  color: "#3B82F6",
                  name: "Total Customers",
                },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      {/* Detailed Tables */}
      <GlassCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Regional Customer Distribution
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Region Area
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total Customers
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Share %
                </th>
              </tr>
            </thead>
            <tbody>
              {regionalData.map((row, index) => {
                const totalCustomers = regionalData.reduce(
                  (sum, r) => sum + r.customers,
                  0
                );
                const share =
                  totalCustomers > 0
                    ? ((row.customers / totalCustomers) * 100).toFixed(1)
                    : "0";

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                      {row.region || "Central"} Area
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                      {row.customers}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-semibold">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="customers" />
    </>
  );
}
