import { execute, query } from "@/lib/db";
import { UTILITIES } from "@/constants";

// ... (existing imports)

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  /*
    Indices:
    0: customersTotal
    1: customersPrevTotal
    2: metersActive
    3: revenueCurr
    4: revenuePrev
    5: outstandingSnapshot
    6: outstandingNewCurr
    7: outstandingNewPrev
    8: consumptionCurrBreakdown
    9: consumptionPrevTotal
    10: defaultersSnapshot
    11: defaultersNewCurr
    12: defaultersNewPrev
  */
  const results = await Promise.all([
    // 0: Customers (Total)
    query<{ count: number }>("SELECT COUNT(*) as count FROM Customers"),
    // 1: Customers (Total as of start of this month)
    query<{ count: number }>(
      "SELECT COUNT(*) as count FROM Customers WHERE created_at < @start",
      { start: startOfMonth }
    ),

    // 2: Active Meters
    query<{ count: number }>(
      "SELECT COUNT(*) as count FROM Meters WHERE status = 'active'"
    ),

    // 3: Revenue (Current Month)
    query<{ total: number }>(
      "SELECT ISNULL(SUM(amount), 0) as total FROM Payments WHERE payment_date >= @start",
      { start: startOfMonth }
    ),
    // 4: Revenue (Previous Month)
    query<{ total: number }>(
      "SELECT ISNULL(SUM(amount), 0) as total FROM Payments WHERE payment_date >= @start AND payment_date < @end",
      { start: startOfLastMonth, end: startOfMonth }
    ),

    // 5: Outstanding (Current snapshot)
    query<{ total: number }>(
      "SELECT ISNULL(SUM(balance), 0) as total FROM Customers WHERE balance > 0"
    ),
    // 6: Outstanding Trend Proxy (New Overdue Debt this month)
    query<{ total: number }>(
      "SELECT ISNULL(SUM(total_amount), 0) as total FROM Bills WHERE status = 'overdue' AND due_date >= @start",
      { start: startOfMonth }
    ),
    // 7: Outstanding Trend Proxy (New Overdue Debt last month)
    query<{ total: number }>(
      "SELECT ISNULL(SUM(total_amount), 0) as total FROM Bills WHERE status = 'overdue' AND due_date >= @start AND due_date < @end",
      { start: startOfLastMonth, end: startOfMonth }
    ),

    // 8: Consumption (Current Month Breakdown)
    query<{ utility_type: string; total: number }>(
      `SELECT m.utility_type, ISNULL(SUM(r.consumption), 0) as total
       FROM Readings r
       JOIN Meters m ON r.meter_id = m.id
       WHERE r.reading_date >= @start
       GROUP BY m.utility_type`,
      { start: startOfMonth }
    ),
    // 9: Consumption (Previous Month Total)
    query<{ total: number }>(
      "SELECT ISNULL(SUM(consumption), 0) as total FROM Readings WHERE reading_date >= @start AND reading_date < @end",
      { start: startOfLastMonth, end: startOfMonth }
    ),

    // 10: Defaulters (Current snapshot)
    query<{ count: number }>("SELECT COUNT(*) as count FROM vw_DefaulterStats"),
    // 11: Defaulters Trend Proxy (New Overdue Bills Count this month)
    query<{ count: number }>(
      "SELECT COUNT(*) as count FROM Bills WHERE status = 'overdue' AND due_date >= @start",
      { start: startOfMonth }
    ),
    // 12: Defaulters Trend Proxy (New Overdue Bills Count last month)
    query<{ count: number }>(
      "SELECT COUNT(*) as count FROM Bills WHERE status = 'overdue' AND due_date >= @start AND due_date < @end",
      { start: startOfLastMonth, end: startOfMonth }
    ),
  ]);

  const consumptionMap: Record<string, number> = {
    electricity: 0,
    water: 0,
    gas: 0,
  };

  let totalConsumptionCurrent = 0;
  // Index 8 is consumptionCurrBreakdown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (results[8] as any).recordset.forEach((row: any) => {
    if (row.utility_type) {
      consumptionMap[row.utility_type.toLowerCase()] = row.total;
      totalConsumptionCurrent += row.total;
    }
  });

  // Calculate Trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const trend = ((current - previous) / previous) * 100;
    return Number(trend.toFixed(2));
  };

  // Extract values using indices
  const getResult = (index: number, field: string = "count") =>
    (results[index] as any).recordset[0][field];

  const customersCurrent = getResult(0);
  const customersPrev = getResult(1);

  const revenueCurrent = getResult(3, "total");
  const revenuePrev = getResult(4, "total");

  const consumptionPrev = getResult(9, "total");

  const outstandingSnapshot = getResult(5, "total");
  const outstandingNewCurr = getResult(6, "total");
  const outstandingNewPrev = getResult(7, "total");

  const defaultersSnapshot = getResult(10);
  const defaultersNewCurr = getResult(11);
  const defaultersNewPrev = getResult(12);

  return {
    totalCustomers: customersCurrent,
    totalCustomersTrend: calculateTrend(customersCurrent, customersPrev),
    activeMeters: getResult(2),
    activeMetersTrend: 2,
    totalRevenue: revenueCurrent,
    revenueTrend: calculateTrend(revenueCurrent, revenuePrev),
    outstandingAmount: outstandingSnapshot,
    outstandingTrend: calculateTrend(outstandingNewCurr, outstandingNewPrev),
    monthlyConsumption: consumptionMap,
    consumptionTrend: calculateTrend(totalConsumptionCurrent, consumptionPrev),
    defaultersCount: defaultersSnapshot,
    defaultersTrend: calculateTrend(defaultersNewCurr, defaultersNewPrev),
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
      change: `${sign}${changePercent.toFixed(2)}%`,
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
