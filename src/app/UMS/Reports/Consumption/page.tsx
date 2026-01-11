import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import {
  getConsumptionReport,
  getRevenueByUtilityType,
} from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";
import { ConsumptionByUtilityTable } from "@/components/Reports/ConsumptionByUtilityTable";

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
        <ConsumptionByUtilityTable data={utilityData} />
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="consumption" />
    </>
  );
}
