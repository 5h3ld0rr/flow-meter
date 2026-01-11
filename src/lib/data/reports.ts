import { query } from "@/lib/db";

// Data Layer - READ operations for pages

export async function getRevenueReport(startDate?: Date, endDate?: Date) {
  // Default to last 10 years if not provided (keeping existing logic)
  const end = endDate || new Date();
  const start =
    startDate ||
    new Date(new Date().setFullYear(new Date().getFullYear() - 10));

  const result = await query<{
    month: string;
    revenue: number;
    target: number;
  }>(
    `
    WITH MonthlyData AS (
      SELECT 
        FORMAT(payment_date, 'MMM yyyy') as month_label,
        YEAR(payment_date) as y,
        MONTH(payment_date) as m,
        SUM(amount) as revenue
      FROM Payments
      WHERE payment_date >= @start AND payment_date <= @end
      GROUP BY FORMAT(payment_date, 'MMM yyyy'), YEAR(payment_date), MONTH(payment_date)
    )
    SELECT 
      month_label as month,
      revenue,
      ISNULL(CAST(AVG(revenue) OVER () AS INT), 0) as target
    FROM MonthlyData
    ORDER BY y, m
    `,
    { start, end }
  );
  return result.recordset;
}

export async function getConsumptionReport(startDate?: Date, endDate?: Date) {
  const end = endDate || new Date();
  const start =
    startDate ||
    new Date(new Date().setFullYear(new Date().getFullYear() - 10));

  const result = await query<{
    month: string;
    consumption: number;
    target: number;
  }>(
    `
    WITH MonthlyData AS (
      SELECT 
        FORMAT(reading_date, 'MMM yyyy') as month_label,
        YEAR(reading_date) as y,
        MONTH(reading_date) as m,
        SUM(consumption) as consumption
      FROM Readings
      WHERE reading_date >= @start AND reading_date <= @end
      GROUP BY FORMAT(reading_date, 'MMM yyyy'), YEAR(reading_date), MONTH(reading_date)
    )
    SELECT 
      month_label as month,
      consumption,
      ISNULL(CAST(AVG(consumption) OVER () AS INT), 0) as target
    FROM MonthlyData
    ORDER BY y, m
    `,
    { start, end }
  );
  return result.recordset;
}

export async function getCustomerReport(startDate?: Date, endDate?: Date) {
  const end = endDate || new Date();
  const start =
    startDate ||
    new Date(new Date().setFullYear(new Date().getFullYear() - 10));

  const result = await query<{
    month: string;
    customers: number;
    target: number;
  }>(
    `
    WITH MonthlyData AS (
      SELECT 
        FORMAT(created_at, 'MMM yyyy') as month_label,
        YEAR(created_at) as y,
        MONTH(created_at) as m,
        COUNT(id) as customers
      FROM Customers
      WHERE created_at >= @start AND created_at <= @end
      GROUP BY FORMAT(created_at, 'MMM yyyy'), YEAR(created_at), MONTH(created_at)
    )
    SELECT 
      month_label as month,
      customers,
      ISNULL(CAST(AVG(customers) OVER () AS INT), 0) as target
    FROM MonthlyData
    ORDER BY y, m
    `,
    { start, end }
  );
  return result.recordset;
}

export async function getDefaultersReport() {
  const result = await query<{
    customer_id: string;
    name: string;
    defaulters: number;
    outstanding: number;
    bill_count: number;
  }>(`
    SELECT * FROM vw_DefaulterStats ORDER BY outstanding DESC
  `);
  return result.recordset;
}

export async function getRevenueByUtilityType(): Promise<
  {
    utility_type: string;
    customers: number;
    consumption: number;
    revenue: number;
    growth: number;
  }[]
> {
  const now = new Date();
  // Format as YYYY-MM
  const currentMonthStr = now.toISOString().slice(0, 7); // e.g., 2026-01
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevMonthDate.toISOString().slice(0, 7); // e.g., 2025-12

  const result = await query<{
    utility_type: string;
    customers: number;
    consumption: number;
    revenue: number;
    revenue_prev: number;
  }>(
    `
    SELECT 
      COALESCE(curr.utility_type, prev.utility_type) as utility_type,
      (SELECT customers FROM vw_UtilityPerformance WHERE utility_type = COALESCE(curr.utility_type, prev.utility_type)) as customers,
      ISNULL(curr.consumption, 0) as consumption,
      ISNULL(curr.revenue, 0) as revenue,
      ISNULL(prev.revenue, 0) as revenue_prev
    FROM (SELECT * FROM vw_MonthlyUtilityStats WHERE month_str = @currentMonth) curr
    FULL OUTER JOIN (SELECT * FROM vw_MonthlyUtilityStats WHERE month_str = @prevMonth) prev 
      ON curr.utility_type = prev.utility_type
    `,
    { currentMonth: currentMonthStr, prevMonth: prevMonthStr }
  );

  return result.recordset.map((row) => {
    let growth = 0;
    if (row.revenue_prev > 0) {
      growth = ((row.revenue - row.revenue_prev) / row.revenue_prev) * 100;
    } else if (row.revenue > 0) {
      growth = 100;
    }

    return {
      utility_type: row.utility_type || "Unknown",
      customers: row.customers || 0,
      consumption: row.consumption || 0,
      revenue: row.revenue || 0,
      growth: Number(growth.toFixed(2)),
    };
  });
}
