import { execute } from "@/lib/db";

// Data Layer - READ operations for pages

export async function getPayments(filters?: {
  customerId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const result = await execute<
    Payment & { customer_name: string; bill_id: string }
  >("sp_GetPayments", filters);
  return result.recordset;
}

export async function getPaymentById(
  id: number
): Promise<(Payment & { customer_name: string; bill_id: string }) | null> {
  const result = await execute<
    Payment & { customer_name: string; bill_id: string }
  >("sp_GetPaymentById", { id });
  return result.recordset[0] || null;
}

export async function getPaymentStats(): Promise<{
  todayCollection: number;
  todayTrend: number;
  monthlyCollection: number;
  monthlyTarget: number;
  monthlyPercentage: number;
  pendingAmount: number;
  pendingCount: number;
}> {
  const result = await execute<any>("sp_GetPaymentStats");

  // Business logic: Calculate trends and percentages
  // Business logic: Calculate trends and percentages
  const datasets = result.recordsets as any[][];
  const todayData = datasets[0][0];
  const monthlyData = datasets[1][0];
  const pendingData = datasets[2][0];

  const todayTrend =
    todayData.yesterday > 0
      ? Math.round(
          ((todayData.today - todayData.yesterday) / todayData.yesterday) * 100
        )
      : 0;

  const monthlyTarget = 58000;
  const monthlyPercentage = Math.round(
    (monthlyData.total / monthlyTarget) * 100
  );

  return {
    todayCollection: todayData.today,
    todayTrend,
    monthlyCollection: monthlyData.total,
    monthlyTarget,
    monthlyPercentage,
    pendingAmount: pendingData.amount,
    pendingCount: pendingData.count,
  };
}

export async function getBillForPayment(billId: string) {
  const result = await execute<{
    bill_id: string;
    customer_id: string;
    total_amount: number;
    status: string;
  }>("sp_GetBillForPayment", { billId });
  return result.recordset[0] || null;
}

export async function getPaymentCount(): Promise<number> {
  const result = await execute<{ count: number }>("sp_GetPaymentCount");
  return result.recordset[0].count;
}
