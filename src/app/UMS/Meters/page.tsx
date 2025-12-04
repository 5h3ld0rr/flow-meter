import { Badge, Button, GlassCard } from "@/components/ui";
import { Header } from "@/components/layout";
import { UTILITIES } from "@/constants";
import { Plus, Radio } from "lucide-react";
import { getMeters } from "@/lib/queries/meters";
import { redirect, RedirectType } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const _params = await searchParams;
  const meterType = _params.type?.toLowerCase();

  if (_params.type && !Object.keys(UTILITIES).includes(meterType as string)) {
    redirect("/UMS/Meters", RedirectType.replace);
  }

  const meters = await getMeters(meterType);

  return (
    <>
      <Header
        title="Meter Management"
        subtitle="Monitor and manage utility meters"
      />

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex space-x-2 glass rounded-xl px-1">
          <Button
            href="/UMS/Meters"
            variant={!meterType ? "primary" : "ghost"}
            icon={<Radio size={18} />}
            className="flex-1 text-nowrap"
          >
            All Meters
          </Button>
          {Object.entries(UTILITIES).map(([key, util]) => (
            <Button
              key={key}
              href={`/UMS/Meters?type=${key}`}
              variant={meterType === key ? "primary" : "ghost"}
              icon={<util.icon size={18} />}
              className="flex-1 text-nowrap"
            >
              {util.name}
            </Button>
          ))}
        </div>

        <Button
          variant="primary"
          href="/UMS/Meters/New"
          icon={<Plus size={20} />}
          className="font-medium"
        >
          Add Meter
        </Button>
      </div>

      {/* Meters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meters.map((meter: Meter & { customer_name: string }) => {
          const utilityConfig = UTILITIES[meter.utility_type];

          return (
            <GlassCard key={meter.meter_id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "p-2.5 rounded-lg",
                      utilityConfig.backgroundClassName
                    )}
                  >
                    <utilityConfig.icon
                      size={20}
                      className={utilityConfig.textClassName}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {meter.serial_number}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {meter.utility_type}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={meter.status === "active" ? "success" : "warning"}
                  className="text-xs"
                >
                  {meter.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {meter.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {meter.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last Reading
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {meter.last_reading_value || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Install Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(meter.install_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  href={`/UMS/Meters/${meter.meter_id}`}
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="ring-1 ring-gray-800/10 dark:ring-gray-200/10"
                  href={`/UMS/Meters/${meter.meter_id}/Edit`}
                >
                  Edit
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
