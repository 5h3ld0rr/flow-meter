import { query } from "@/lib/db";

export async function getBills(filters?: {
  customerId?: string;
  meterId?: string;
  status?: string;
}) {
  const result = await query<Bill & { customer_name: string }>(
    `SELECT 
        b.id,
        b.bill_id,
        b.customer_id,
        c.customer_id as customer_display_id,
        c.name as customer_name,
        b.meter_id,
        m.meter_id as meter_display_id,
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
    INNER JOIN Customers c ON b.customer_id = c.id
    INNER JOIN Meters m ON b.meter_id = m.id
    WHERE (@customerId IS NULL OR c.customer_id = @customerId)
      AND (@meterId IS NULL OR m.meter_id = @meterId)
      AND (@status IS NULL OR b.status = @status)
    ORDER BY b.created_at DESC`,
    {
      customerId: filters?.customerId || null,
      meterId: filters?.meterId || null,
      status: filters?.status || null,
    }
  );
  return result.recordset;
}

export async function getBillById(id: number) {
  const result = await query<Bill>(
    `SELECT b.*, c.customer_id as customer_display_id, c.name as customer_name,
            m.meter_id as meter_display_id, m.serial_number as meter_serial
     FROM Bills b
     INNER JOIN Customers c ON b.customer_id = c.id
     INNER JOIN Meters m ON b.meter_id = m.id
     WHERE b.id = @id`,
    { id }
  );
  return result.recordset[0] || null;
}

export async function getMeterUtilityType(meterId: number) {
  const result = await query<{ utility_type: string }>(
    "SELECT utility_type FROM Meters WHERE id = @meterId",
    { meterId }
  );
  return result.recordset[0]?.utility_type || null;
}

export async function getTariffRate(
  utilityType: string,
  customerType: string = "household"
): Promise<number> {
  const result = await query<{ rate_per_unit: number }>(
    `SELECT TOP 1 rate_per_unit 
     FROM Tariffs 
     WHERE utility_type = @utilityType 
       AND customer_type = @customerType
     ORDER BY effective_from DESC`,
    { utilityType, customerType }
  );
  return result.recordset[0]?.rate_per_unit || 0.15;
}

export async function getBillCount() {
  const result = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM Bills"
  );
  return result.recordset[0].count;
}

export async function getAllTariffs() {
  const result = await query<Tariff>("SELECT * FROM Tariffs");
  return result.recordset;
}

export async function addTariffRate(
  utilityType: string,
  rate: number,
  customerType: string = "household"
) {
  // Check if current rate is different to avoid spamming
  const currentRate = await getTariffRate(utilityType, customerType);
  if (currentRate === rate) return; // No change needed

  await query(
    `INSERT INTO Tariffs (utility_type, customer_type, rate_per_unit, effective_from)
     VALUES (@utilityType, @customerType, @rate, GETDATE())`,
    { utilityType, customerType, rate }
  );
}
