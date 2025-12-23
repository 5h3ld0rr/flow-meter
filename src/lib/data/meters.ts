import { execute } from "@/lib/db";

// Data Layer - READ operations with business logic
// Used by pages/components for displaying data

export async function getMeters(utilityType?: string, customerId?: string) {
  const result = await execute<Meter & { customer_name: string }>(
    "sp_GetMeters",
    { utilityType, customerId }
  );
  return result.recordset;
}

export async function getMeterById(id: string) {
  const result = await execute<
    Meter & { customer_name: string; customer_email: string }
  >("sp_GetMeterById", { id });
  return result.recordset[0] || null;
}

// Helper functions for validation (used by actions)
export async function checkSerialNumberExists(
  serialNumber: string
): Promise<boolean> {
  const result = await execute<{ count: number }>(
    "sp_CheckSerialNumberExists",
    { serialNumber }
  );
  return result.recordset[0].count > 0;
}

export async function getMeterCount(): Promise<number> {
  const result = await execute<{ count: number }>("sp_GetMeterCount");
  return result.recordset[0].count;
}

export async function getMeterLastReading(meterId: string) {
  const result = await execute<{
    last_reading_value: number | null;
    customer_id: string;
  }>("sp_GetMeterLastReading", { meterId });
  return result.recordset[0] || null;
}
