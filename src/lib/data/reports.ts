import { execute } from "@/lib/db";

// Data Layer - READ operations for pages

export async function getRevenueReport(startDate?: Date, endDate?: Date) {
  const result = await execute<{
    month: string;
    revenue: number;
    target: number;
  }>("sp_GetRevenueReport", { startDate, endDate });
  return result.recordset;
}

export async function getRegionalReport() {
  const result = await execute<{
    region: string;
    customers: number;
    consumption: number;
    revenue: number;
  }>("sp_GetRegionalReport");
  return result.recordset;
}
