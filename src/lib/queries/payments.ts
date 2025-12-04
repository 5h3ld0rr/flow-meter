import { query } from "@/lib/db";

export const getPayments = async (filters?: {
  customerId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  try {
    let queryText = `
      SELECT p.payment_id, p.payment_date, p.amount, p.payment_method, p.transaction_reference, p.status, c.name as customer_name, b.bill_id
      FROM Payments p
      INNER JOIN Customers c ON p.customer_id = c.customer_id
      INNER JOIN Bills b ON p.bill_id = b.bill_id
      WHERE 1=1
    `;

    const params: Record<string, number | string | Date> = {};

    if (filters?.customerId) {
      queryText += ` AND p.customer_id = @customerId`;
      params.customerId = filters.customerId;
    }

    if (filters?.status) {
      queryText += ` AND p.status = @status`;
      params.status = filters.status;
    }

    if (filters?.startDate) {
      queryText += ` AND p.payment_date >= @startDate`;
      params.startDate = filters.startDate;
    }

    if (filters?.endDate) {
      queryText += ` AND p.payment_date <= @endDate`;
      params.endDate = filters.endDate;
    }

    queryText += ` ORDER BY p.payment_date DESC`;

    const result = await query<
      Payment & { customer_name: string; bill_id: string }
    >(queryText, params);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};

export const getPaymentById = async (
  id: number
): Promise<(Payment & { customer_name: string; bill_id: string }) | null> => {
  try {
    const result = await query<
      Payment & { customer_name: string; bill_id: string }
    >(
      `SELECT p.*, c.name as customer_name, b.bill_id
       FROM Payments p
       INNER JOIN Customers c ON p.customer_id = c.customer_id
       INNER JOIN Bills b ON p.bill_id = b.bill_id
       WHERE p.payment_id = @id`,
      { id }
    );

    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return null;
  }
};

export const getPaymentStats = async (): Promise<{
  todayCollection: number;
  todayTrend: number;
  monthlyCollection: number;
  monthlyTarget: number;
  monthlyPercentage: number;
  pendingAmount: number;
  pendingCount: number;
}> => {
  try {
    const todayResult = await query<{ today: number; yesterday: number }>(
      `SELECT 
        ISNULL(SUM(CASE WHEN CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE) THEN amount ELSE 0 END), 0) as today,
        ISNULL(SUM(CASE WHEN CAST(payment_date AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE) THEN amount ELSE 0 END), 0) as yesterday
       FROM Payments WHERE status = 'completed'`
    );

    const todayCollection = todayResult.recordset[0].today;
    const yesterdayCollection = todayResult.recordset[0].yesterday;
    const todayTrend =
      yesterdayCollection > 0
        ? Math.round(
            ((todayCollection - yesterdayCollection) / yesterdayCollection) *
              100
          )
        : 0;

    const monthlyResult = await query<{ total: number }>(
      `SELECT ISNULL(SUM(amount), 0) as total
       FROM Payments
       WHERE status = 'completed'
         AND MONTH(payment_date) = MONTH(GETDATE())
         AND YEAR(payment_date) = YEAR(GETDATE())`
    );

    const monthlyCollection = monthlyResult.recordset[0].total;
    const monthlyTarget = 58000;
    const monthlyPercentage = Math.round(
      (monthlyCollection / monthlyTarget) * 100
    );

    const pendingResult = await query<{ amount: number; count: number }>(
      `SELECT 
        ISNULL(SUM(amount), 0) as amount,
        COUNT(*) as count
       FROM Payments WHERE status = 'pending'`
    );

    const pendingAmount = pendingResult.recordset[0].amount;
    const pendingCount = pendingResult.recordset[0].count;

    return {
      todayCollection,
      todayTrend,
      monthlyCollection,
      monthlyTarget,
      monthlyPercentage,
      pendingAmount,
      pendingCount,
    };
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return {
      todayCollection: 0,
      todayTrend: 0,
      monthlyCollection: 0,
      monthlyTarget: 0,
      monthlyPercentage: 0,
      pendingAmount: 0,
      pendingCount: 0,
    };
  }
};

export const getBillForPayment = async (
  billId: string
): Promise<{
  bill_id: string;
  customer_id: string;
  total_amount: number;
  status: string;
} | null> => {
  try {
    const result = await query<{
      bill_id: string;
      customer_id: string;
      total_amount: number;
      status: string;
    }>(
      `SELECT bill_id, customer_id, total_amount, status FROM Bills WHERE bill_id = @billId`,
      { billId }
    );
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching bill for payment:", error);
    return null;
  }
};

export const getPaymentCount = async (): Promise<number> => {
  try {
    const result = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM Payments`
    );
    return result.recordset[0].count;
  } catch (error) {
    console.error("Error getting payment count:", error);
    return 0;
  }
};
