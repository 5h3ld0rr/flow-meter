import { execute } from "@/lib/db";
import { UTILITIES } from "@/constants";

export async function getDashboardStats() {
  const result = await execute<{ total: number; last_month: number }>(
    "sp_GetDashboardStats"
  );

  const customerData = result.recordsets[0][0];
  const meterData = result.recordsets[1][0];
  const revenueData = result.recordsets[2][0];
  const outstandingData = result.recordsets[3][0];

  const totalCustomersTrend =
    customerData.last_month > 0
      ? Math.round((customerData.last_month / customerData.total) * 100)
      : 0;

  const activeMetersTrend =
    meterData.last_month > 0
      ? Math.round((meterData.last_month / meterData.total) * 100)
      : 0;

  return {
    totalCustomers: customerData.total,
    totalCustomersTrend,
    activeMeters: meterData.total,
    activeMetersTrend,
    monthlyRevenue: revenueData.total,
    monthlyRevenueTrend: 12,
    outstandingAmount: outstandingData.total,
    outstandingTrend: 5,
  };
}

export async function getConsumptionTrend(
  days: number = 7
): Promise<ConsumptionData[]> {
  const result = await execute<{
    day: string;
    electricity: number;
    water: number;
    gas: number;
  }>("sp_GetConsumptionTrend", { days });
  return result.recordset;
}

export async function getTopConsumers(
  limit: number = 5
): Promise<TopConsumer[]> {
  const result = await execute<{
    name: string;
    total_consumption: number;
    utility_type: string;
  }>("sp_GetTopConsumers", { limit });

  return result.recordset.map((row) => ({
    name: row.name,
    consumption: `${row.total_consumption.toString()} ${
      UTILITIES[row.utility_type as keyof typeof UTILITIES].unit
    }`,
    change: "+12%",
  }));
}

export async function getRecentActivities(limit: number = 10) {
  const result = await execute<{
    id: number;
    activity_type: string;
    description: string;
    customer: string;
    amount: number | null;
    time: string;
  }>("sp_GetRecentActivities", { limit });

  return result.recordset;
}

export async function getUtilityDistribution() {
  const result = await execute<{
    utility_type: string;
    count: number;
  }>("sp_GetUtilityDistribution");

  // Business logic: Calculate percentages
  const total = result.recordset.reduce((sum, row) => sum + row.count, 0);

  return result.recordset.map((row) => {
    const utilityKey = row.utility_type as keyof typeof UTILITIES;
    const util = UTILITIES[utilityKey] || {
      name: row.utility_type,
      color: "#ccc",
    };

    return {
      name: util.name,
      value: total > 0 ? Math.round((row.count / total) * 100) : 0,
      color: util.color,
    };
  });
}
