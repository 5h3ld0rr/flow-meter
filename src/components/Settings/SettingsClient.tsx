"use client";

import { useActionState, useEffect } from "react";
import { Button, GlassCard, Input } from "@/components/ui";
import { DollarSign, Save, KeyRound } from "lucide-react";
import { updateTariffRates } from "@/lib/actions/billing";
import { changePasswordAction } from "@/lib/actions/users";
import { toast } from "sonner";

interface Tariff {
  utility_type: string;
  rate_per_unit: number;
}

interface SettingsClientProps {
  tariffs: Tariff[];
  userId: number;
}

export const SettingsClient = ({ tariffs, userId }: SettingsClientProps) => {
  const [tariffState, tariffAction, isSavingTariffs] = useActionState(
    updateTariffRates,
    undefined
  );

  const [passwordState, passwordAction, isChangingPassword] = useActionState(
    changePasswordAction,
    undefined
  );

  useEffect(() => {
    if (tariffState?.message) {
      toast[tariffState.success ? "success" : "error"](tariffState.message);
    }
  }, [tariffState]);

  useEffect(() => {
    if (passwordState?.message) {
      toast[passwordState.success ? "success" : "error"](passwordState.message);
    }
  }, [passwordState]);

  const electricityRate =
    tariffs.find((t) => t.utility_type === "electricity")?.rate_per_unit ||
    0.15;
  const waterRate =
    tariffs.find((t) => t.utility_type === "water")?.rate_per_unit || 0.05;
  const gasRate =
    tariffs.find((t) => t.utility_type === "gas")?.rate_per_unit || 0.25;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Tariff Management */}
        <GlassCard className="p-4 md:p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Utility Tariffs
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure global rates per unit
              </p>
            </div>
          </div>

          <form action={tariffAction} className="space-y-5">
            <Input
              label="Electricity Rate (per kWh)"
              name="electricity"
              type="number"
              step="0.0001"
              defaultValue={electricityRate}
              icon={<div className="text-xs font-bold text-blue-500">$</div>}
              required
            />
            <Input
              label="Water Rate (per Liter)"
              name="water"
              type="number"
              step="0.0001"
              defaultValue={waterRate}
              icon={<div className="text-xs font-bold text-cyan-500">$</div>}
              required
            />
            <Input
              label="Gas Rate (per m³)"
              name="gas"
              type="number"
              step="0.0001"
              defaultValue={gasRate}
              icon={<div className="text-xs font-bold text-orange-500">$</div>}
              required
            />

            <Button
              variant="primary"
              fullWidth
              type="submit"
              icon={<Save size={18} />}
              disabled={isSavingTariffs}
            >
              {isSavingTariffs ? "Syncing..." : "Update Tariff Database"}
            </Button>
          </form>
        </GlassCard>
      </div>

      <div className="space-y-6">
        {/* Change Password */}
        <GlassCard className="p-4 md:p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <KeyRound
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update your account password
              </p>
            </div>
          </div>

          <form action={passwordAction} className="space-y-5">
            <input type="hidden" name="userId" value={userId} />
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              required
            />

            <Button
              variant="secondary"
              fullWidth
              type="submit"
              icon={<KeyRound size={18} />}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
