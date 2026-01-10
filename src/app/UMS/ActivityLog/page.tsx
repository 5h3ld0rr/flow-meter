import { Header } from "@/components/layout";
import { getActivities } from "@/lib/data/activity";
import { getUsersByRole } from "@/lib/data/users";
import { ActivityFilter } from "@/components/ActivityLog/ActivityFilter";
import { ActivityList } from "@/components/ActivityLog/ActivityList";

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const users = await getUsersByRole();

  // Parse dates carefully
  const startDate = params.startDate ? new Date(params.startDate) : undefined;

  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  // If endDate is provided, set it to the end of that day
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  const activities = await getActivities({
    userId: params.userId,
    activityType: params.activityType,
    startDate,
    endDate,
  });

  return (
    <>
      <Header
        title="Activity Log"
        subtitle="Monitor system activities, readings, and payments"
      />

      <ActivityFilter users={users} />

      <ActivityList activities={activities} />
    </>
  );
}
