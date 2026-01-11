import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import { getRevenueReport, getRevenueByUtilityType } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";
import { RevenueByUtilityTable } from "@/components/Reports/RevenueByUtilityTable";

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
                  key: "target",
                  color: "#51a2ff",
                  name: "Target",
                },
                {
                  key: "revenue",
                  color: "#b15eff",
                  name: "Revenue (LKR)",
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
                  name: "Revenue (LKR)",
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
        <RevenueByUtilityTable data={utilityData} />
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="revenue" />
    </>
  );
}
