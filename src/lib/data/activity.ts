import { query } from "@/lib/db";

export interface ActivityLogItem {
  id: string; // Composite ID or generated
  activity_type: string;
  description: string;
  created_at: Date;
  user_name: string | null;
  user_id: number | null;
  user_role: string | null;
  amount?: number;
}

export async function getActivities(filters?: {
  userId?: string;
  activityType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<ActivityLogItem[]> {
  const params: Record<string, string | number | Date> = {};
  let sql = `
    SELECT * FROM (
      -- Readings Activity
      SELECT 
        CONCAT('reading_', r.id) as id,
        'Reading' as activity_type,
        CONCAT('Meter Reading: ', r.reading_value, ' (Meter: ', m.meter_id, ')') as description,
        r.reading_date as created_at,
        u.full_name as user_name,
        u.id as user_id,
        u.role as user_role,
        NULL as amount
      FROM Readings r
      LEFT JOIN Users u ON r.created_by = u.id
      LEFT JOIN Meters m ON r.meter_id = m.id

      UNION ALL

      -- Payments Activity
      SELECT 
        CONCAT('payment_', p.id) as id,
        'Payment' as activity_type,
        CONCAT('Payment Received: ', p.amount) as description,
        p.payment_date as created_at,
        u.full_name as user_name,
        u.id as user_id,
        u.role as user_role,
        p.amount
      FROM Payments p
      LEFT JOIN Users u ON p.created_by = u.id
    ) AS activities
    WHERE 1=1
  `;

  if (filters?.userId) {
    sql += " AND user_id = @userId";
    params.userId = filters.userId;
  }

  if (filters?.activityType && filters.activityType !== "all") {
    sql += " AND activity_type = @activityType";
    params.activityType = filters.activityType;
  }

  if (filters?.startDate) {
    sql += " AND created_at >= @startDate";
    params.startDate = filters.startDate;
  }

  if (filters?.endDate) {
    sql += " AND created_at <= @endDate";
    params.endDate = filters.endDate;
  }

  sql += " ORDER BY created_at DESC";

  // Limit to prevent overload if no paging yet
  // sql += " OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY"; // T-SQL syntax

  const result = await query<ActivityLogItem>(sql, params);
  return result.recordset;
}
