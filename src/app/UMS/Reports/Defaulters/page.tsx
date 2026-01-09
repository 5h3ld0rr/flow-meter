import { GlassCard } from "@/components/ui";
import { BarChart } from "@/components/charts";
import { getDefaultersReport, getRegionalReport } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";

export default async function Page() {
  const [defaulterData, regionalData] = await Promise.all([
    getDefaultersReport(),
    getRegionalReport(),
  ]);

  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Outstanding Amount by Region ($)
          </h3>
          <div className="h-64">
            <BarChart
              data={defaulterData}
              xAxisKey="region"
              dataKeys={[
                {
                  key: "outstanding",
                  color: "#EF4444",
                  name: "Total Outstanding ($)",
                },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Defaulter Count by Region
          </h3>
          <div className="h-64">
            <BarChart
              data={defaulterData}
              xAxisKey="region"
              dataKeys={[
                {
                  key: "defaulters",
                  color: "#F59E0B",
                  name: "Defaulter Count",
                },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      {/* Detailed Tables */}
      <GlassCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Regional Payment Risk Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Region Area
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Defaulters
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Overdue Pills
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
                  row.outstanding > 1000
                    ? "High"
                    : row.outstanding > 500
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
                      {row.region || "Central"} Area
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                      {row.defaulters}
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
