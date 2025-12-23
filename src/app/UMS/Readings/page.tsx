import { Badge, Button, GlassCard, Input } from "@/components/ui";
import { Header } from "@/components/layout";
import { Camera, Save, History } from "lucide-react";
import { getReadings } from "@/lib/data/readings";

export default async function Page() {
  const readings = await getReadings();

  return (
    <>
      <Header
        title="Meter Readings"
        subtitle="Record and manage meter readings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Entry Form */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            New Reading Entry
          </h2>

          <form className="space-y-4">
            <Input
              label="Meter ID"
              placeholder="Scan or enter meter ID"
              required
            />

            <Input
              label="Current Reading"
              type="number"
              placeholder="Enter current reading"
              required
            />

            <div className="glass rounded-lg p-4 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Previous Reading
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  - kWh
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Current Reading
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  - kWh
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Consumption
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">
                  - kWh
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="secondary" fullWidth icon={<Camera size={18} />}>
                Scan Meter
              </Button>
              <Button variant="primary" fullWidth icon={<Save size={18} />}>
                Submit Reading
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* Reading History */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Readings
            </h2>
            <Button variant="secondary" size="sm" icon={<History size={16} />}>
              View All
            </Button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {readings.map((reading: any) => (
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
                    {reading.reading_value}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Consumption:
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-cyan-400">
                    {reading.consumption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
