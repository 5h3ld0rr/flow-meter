import { execute } from "@/lib/db";

// Data Layer - READ operations for pages

export async function getBills(filters?: {
  customerId?: string;
  meterId?: string;
  status?: string;
}) {
  const result = await execute<Bill & { customer_name: string }>(
    "sp_GetBills",
    filters
  );
  return result.recordset;
}

export async function getBillById(id: number) {
  const result = await execute<Bill>("sp_GetBillById", { id });
  return result.recordset[0] || null;
}

// Helper functions for billing calculations
export async function getMeterUtilityType(meterId: number) {
  const result = await execute<{ utility_type: string }>(
    "sp_GetMeterUtilityType",
    { meterId }
  );
  return result.recordset[0]?.utility_type || null;
}

export async function getTariffRate(utilityType: string): Promise<number> {
  const result = await execute<{ rate_per_unit: number }>("sp_GetTariffRate", {
    utilityType,
  });
  return result.recordset[0]?.rate_per_unit || 0.15;
}

export async function getBillCount() {
  const result = await execute<{ count: number }>("sp_GetBillCount");
  return result.recordset[0].count;
}
