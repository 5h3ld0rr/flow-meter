import { GlassCard } from "@/components/ui";
import { BarChart } from "@/components/charts";
import { getDefaultersReport } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";

export default async function Page() {
  const defaulterData = await getDefaultersReport();
  const topDefaulters = defaulterData.slice(0, 10);

  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Defaulters (Outstanding Amount)
          </h3>
          <div className="h-64">
            <BarChart
              data={topDefaulters}
              xAxisKey="name"
              dataKeys={[
                {
                  key: "outstanding",
                  color: "#EF4444",
                  name: "Amount ($)",
                },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Defaulters (Bill Count)
          </h3>
          <div className="h-64">
            <BarChart
              data={topDefaulters}
              xAxisKey="name"
              dataKeys={[
                {
                  key: "bill_count",
                  color: "#F59E0B",
                  name: "Unpaid Bills",
                },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      {/* Detailed Tables */}
      <GlassCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Defaulters List
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Overdue Bills
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Outstanding Amount
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody>
              {defaulterData.map((row, index) => {
                const riskLevel =
                  row.outstanding > 5000
                    ? "High"
                    : row.outstanding > 1000
                    ? "Medium"
                    : "Low";
                const riskColor =
                  riskLevel === "High"
                    ? "text-red-600"
                    : riskLevel === "Medium"
                    ? "text-amber-600"
                    : "text-green-600";

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {row.customer_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                      {row.bill_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                      ${row.outstanding.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-bold ${riskColor}`}
                    >
                      {riskLevel}
                    </td>
                  </tr>
                );
              })}
              {defaulterData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500 italic"
                  >
                    No defaulters found in current records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="defaulters" />
    </>
  );
}
