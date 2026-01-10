"use client";

import { useActionState, useEffect } from "react";
import { Button, GlassCard, Input } from "@/components/ui";
import { DollarSign, Save } from "lucide-react";
import { updateTariffRates } from "@/lib/actions/billing";

import { toast } from "sonner";

interface Tariff {
  utility_type: string;
  rate_per_unit: number;
}

export const SettingsClient = ({ tariffs }: { tariffs: Tariff[] }) => {
  const [tariffState, tariffAction, isSavingTariffs] = useActionState(
    updateTariffRates,
    undefined
  );

  useEffect(() => {
    if (tariffState?.message) {
      toast[tariffState.success ? "success" : "error"](tariffState.message);
    }
  }, [tariffState]);

  const electricityRate =
    tariffs.find((t) => t.utility_type === "electricity")?.rate_per_unit ||
    0.15;
  const waterRate =
    tariffs.find((t) => t.utility_type === "water")?.rate_per_unit || 0.05;
  const gasRate =
    tariffs.find((t) => t.utility_type === "gas")?.rate_per_unit || 0.25;

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
              <div className="space-y-4">
                <Input
                  label="Electricity Rate (per kWh)"
                  name="electricity"
                  type="number"
                  step="0.0001"
                  defaultValue={electricityRate}
                  icon={
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      ⚡
                    </div>
                  }
                  className="bg-white/50 dark:bg-slate-900/50"
                  required
                />
                <Input
                  label="Water Rate (per Liter)"
                  name="water"
                  type="number"
                  step="0.0001"
                  defaultValue={waterRate}
                  icon={
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      💧
                    </div>
                  }
                  className="bg-white/50 dark:bg-slate-900/50"
                  required
                />
                <Input
                  label="Gas Rate (per m³)"
                  name="gas"
                  type="number"
                  step="0.0001"
                  defaultValue={gasRate}
                  icon={
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      🔥
                    </div>
                  }
                  className="bg-white/50 dark:bg-slate-900/50"
                  required
                />
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
