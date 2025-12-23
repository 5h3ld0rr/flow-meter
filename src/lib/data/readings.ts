import { execute } from "@/lib/db";

// Data Layer - READ operations for pages

export async function getReadings(filters?: {
  meterId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Reading[]> {
  const result = await execute<
    Reading & {
      meter_serial: string;
      utility_type: string;
      customer_name: string;
    }
  >("sp_GetReadings", filters);
  return result.recordset;
}
