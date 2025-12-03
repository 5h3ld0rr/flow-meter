import { query } from "@/lib/db";

export async function getReadings(filters?: {
  meterId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Reading[]> {
  try {
    let queryText = `
      SELECT r.id, r.meter_id, r.reading_value, r.reading_date, r.consumption, 
             r.status, r.notes, r.created_by, r.created_at,
             m.serial_number as meter_serial, m.utility_type,
             c.name as customer_name
      FROM Readings r
      INNER JOIN Meters m ON r.meter_id = m.meter_id
      INNER JOIN Customers c ON m.customer_id = c.customer_id
      WHERE 1=1
    `;

    const params: Record<string, string | Date> = {};

    if (filters?.meterId) {
      queryText += ` AND r.meter_id = @meterId`;
      params.meterId = filters.meterId;
    }

    if (filters?.startDate) {
      queryText += ` AND r.reading_date >= @startDate`;
      params.startDate = filters.startDate;
    }

    if (filters?.endDate) {
      queryText += ` AND r.reading_date <= @endDate`;
      params.endDate = filters.endDate;
    }

    queryText += ` ORDER BY r.reading_date DESC`;

    const result = await query<
      Reading & {
        meter_serial: string;
        utility_type: string;
        customer_name: string;
      }
    >(queryText, params);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching readings:", error);
    return [];
  }
}
