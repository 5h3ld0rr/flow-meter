"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";
import { Combobox } from "@/components/ui/Combobox";

interface UserCompact {
  id: number;
  full_name: string;
}

interface ActivityFilterProps {
  users: UserCompact[];
}

export function ActivityFilter({ users }: ActivityFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState(searchParams.get("userId") || "");
  const [activityType, setActivityType] = useState(
    searchParams.get("activityType") || "all"
  );
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const userOptions = [
    { value: "", label: "All Users" },
    ...users.map((user) => ({
      value: user.id.toString(),
      label: user.full_name,
    })),
  ];

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    if (activityType && activityType !== "all")
      params.set("activityType", activityType);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    router.push(`/UMS/ActivityLog?${params.toString()}`);
  };

  const handleReset = () => {
    setUserId("");
    setActivityType("all");
    setStartDate("");
    setEndDate("");
    router.push("/UMS/ActivityLog");
  };

  return (
    <GlassCard className="p-4 mb-6 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* User Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            User
          </label>
          <Combobox
            options={userOptions}
            value={userId}
            onSelect={setUserId}
            placeholder="Select User"
            emptyText="No user found"
          />
        </div>

        {/* Activity Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Activity Type
          </label>
          <select
            className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="Reading">Readings</option>
            <option value="Payment">Payments</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleFilter}
            className="flex-1"
            icon={<Search size={16} />}
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            icon={<X size={16} />}
          >
            Reset
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
