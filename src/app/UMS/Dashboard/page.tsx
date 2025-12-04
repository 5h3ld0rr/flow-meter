import { Users, Gauge, DollarSign, AlertCircle } from "lucide-react";
import { UTILITIES } from "@/constants";
import { Badge, GlassCard } from "@/components/ui";
import { Header } from "@/components/layout";
import { LineChart, PieChart, StatCard } from "@/components/charts";
import {
  getDashboardStats,
  getConsumptionTrend,
  getTopConsumers,
  getRecentActivities,
  getUtilityDistribution,
} from "@/lib/queries/dashboard";

export const metadata = {
  title: "Dashboard",
  description: "Overview of utility management system",
};

export default async function Page() {
  // Fetch all dashboard data from database
  const [stats, consumptionData, topConsumers, recentActivities, utilityDist] =
    await Promise.all([
      getDashboardStats(),
      getConsumptionTrend(7),
      getTopConsumers(4),
      getRecentActivities(4),
      getUtilityDistribution(),
    ]);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Overview of utility management system"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={<Users size={24} />}
          trend={{
            value: stats.totalCustomersTrend,
            isPositive: stats.totalCustomersTrend >= 0,
          }}
          color="blue"
        />
        <StatCard
          title="Active Meters"
          value={stats.activeMeters.toLocaleString()}
          icon={<Gauge size={24} />}
          trend={{
            value: stats.activeMetersTrend,
            isPositive: stats.activeMetersTrend >= 0,
          }}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.monthlyRevenue / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          trend={{
            value: stats.monthlyRevenueTrend,
            isPositive: stats.monthlyRevenueTrend >= 0,
          }}
          color="yellow"
        />
        <StatCard
          title="Outstanding"
          value={`$${(stats.outstandingAmount / 1000).toFixed(1)}K`}
          icon={<AlertCircle size={24} />}
          trend={{
            value: stats.outstandingTrend,
            isPositive: false,
          }}
          color="red"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Consumption Trend Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Consumption Trend
            </h2>
            <Badge variant="info">Last 7 days</Badge>
          </div>
          <div className="h-64">
            <LineChart
              data={consumptionData}
              xAxisKey="day"
              dataKeys={Object.values(UTILITIES).map((util) => ({
                key: util.name.toLowerCase(),
                color: util.color,
                name: util.name,
              }))}
            />
          </div>
        </GlassCard>

        {/* Top Consumers */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Top Consumers
          </h2>
          <div className="space-y-4">
            {topConsumers.map((consumer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-slate-200 text-sm">
                    {consumer.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {consumer.consumption}
                  </p>
                </div>
                <Badge
                  variant={
                    consumer.change.startsWith("+") ? "success" : "danger"
                  }
                  size="sm"
                >
                  {consumer.change}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Utility Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Utility Distribution
          </h2>
          <div className="h-64">
            <PieChart data={utilityDist} />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth"
              >
                <div className="flex-1">
                  <p className="font-medium  text-gray-800 dark:text-slate-200">
                    {activity.customer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold  text-gray-800 dark:text-slate-200">
                    {activity.amount || activity.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
