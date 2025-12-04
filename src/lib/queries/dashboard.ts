import { query } from "@/lib/db";
import { UTILITIES } from "@/constants";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const customerResult = await query<{
      total: number;
      last_month: number;
    }>(
      `SELECT 
        COUNT(*) as total,
        (SELECT COUNT(*) FROM Customers WHERE created_at >= DATEADD(MONTH, -1, GETDATE())) as last_month
       FROM Customers WHERE status = 'active'`
    );

    const totalCustomers = customerResult.recordset[0].total;
    const lastMonthCustomers = customerResult.recordset[0].last_month;
    const totalCustomersTrend =
      lastMonthCustomers > 0
        ? Math.round((lastMonthCustomers / totalCustomers) * 100)
        : 0;

    const meterResult = await query<{ total: number; last_month: number }>(
      `SELECT 
        COUNT(*) as total,
        (SELECT COUNT(*) FROM Meters WHERE created_at >= DATEADD(MONTH, -1, GETDATE())) as last_month
       FROM Meters WHERE status = 'active'`
    );

    const activeMeters = meterResult.recordset[0].total;
    const lastMonthMeters = meterResult.recordset[0].last_month;
    const activeMetersTrend =
      lastMonthMeters > 0
        ? Math.round((lastMonthMeters / activeMeters) * 100)
        : 0;

    const revenueResult = await query<{ total: number }>(
      `SELECT ISNULL(SUM(total_amount), 0) as total
       FROM Bills
       WHERE status = 'paid'
         AND MONTH(created_at) = MONTH(GETDATE())
         AND YEAR(created_at) = YEAR(GETDATE())`
    );

    const monthlyRevenue = revenueResult.recordset[0].total;
    const monthlyRevenueTrend = 12;

    const outstandingResult = await query<{ total: number }>(
      `SELECT ISNULL(SUM(total_amount), 0) as total
       FROM Bills
       WHERE status IN ('generated', 'sent', 'overdue')`
    );

    const outstandingAmount = outstandingResult.recordset[0].total;
    const outstandingTrend = 5;

    return {
      totalCustomers,
      totalCustomersTrend,
      activeMeters,
      activeMetersTrend,
      monthlyRevenue,
      monthlyRevenueTrend,
      outstandingAmount,
      outstandingTrend,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalCustomers: 0,
      totalCustomersTrend: 0,
      activeMeters: 0,
      activeMetersTrend: 0,
      monthlyRevenue: 0,
      monthlyRevenueTrend: 0,
      outstandingAmount: 0,
      outstandingTrend: 0,
    };
  }
};

export const getConsumptionTrend = async (
  days: number = 7
): Promise<ConsumptionData[]> => {
  try {
    const result = await query<{
      day: string;
      electricity: number;
      water: number;
      gas: number;
    }>(
      `SELECT 
        FORMAT(r.reading_date, 'ddd') as day,
        ISNULL(SUM(CASE WHEN m.utility_type = 'electricity' THEN r.consumption ELSE 0 END), 0) as electricity,
        ISNULL(SUM(CASE WHEN m.utility_type = 'water' THEN r.consumption ELSE 0 END), 0) as water,
        ISNULL(SUM(CASE WHEN m.utility_type = 'gas' THEN r.consumption ELSE 0 END), 0) as gas
       FROM Readings r
       INNER JOIN Meters m ON r.meter_id = m.meter_id
       WHERE r.reading_date >= DATEADD(YEAR, -2, GETDATE())
       GROUP BY CAST(r.reading_date AS DATE), FORMAT(r.reading_date, 'ddd')
       ORDER BY CAST(r.reading_date AS DATE)`,
      { days }
    );

    return result.recordset;
  } catch (error) {
    console.error("Error fetching consumption trend:", error);
    return [];
  }
};

export const getTopConsumers = async (
  limit: number = 5
): Promise<TopConsumer[]> => {
  try {
    const result = await query<{
      name: string;
      total_consumption: number;
      utility_type: string;
    }>(
      `SELECT TOP (@limit)
        c.name,
        SUM(r.consumption) as total_consumption,
        MAX(m.utility_type) as utility_type
       FROM Customers c
       INNER JOIN Meters m ON c.customer_id = m.customer_id
       INNER JOIN Readings r ON m.meter_id = r.meter_id
       WHERE r.reading_date >= DATEADD(YEAR, -2, GETDATE())
       GROUP BY c.customer_id, c.name
       ORDER BY total_consumption DESC`,
      { limit }
    );

    return result.recordset.map((row) => ({
      name: row.name,
      consumption: `${row.total_consumption.toLocaleString()} ${
        UTILITIES[row.utility_type as keyof typeof UTILITIES].unit
      }`,
      change: "+12%", // Placeholder
    }));
  } catch (error) {
    console.error("Error fetching top consumers:", error);
    return [];
  }
};

export const getRecentActivities = async (
  limit: number = 10
): Promise<RecentActivity[]> => {
  try {
    const result = await query<{
      id: number;
      activity_type: string;
      description: string;
      customer_name: string;
      amount: number | null;
      created_at: Date;
    }>(
      `SELECT TOP (@limit)
        a.id,
        a.activity_type,
        a.description,
        c.name as customer_name,
        a.amount,
        a.created_at
       FROM Activities a
       LEFT JOIN Customers c ON a.customer_id = c.customer_id
       ORDER BY a.created_at DESC`,
      { limit }
    );

    return result.recordset.map((row) => {
      const now = new Date();
      const diff = now.getTime() - new Date(row.created_at).getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let timeAgo: string;
      if (minutes < 60) {
        timeAgo = `${minutes} min ago`;
      } else if (hours < 24) {
        timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else {
        timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
      }

      return {
        id: row.id,
        customer: row.customer_name || "System",
        action: row.description,
        amount: row.amount ? `$${row.amount.toFixed(2)}` : undefined,
        value: row.amount ? undefined : "N/A",
        time: timeAgo,
        type: row.activity_type,
      };
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};

export const getUtilityDistribution = async (): Promise<
  UtilityDistribution[]
> => {
  try {
    const result = await query<{
      utility_type: string;
      count: number;
    }>(
      `SELECT 
        utility_type,
        COUNT(*) as count
       FROM Meters
       GROUP BY utility_type`
    );

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
  } catch (error) {
    console.error("Error fetching utility distribution:", error);
    return [];
  }
};
