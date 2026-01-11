import { query } from "@/lib/db";

export async function getMeters(utilityType?: string, customerId?: string) {
  const result = await query<
    Meter & {
      customer_display_id: string;
      customer_name: string;
      last_reading_value: number | null;
      last_reading_date: Date | null;
    }
  >(
    `SELECT 
        m.*,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        (SELECT TOP 1 r.reading_value FROM Readings r WHERE r.meter_id = m.id ORDER BY r.reading_date DESC) as last_reading_value,
        (SELECT TOP 1 r.reading_date FROM Readings r WHERE r.meter_id = m.id ORDER BY r.reading_date DESC) as last_reading_date
    FROM Meters m
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE (@utilityType IS NULL OR m.utility_type = @utilityType)
      AND (@customerId IS NULL OR c.customer_id = @customerId)
    ORDER BY m.created_at DESC`,
    { utilityType: utilityType || null, customerId: customerId || null }
  );
  return result.recordset;
}

export async function getMeterById(id: string) {
  const result = await query<
    Meter & {
      customer_display_id: string;
      customer_name: string;
      customer_email: string;
      customer_type: string;
      last_reading_value: number | null;
      last_reading_date: Date | null;
    }
  >(
    `SELECT 
        m.*,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        c.email as customer_email,
        c.type as customer_type,
        (SELECT TOP 1 r.reading_value FROM Readings r WHERE r.meter_id = m.id ORDER BY r.reading_date DESC) as last_reading_value,
        (SELECT TOP 1 r.reading_date FROM Readings r WHERE r.meter_id = m.id ORDER BY r.reading_date DESC) as last_reading_date
    FROM Meters m
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE m.meter_id = @id`,
    { id }
  );
  return result.recordset[0] || null;
}

export async function checkSerialNumberExists(
  serialNumber: string
): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*) as count FROM Meters WHERE serial_number = @serialNumber`,
    { serialNumber }
  );
  return result.recordset[0].count > 0;
}

export async function getMeterCount(): Promise<number> {
  const result = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM Meters"
  );
  return result.recordset[0].count;
}

export async function getMeterLastReading(meterId: string) {
  const result = await query<{
    last_reading_value: number | null;
    last_reading_date: Date | null;
    customer_id: string;
  }>(
    `SELECT TOP 1
       r.reading_value as last_reading_value,
       r.reading_date as last_reading_date,
       c.customer_id
     FROM Meters m
     INNER JOIN Customers c ON m.customer_id = c.id
     LEFT JOIN Readings r ON r.meter_id = m.id
     WHERE m.meter_id = @meterId
     ORDER BY r.reading_date DESC`,
    { meterId }
  );

  if (!result.recordset.length) return null;

  return result.recordset[0];
}
export async function getMeterByInternalId(id: number) {
  const result = await query<
    Meter & {
      customer_display_id: string;
      customer_name: string;
      customer_email: string;
      last_reading_value: number | null;
      last_reading_date: Date | null;
    }
  >(
    `SELECT 
        m.*,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        c.email as customer_email,
        (SELECT TOP 1 r.reading_value FROM Readings r WHERE r.meter_id = m.id ORDER BY r.reading_date DESC) as last_reading_value,
        (SELECT TOP 1 r.reading_date FROM Readings r WHERE r.meter_id = m.id ORDER BY r.reading_date DESC) as last_reading_date
    FROM Meters m
    INNER JOIN Customers c ON m.customer_id = c.id
    WHERE m.id = @id`,
    { id }
  );
  return result.recordset[0] || null;
}
