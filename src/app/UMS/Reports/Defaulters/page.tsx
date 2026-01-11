import { GlassCard } from "@/components/ui";
import { BarChart } from "@/components/charts";
import { getDefaultersReport } from "@/lib/data/reports";
import { AIAnalysisPanel } from "@/components/Reports";
import { DefaultersTable } from "@/components/Reports/DefaultersTable";

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
        <DefaultersTable data={defaulterData} />
      </GlassCard>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel reportType="defaulters" />
    </>
  );
}
