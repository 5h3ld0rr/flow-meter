import { Header } from "@/components/layout";
import { StatCard } from "@/components/charts";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/lib/queries/dashboard";
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
          value={`$${(stats.monthlyRevenue / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          trend={{
            value: stats.monthlyRevenueTrend,
            isPositive: stats.monthlyRevenueTrend >= 0,
          }}
          color="green"
        />
        <StatCard
          title="Total Consumption"
          value="245K kWh"
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
          value="127"
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
