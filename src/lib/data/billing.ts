import { query } from "@/lib/db";

export async function getBills(filters?: {
  customerId?: string;
  meterId?: string;
  status?: string;
}) {
  try {
    let queryText = `
      SELECT 
        b.bill_id,
        b.customer_id,
        c.name as customer_name,
        b.meter_id,
        m.serial_number as meter_serial,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.base_amount,
        b.tax_amount,
        b.total_amount,
        b.status,
        b.due_date,
        b.created_at
      FROM Bills b
      INNER JOIN Customers c ON b.customer_id = c.customer_id
      INNER JOIN Meters m ON b.meter_id = m.meter_id
      WHERE 1=1
    `;

    const params: Record<string, string> = {};

    if (filters?.customerId) {
      queryText += ` AND b.customer_id = @customerId`;
      params.customerId = filters.customerId;
    }

    if (filters?.meterId) {
      queryText += ` AND b.meter_id = @meterId`;
      params.meterId = filters.meterId;
    }

    if (filters?.status) {
      queryText += ` AND b.status = @status`;
      params.status = filters.status;
    }

    queryText += ` ORDER BY b.created_at DESC`;

    const result = await query<Bill & { customer_name: string }>(
      queryText,
      params
    );
    return result.recordset;
  } catch (error) {
    console.error("Error fetching bills:", error);
    return [];
  }
}

export async function getBillById(id: number) {
  try {
    const result = await query<Bill>(
      `SELECT 
        b.bill_id,
        b.customer_id,
        c.name as customer_name,
        b.meter_id,
        m.serial_number as meter_serial,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.base_amount,
        b.tax_amount,
        b.total_amount,
        b.status,
        b.due_date,
        b.created_at
      FROM Bills b
      INNER JOIN Customers c ON b.customer_id = c.customer_id
      INNER JOIN Meters m ON b.meter_id = m.meter_id
      WHERE b.bill_id = @id`,
      { id }
    );

    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching bill:", error);
    return null;
  }
}

export async function getMeterUtilityType(meterId: number) {
  try {
    const result = await query<{ utility_type: string }>(
      `SELECT utility_type FROM Meters WHERE id = @meterId`,
      { meterId }
    );
    return result.recordset[0]?.utility_type || null;
  } catch (error) {
    console.error("Error fetching meter utility type:", error);
    return null;
  }
}

export async function getTariffRate(utilityType: string): Promise<number> {
  try {
    const result = await query<{ rate_per_unit: number }>(
      `SELECT rate_per_unit FROM Tariffs WHERE utility_type = @utilityType`,
      { utilityType }
    );
    return result.recordset[0]?.rate_per_unit || 0.15; // Default rate
  } catch (error) {
    console.error("Error fetching tariff rate:", error);
    return 0.15; // Default fallback
  }
}

export async function getBillCount() {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Bills`
    );
    return result.recordset[0].count;
  } catch (error) {
    console.error("Error getting bill count:", error);
    return 0;
  }
}
