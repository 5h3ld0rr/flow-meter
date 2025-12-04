import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import { getRevenueReport, getRegionalReport } from "@/lib/queries/reports";

export default async function Page() {
  const [revenueData, regionalData] = await Promise.all([
    getRevenueReport(),
    getRegionalReport(),
  ]);

  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend (Last 6 Months)
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
            Regional Performance
          </h3>
          <div className="h-64">
            <BarChart
              data={regionalData}
              xAxisKey="region"
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
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Consumers by Region
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Region
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
              {regionalData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    {row.region} District
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {row.customers}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {row.consumption.toLocaleString()} kWh
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    +8%
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
