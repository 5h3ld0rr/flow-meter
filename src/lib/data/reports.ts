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

export async function getConsumptionReport(startDate?: Date, endDate?: Date) {
  const result = await execute<{
    month: string;
    consumption: number;
    target: number;
  }>("sp_GetConsumptionReport", { startDate, endDate });
  return result.recordset;
}

export async function getCustomerReport(startDate?: Date, endDate?: Date) {
  const result = await execute<{
    month: string;
    customers: number;
    target: number;
  }>("sp_GetCustomerReport", { startDate, endDate });
  return result.recordset;
}

export async function getDefaultersReport() {
  const result = await execute<{
    region: string;
    defaulters: number;
    outstanding: number;
    bill_count: number;
  }>("sp_GetDefaultersReport");
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
