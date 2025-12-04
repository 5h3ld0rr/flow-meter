import { query } from "@/lib/db";

export const getMeters = async (utilityType?: string, customerId?: string) => {
  try {
    let queryText = `
      SELECT m.meter_id, m.serial_number, m.customer_id, m.utility_type, 
             m.location, m.status, m.install_date, m.last_reading_value, 
             m.last_reading_date, m.created_at, m.updated_at,
             c.name as customer_name
      FROM Meters m
      INNER JOIN Customers c ON m.customer_id = c.customer_id
      WHERE 1=1
    `;

    const params: Record<string, string> = {};

    if (utilityType && utilityType !== "all") {
      queryText += ` AND m.utility_type = @utilityType`;
      params.utilityType = utilityType.toLowerCase();
    }

    if (customerId) {
      queryText += ` AND m.customer_id = @customerId`;
      params.customerId = customerId;
    }

    queryText += ` ORDER BY m.created_at DESC`;

    const result = await query<Meter & { customer_name: string }>(
      queryText,
      params
    );
    return result.recordset;
  } catch (error) {
    console.log("Error fetching meters:", error);
    return [];
  }
};

export const getMeterById = async (id: string) => {
  try {
    const result = await query<
      Meter & { customer_name: string; customer_email: string }
    >(
      `SELECT m.*, c.name as customer_name, c.email as customer_email
       FROM Meters m
       INNER JOIN Customers c ON m.customer_id = c.customer_id
       WHERE m.meter_id = @id`,
      { id }
    );

    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching meter:", error);
    return null;
  }
};

export const checkSerialNumberExists = async (
  serialNumber: string
): Promise<boolean> => {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Meters WHERE serial_number = @serialNumber`,
      { serialNumber }
    );
    return result.recordset[0].count > 0;
  } catch (error) {
    console.error("Error checking serial number:", error);
    return false;
  }
};

export const getMeterCount = async (): Promise<number> => {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Meters`
    );
    return result.recordset[0].count;
  } catch (error) {
    console.error("Error getting meter count:", error);
    return 0;
  }
};

export const getMeterLastReading = async (meterId: string) => {
  try {
    const result = await query<{
      last_reading_value: number | null;
      customer_id: string;
    }>(
      `SELECT last_reading_value, customer_id FROM Meters WHERE meter_id = @meterId`,
      { meterId }
    );
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching meter last reading:", error);
    return null;
  }
};
