import { query } from "@/lib/db";

export async function getReadings(
  filters?: {
    meterId?: string;
    startDate?: Date;
    endDate?: Date;
  },
  limit?: number
): Promise<
  (Reading & {
    meter_serial: string;
    utility_type: string;
    customer_name: string;
  })[]
> {
  const result = await query<
    Reading & {
      meter_serial: string;
      utility_type: string;
      customer_name: string;
    }
  >(
    `SELECT 
    ${limit ? `TOP ${limit}` : ""}
        r.*,
        m.serial_number as meter_serial,
        m.utility_type,
        c.name as customer_name
    FROM Readings r
    INNER JOIN Meters m ON r.meter_id = m.id
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE (@meterId IS NULL OR m.meter_id = @meterId)
      AND (@startDate IS NULL OR r.reading_date >= @startDate)
      AND (@endDate IS NULL OR r.reading_date <= @endDate)
    ORDER BY r.reading_date DESC`,
    {
      meterId: filters?.meterId || null,
      startDate: filters?.startDate || null,
      endDate: filters?.endDate || null,
    }
  );
  return result.recordset;
}
