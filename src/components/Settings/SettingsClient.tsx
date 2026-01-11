"use client";

import { useActionState, useEffect, useState } from "react";
import { Button, GlassCard, Input } from "@/components/ui";
import { DollarSign, Save } from "lucide-react";
import { updateTariffRates } from "@/lib/actions/billing";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { UTILITIES } from "@/constants";

export const SettingsClient = ({ tariffs }: { tariffs: Tariff[] }) => {
  const [activeTab, setActiveTab] = useState<string>("electricity");
  const [tariffState, tariffAction, isSavingTariffs] = useActionState(
    updateTariffRates,
    undefined
  );

  useEffect(() => {
    if (tariffState?.message) {
      toast[tariffState.success ? "success" : "error"](tariffState.message);
    }
  }, [tariffState]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {/* Tariff Management */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Tariff Configuration
            </h3>
          </div>

          <GlassCard
            className="p-6 md:p-8 relative overflow-hidden hover:shadow-xl transition-shadow duration-300"
            variant="subtle"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

            <form action={tariffAction} className="space-y-6 relative z-10">
              <div className="flex flex-wrap px-1 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl mb-8">
                {Object.entries(UTILITIES).map(([key, util]) => (
                  <Button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    variant={activeTab === key ? "primary" : "ghost"}
                    icon={<util.icon size={18} />}
                    className="flex-1 text-nowrap"
                  >
                    {util.name}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {(["electricity", "water", "gas"] as const).map((utility) => (
                  <div
                    key={utility}
                    className={cn(
                      "space-y-4 animate-in fade-in zoom-in-95 duration-300",
                      activeTab === utility ? "block" : "hidden"
                    )}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(["household", "business", "government"] as const).map(
                        (type) => {
                          const rate =
                            tariffs
                              .filter(
                                (t) =>
                                  t.utility_type === utility &&
                                  t.customer_type === type
                              )
                              .sort(
                                (a, b) =>
                                  new Date(b.effective_from).getTime() -
                                  new Date(a.effective_from).getTime()
                              )[0]?.rate_per_unit ||
                            (type === "household"
                              ? utility === "electricity"
                                ? 0.15
                                : utility === "water"
                                ? 0.05
                                : 0.25
                              : 0);

                          return (
                            <div
                              key={`${utility}_${type}`}
                              className="group relative"
                            >
                              <Input
                                label={
                                  type.charAt(0).toUpperCase() + type.slice(1)
                                }
                                name={`${utility}_${type}`}
                                type="number"
                                step="0.0001"
                                defaultValue={rate}
                                className="bg-white/50 dark:bg-slate-900/50 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors"
                                required
                                icon={
                                  <div className="text-xs font-medium text-gray-500">
                                    {utility === "electricity"
                                      ? "kWh "
                                      : utility === "water"
                                      ? "L "
                                      : "m³ "}
                                  </div>
                                }
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  type="submit"
                  icon={<Save size={18} />}
                  disabled={isSavingTariffs}
                >
                  {isSavingTariffs
                    ? "Updating Rates..."
                    : "Update Tariff Rates"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};
