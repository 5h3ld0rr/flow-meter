import { execute, query } from "@/lib/db";

export async function getPayments(filters?: {
  customerId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const result = await query<
    Payment & { customer_name: string; bill_id: string }
  >(
    `SELECT 
        p.*,
        c.name as customer_name,
        b.bill_id
    FROM Payments p
    INNER JOIN Customers c ON p.customer_id = c.id
    INNER JOIN Bills b ON p.bill_id = b.id
    WHERE (@customerId IS NULL OR c.customer_id = @customerId)
      AND (@status IS NULL OR p.status = @status)
      AND (@startDate IS NULL OR p.payment_date >= @startDate)
      AND (@endDate IS NULL OR p.payment_date <= @endDate)
    ORDER BY p.payment_date DESC`,
    {
      customerId: filters?.customerId || null,
      status: filters?.status || null,
      startDate: filters?.startDate || null,
      endDate: filters?.endDate || null,
    }
  );
  return result.recordset;
}

export async function getPaymentById(
  id: number
): Promise<(Payment & { customer_name: string; bill_id: string }) | null> {
  const result = await query<
    Payment & { customer_name: string; bill_id: string }
  >(
    `SELECT 
        p.*,
        c.name as customer_name,
        b.bill_id
    FROM Payments p
    INNER JOIN Customers c ON p.customer_id = c.id
    LEFT JOIN Bills b ON p.bill_id = b.id
    WHERE p.id = @id`,
    { id }
  );
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
  // RETAINED: Complex aggregation over multiple results
  const result = await execute<any>("sp_GetPaymentStats");

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
  const result = await query<{
    bill_id: string;
    customer_id: string;
    total_amount: number;
    status: string;
  }>(
    `SELECT bill_id, customer_id, total_amount, status
     FROM Bills
     WHERE bill_id = @billId`,
    { billId }
  );
  return result.recordset[0] || null;
}

export async function getPaymentCount(): Promise<number> {
  const result = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM Payments"
  );
  return result.recordset[0].count;
}
