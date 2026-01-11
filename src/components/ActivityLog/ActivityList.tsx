"use client";

import { ActivityLogItem } from "@/lib/data/activity";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Activity, Calendar } from "lucide-react";
import { ROLES } from "@/constants";
import { Table } from "@/components/ui/Table";

interface ActivityListProps {
  activities: ActivityLogItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <Activity size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No activities found</h3>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </GlassCard>
    );
  }

  const columns = [
    {
      key: "created_at",
      label: "Timestamp",
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="opacity-70" />
          {new Date(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: "activity_type",
      label: "Activity",
      render: (value: string) => (
        <Badge
          variant={
            value === "Payment"
              ? "success"
              : value === "Reading"
                ? "info"
                : "default"
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "user_name",
      label: "User",
      render: (value: string, row: ActivityLogItem) => {
        if (!value) {
          return <span className="text-gray-400 italic">System / Unknown</span>;
        }

        const roleKey = (
          row.user_role || "staff"
        ).toLowerCase() as keyof typeof ROLES;
        const roleConfig = ROLES[roleKey] || ROLES.staff;
        const Icon = roleConfig.icon;

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={roleConfig?.badgeVariant || "default"}
              size="sm"
              tooltip={roleConfig?.label}
            >
              {<Icon size={12} />}
            </Badge>
            {value}
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      render: (value: string) => value,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number | undefined) =>
        value ? (
          <span className="text-green-600 dark:text-green-400 font-medium">
            +LKR {value.toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  return (
    <GlassCard>
      <Table
        columns={columns}
        data={activities}
        className="bg-white/50 dark:bg-slate-900/50"
      />
    </GlassCard>
  );
}
