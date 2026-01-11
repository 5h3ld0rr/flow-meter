import { query } from "@/lib/db";

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
  monthlyCollection: number; // This month
  monthlyTarget: number; // Last month (as target)
  monthlyPercentage: number;
  pendingAmount: number;
  pendingCount: number;
}> {
  // 1. Today and Yesterday
  const dailyStats = await query<{
    today_amount: number;
    yesterday_amount: number;
  }>(`
    SELECT
      (SELECT ISNULL(SUM(amount), 0) FROM Payments WHERE CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE)) as today_amount,
      (SELECT ISNULL(SUM(amount), 0) FROM Payments WHERE CAST(payment_date AS DATE) = CAST(GETDATE() - 1 AS DATE)) as yesterday_amount
  `);

  const { today_amount, yesterday_amount } = dailyStats.recordset[0];
  const todayTrend =
    yesterday_amount > 0
      ? Math.round(((today_amount - yesterday_amount) / yesterday_amount) * 100)
      : 0;

  // 2. This Month and Last Month
  const monthlyStats = await query<{
    this_month_amount: number;
    last_month_amount: number;
  }>(`
    SELECT
      (SELECT ISNULL(SUM(amount), 0) FROM Payments 
       WHERE MONTH(payment_date) = MONTH(GETDATE()) AND YEAR(payment_date) = YEAR(GETDATE())) as this_month_amount,
      (SELECT ISNULL(SUM(amount), 0) FROM Payments 
       WHERE MONTH(payment_date) = MONTH(DATEADD(month, -1, GETDATE())) AND YEAR(payment_date) = YEAR(DATEADD(month, -1, GETDATE()))) as last_month_amount
  `);

  const { this_month_amount, last_month_amount } = monthlyStats.recordset[0];
  const monthlyTarget = last_month_amount > 0 ? last_month_amount : 1000; // Fallback if no data
  const monthlyPercentage = Math.round(
    (this_month_amount / monthlyTarget) * 100
  );

  // 3. Pending (Unpaid Bills)
  const pendingStats = await query<{
    pending_amount: number;
    pending_count: number;
  }>(`
    SELECT 
      ISNULL(SUM(total_amount), 0) as pending_amount,
      COUNT(id) as pending_count
    FROM Bills
    WHERE status IN ('generated', 'sent', 'overdue')
  `);

  const { pending_amount, pending_count } = pendingStats.recordset[0];

  return {
    todayCollection: today_amount,
    todayTrend,
    monthlyCollection: this_month_amount,
    monthlyTarget,
    monthlyPercentage,
    pendingAmount: pending_amount,
    pendingCount: pending_count,
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
