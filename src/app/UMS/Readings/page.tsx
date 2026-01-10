import { Badge, GlassCard } from "@/components/ui";
import { Header } from "@/components/layout";
import { getReadings } from "@/lib/data/readings";
import { ReadingForm } from "@/components/Readings/ReadingForm";
import { UTILITIES } from "@/constants";

export default async function Page() {
  const readings = await getReadings(undefined, 5);

  return (
    <>
      <Header
        title="Meter Readings"
        subtitle="Record and manage meter readings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Entry Form */}
        <ReadingForm />

        {/* Reading History */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Readings
            </h2>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {readings.map((reading) => {
              const utilKey = reading.utility_type as keyof typeof UTILITIES;
              const unit = UTILITIES[utilKey]?.unit || "";

              return (
                <div
                  key={reading.id}
                  className="p-4 rounded-lg glass hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reading.meter_serial}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(reading.reading_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        reading.status === "submitted" ? "success" : "warning"
                      }
                      size="sm"
                    >
                      {reading.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Reading:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {reading.reading_value} {unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Consumption:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-cyan-400">
                      {reading.consumption} {unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
