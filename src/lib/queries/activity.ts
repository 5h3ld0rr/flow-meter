import { query } from "@/lib/db";

export const logActivity = async (
  activityType: "customer" | "meter" | "reading" | "billing" | "payment",
  customerId: number,
  description: string
) => {
  await query(
    `INSERT INTO Activities (activity_type, description, customer_id)
     VALUES (@activityType, @description, @customerId)`,
    { activityType, description, customerId }
  );
};
