import { Users, Gauge, DollarSign, AlertCircle } from "lucide-react";
import {
  CONSUMPTION_DATA,
  RECENT_ACTIVITIES,
  TOP_CONSUMERS,
  UTILITIES,
} from "@/constants";
import {
  Badge,
  GlassCard,
  Header,
  LineChart,
  PieChart,
  StatCard,
} from "@/components";

export default function DashboardPage() {
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
          value="2,847"
          icon={<Users size={24} />}
          trend={{
            value: 12,
            isPositive: true,
          }}
          color="blue"
        />
        <StatCard
          title="Active Meters"
          value="3,521"
          icon={<Gauge size={24} />}
          trend={{
            value: 5,
            isPositive: true,
          }}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value="$124.5K"
          icon={<DollarSign size={24} />}
          trend={{
            value: 8,
            isPositive: true,
          }}
          color="yellow"
        />
        <StatCard
          title="Outstanding"
          value="$23.2K"
          icon={<AlertCircle size={24} />}
          trend={{
            value: 3,
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
              data={CONSUMPTION_DATA}
              xAxisKey="day"
              dataKeys={UTILITIES.map((util) => ({
                key: util.name.toLocaleLowerCase(),
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
            {TOP_CONSUMERS.map((consumer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
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
            <PieChart
              data={UTILITIES.map((util) => ({
                name: util.name,
                color: util.color,
                value: 33.33,
              }))}
            />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin">
            {RECENT_ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.customer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
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
