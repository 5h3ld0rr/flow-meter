import { execute, query } from "@/lib/db";
import { UTILITIES } from "@/constants";

// ... (existing imports)

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    customersRes,
    metersRes,
    revenueRes,
    outstandingRes,
    consumptionRes,
    defaultersRes,
  ] = await Promise.all([
    query<{ count: number }>("SELECT COUNT(*) as count FROM Customers"),
    query<{ count: number }>(
      "SELECT COUNT(*) as count FROM Meters WHERE status = 'active'"
    ),
    query<{ total: number }>(
      "SELECT ISNULL(SUM(amount), 0) as total FROM Payments"
    ),
    query<{ total: number }>(
      "SELECT ISNULL(SUM(balance), 0) as total FROM Customers WHERE balance > 0"
    ),
    query<{ utility_type: string; total: number }>(
      `SELECT m.utility_type, ISNULL(SUM(r.consumption), 0) as total
       FROM Readings r
       JOIN Meters m ON r.meter_id = m.id
       WHERE r.reading_date >= @start
       GROUP BY m.utility_type`,
      { start: startOfMonth }
    ),
    query<{ count: number }>("SELECT COUNT(*) as count FROM vw_DefaulterStats"),
  ]);

  const consumptionMap: Record<string, number> = {
    electricity: 0,
    water: 0,
    gas: 0,
  };

  consumptionRes.recordset.forEach((row) => {
    if (row.utility_type) {
      consumptionMap[row.utility_type.toLowerCase()] = row.total;
    }
  });

  return {
    totalCustomers: customersRes.recordset[0].count,
    totalCustomersTrend: 5,
    activeMeters: metersRes.recordset[0].count,
    activeMetersTrend: 2,
    totalRevenue: revenueRes.recordset[0].total,
    revenueTrend: 12,
    outstandingAmount: outstandingRes.recordset[0].total,
    outstandingTrend: 5,
    monthlyConsumption: consumptionMap,
    defaultersCount: defaultersRes.recordset[0].count,
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
  const result = await query<{
    name: string;
    utility_type: string;
    current_consumption: number;
    prev_consumption: number;
  }>(
    `WITH MonthlyStats AS (
      SELECT 
          c.id,
          c.name,
          MAX(m.utility_type) as utility_type,
          SUM(CASE 
              WHEN r.reading_date >= DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()), 0) 
              THEN r.consumption ELSE 0 END) as current_consumption,
          SUM(CASE 
              WHEN r.reading_date >= DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()) - 1, 0)
               AND r.reading_date < DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()), 0)
              THEN r.consumption ELSE 0 END) as prev_consumption
      FROM Customers c
      JOIN Meters m ON c.id = m.customer_id
      JOIN Readings r ON m.id = r.meter_id
      WHERE r.reading_date >= DATEADD(month, DATEDIFF(month, 0, GETUTCDATE()) - 1, 0)
      GROUP BY c.id, c.name
    )
    SELECT TOP (@limit)
      name,
      utility_type,
      current_consumption,
      prev_consumption
    FROM MonthlyStats
    ORDER BY current_consumption DESC`,
    { limit }
  );

  return result.recordset.map((row) => {
    let changePercent = 0;
    if (row.prev_consumption > 0) {
      changePercent =
        ((row.current_consumption - row.prev_consumption) /
          row.prev_consumption) *
        100;
    } else if (row.current_consumption > 0) {
      changePercent = 100;
    }

    const sign = changePercent > 0 ? "+" : "";

    return {
      name: row.name,
      consumption: `${row.current_consumption.toFixed(0)} ${
        UTILITIES[row.utility_type as keyof typeof UTILITIES]?.unit || "Units"
      }`,
      change: `${sign}${changePercent.toFixed(1)}%`,
    };
  });
}

export async function getRecentActivities(limit: number = 10) {
  const result = await query<{
    id: number;
    activity_type: string;
    description: string;
    customer: string;
    amount: number | null;
    time: Date;
  }>(
    `SELECT TOP (@limit)
      a.id,
      a.activity_type,
      a.description,
      c.name as customer,
      a.amount,
      a.created_at as time
     FROM Activities a
     LEFT JOIN Customers c ON a.customer_id = c.id
     ORDER BY a.created_at DESC`,
    { limit }
  );

  return result.recordset.map((activity) => ({
    ...activity,
    id: activity.id.toString(),
    time: new Date(activity.time).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
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
