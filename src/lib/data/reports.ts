import { query } from "@/lib/db";

// Data Layer - READ operations for pages

export async function getRevenueReport(startDate?: Date, endDate?: Date) {
  // Default to last 10 years if not provided
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
    SELECT 
      FORMAT(payment_date, 'MMM yyyy') as month,
      SUM(amount) as revenue,
      50000 as target -- Static target for now
    FROM Payments
    WHERE payment_date >= @start AND payment_date <= @end
    GROUP BY FORMAT(payment_date, 'MMM yyyy'), YEAR(payment_date), MONTH(payment_date)
    ORDER BY YEAR(payment_date), MONTH(payment_date)
    `,
    { start, end }
  );
  return result.recordset;
}

export async function getConsumptionReport(startDate?: Date, endDate?: Date) {
  const end = endDate || new Date();
  const start =
    startDate || new Date(new Date().setMonth(new Date().getMonth() - 6));

  const result = await query<{
    month: string;
    consumption: number;
    target: number;
  }>(
    `
    SELECT 
      FORMAT(reading_date, 'MMM yyyy') as month,
      SUM(consumption) as consumption,
      40000 as target -- Static target
    FROM Readings
    WHERE reading_date >= @start AND reading_date <= @end
    GROUP BY FORMAT(reading_date, 'MMM yyyy'), YEAR(reading_date), MONTH(reading_date)
    ORDER BY YEAR(reading_date), MONTH(reading_date)
    `,
    { start, end }
  );
  return result.recordset;
}

export async function getCustomerReport(startDate?: Date, endDate?: Date) {
  const end = endDate || new Date();
  const start =
    startDate || new Date(new Date().setMonth(new Date().getMonth() - 6));

  const result = await query<{
    month: string;
    customers: number;
    target: number;
  }>(
    `
    SELECT 
      FORMAT(created_at, 'MMM yyyy') as month,
      COUNT(id) as customers,
      20 as target
    FROM Customers
    WHERE created_at >= @start AND created_at <= @end
    GROUP BY FORMAT(created_at, 'MMM yyyy'), YEAR(created_at), MONTH(created_at)
    ORDER BY YEAR(created_at), MONTH(created_at)
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

export async function getRevenueByUtilityType() {
  const result = await query<{
    utility_type: string;
    customers: number;
    consumption: number;
    revenue: number;
  }>(`
    SELECT * FROM vw_UtilityPerformance
  `);
  return result.recordset;
}
