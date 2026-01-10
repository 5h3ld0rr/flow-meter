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
      "SELECT ISNULL(SUM(amount), 0) as total FROM Payments WHERE payment_date >= @start",
      { start: startOfMonth }
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
    monthlyRevenue: revenueRes.recordset[0].total,
    monthlyRevenueTrend: 12,
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
  const result = await query<{
    id: string;
    activity_type: string;
    description: string;
    customer: string;
    amount: number | null;
    time: Date;
  }>(
    `SELECT TOP (@limit) * FROM (
      -- Readings
      SELECT 
        CONCAT('reading_', r.id) as id,
        'reading' as activity_type,
        CONCAT('Reading: ', r.reading_value, ' (Meter: ', m.serial_number, ')') as description,
        c.name as customer,
        NULL as amount,
        r.reading_date as time
      FROM Readings r
      INNER JOIN Meters m ON r.meter_id = m.id
      INNER JOIN Customers c ON m.customer_id = c.id

      UNION ALL

      -- Payments
      SELECT 
        CONCAT('payment_', p.id) as id,
        'payment' as activity_type,
        'Payment Received' as description,
        c.name as customer,
        p.amount,
        p.payment_date as time
      FROM Payments p
      INNER JOIN Customers c ON p.customer_id = c.id
    ) AS combined_activity
    ORDER BY time DESC`,
    { limit }
  );

  return result.recordset.map((activity) => ({
    ...activity,
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
