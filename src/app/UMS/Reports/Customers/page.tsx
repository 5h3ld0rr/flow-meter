import { GlassCard } from "@/components/ui";
import { BarChart, AreaChart } from "@/components/charts";
import { getCustomerReport, getRevenueByUtilityType } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";
import { UtilityCustomerTable } from "@/components/Reports/UtilityCustomerTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const [customerData, utilityData] = await Promise.all([
    getCustomerReport(startDate, endDate),
    getRevenueByUtilityType(),
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
            Customers by Utility Type
          </h3>
          <div className="h-64">
            <BarChart
              data={utilityData}
              xAxisKey="utility_type"
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
          Utility Customer Distribution
        </h3>
        <UtilityCustomerTable data={utilityData} />
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="customers" />
    </>
  );
}
