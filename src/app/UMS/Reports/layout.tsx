import { Header } from "@/components/layout";
import { StatCard } from "@/components/charts";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { ActionBar } from "@/components/Reports";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stats = await getDashboardStats();

  return (
    <>
      <Header
        title="Reports & Analytics"
        subtitle="Comprehensive insights and data analysis"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`LKR ${(stats.totalRevenue / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          trend={{
            value: stats.revenueTrend,
            isPositive: stats.revenueTrend >= 0,
          }}
          color="green"
        />
        <StatCard
          title="Monthly Consumption"
          value={
            <div className="flex flex-col gap-0.5 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold leading-tight">
                  {stats.monthlyConsumption["electricity"]?.toLocaleString() ??
                    "0"}
                </span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  kWh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold leading-tight">
                  {stats.monthlyConsumption["water"]?.toLocaleString() ?? "0"}
                </span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  L
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold leading-tight">
                  {stats.monthlyConsumption["gas"]?.toLocaleString() ?? "0"}
                </span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  m³
                </span>
              </div>
            </div>
          }
          icon={<TrendingUp size={24} />}
          trend={{
            value: 8,
            isPositive: true,
          }}
          color="blue"
        />
        <StatCard
          title="Active Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={<Users size={24} />}
          trend={{
            value: stats.totalCustomersTrend,
            isPositive: stats.totalCustomersTrend >= 0,
          }}
          color="blue"
        />
        <StatCard
          title="Defaulters"
          value={stats.defaultersCount.toLocaleString()}
          icon={<AlertTriangle size={24} />}
          trend={{
            value: 3,
            isPositive: false,
          }}
          color="red"
        />
      </div>

      <ActionBar />

      {children}
    </>
  );
}
