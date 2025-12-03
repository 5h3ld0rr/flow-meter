import { query } from "@/lib/db";

export async function getRevenueReport(startDate?: Date, endDate?: Date) {
  try {
    let queryText = `
      SELECT 
        FORMAT(b.created_at, 'MMM yyyy') as month,
        SUM(b.total_amount) as revenue,
        50 as target
      FROM Bills b
      WHERE b.status = 'paid'
    `;

    const params: Record<string, Date> = {};

    if (startDate) {
      queryText += ` AND b.created_at >= @startDate`;
      params.startDate = startDate;
    }

    if (endDate) {
      queryText += ` AND b.created_at <= @endDate`;
      params.endDate = endDate;
    }

    queryText += ` GROUP BY FORMAT(b.created_at, 'MMM yyyy') ORDER BY month`;

    const result = await query<{
      month: string;
      revenue: number;
      target: number;
    }>(queryText, params);

    return result.recordset;
  } catch (error) {
    console.error("Error fetching revenue report:", error);
    return [];
  }
}

export async function getRegionalReport() {
  try {
    const result = await query<{
      region: string;
      customers: number;
      consumption: number;
      revenue: number;
    }>(
      `SELECT 
        SUBSTRING(c.address, CHARINDEX(',', c.address) + 1, LEN(c.address)) as region,
        COUNT(DISTINCT c.customer_id) as customers,
        COALESCE(SUM(r.consumption), 0) as consumption,
        COALESCE(SUM(b.total_amount), 0) as revenue
       FROM Customers c
       LEFT JOIN Meters m ON c.customer_id = m.customer_id
       LEFT JOIN Readings r ON m.meter_id = r.meter_id
       LEFT JOIN Bills b ON c.customer_id = b.customer_id AND b.status = 'paid'
       GROUP BY SUBSTRING(c.address, CHARINDEX(',', c.address) + 1, LEN(c.address))
       ORDER BY revenue DESC`
    );

    return result.recordset;
  } catch (error) {
    console.error("Error fetching regional report:", error);
    return [];
  }
}
