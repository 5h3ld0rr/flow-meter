import { query } from "@/lib/db";

export async function getMeters(utilityType?: string, customerId?: string) {
  const result = await query<
    Meter & { customer_display_id: string; customer_name: string }
  >(
    `SELECT 
        m.*,
        c.customer_id as customer_display_id,
        c.name as customer_name
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
    }
  >(
    `SELECT 
        m.*,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        c.email as customer_email
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
    customer_id: string;
  }>(
    `SELECT m.last_reading_value, c.customer_id
     FROM Meters m
     INNER JOIN Customers c ON m.customer_id = c.id
     WHERE m.meter_id = @meterId`,
    { meterId }
  );
  return result.recordset[0] || null;
}
