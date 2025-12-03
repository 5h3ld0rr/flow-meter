"use client";

import { Button, GlassCard, Input, Toggle } from "@/components/ui";
import { Header } from "@/components/layout";
import { Bell, DollarSign, Save, UsersIcon } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  return (
    <>
      <Header
        title="Settings"
        subtitle="Manage system preferences and configurations"
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Notification Settings */}
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-6">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Bell
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg glass">
              <div className="flex-1 mr-3">
                <p className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                  Push Notifications
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications for important updates
                </p>
              </div>
              <Toggle checked={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg glass">
              <div className="flex-1 mr-3">
                <p className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                  Email Alerts
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Get email notifications for payments and bills
                </p>
              </div>
              <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
            </div>
          </div>
        </GlassCard>
        {/* Tariff Management */}
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-6">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Tariff Rates
            </h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <Input
              label="Electricity Rate (per kWh)"
              type="number"
              placeholder="0.15"
            />
            <Input
              label="Water Rate (per Liter)"
              type="number"
              placeholder="0.05"
            />
            <Input label="Gas Rate (per m³)" type="number" placeholder="0.25" />
            <Button variant="primary" fullWidth icon={<Save size={18} />}>
              Save Tariff Rates
            </Button>
          </div>
        </GlassCard>
        {/* User Management */}
        <GlassCard className="p-4 md:p-6 xl:col-span-2">
          <div className="flex items-center space-x-3 mb-4 md:mb-6">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <UsersIcon
                size={20}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              User Roles
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                name: "Admin",
                users: 3,
                color: "blue",
              },
              {
                name: "Field Officer",
                users: 12,
                color: "green",
              },
              {
                name: "Cashier",
                users: 8,
                color: "yellow",
              },
              {
                name: "Manager",
                users: 5,
                color: "purple",
              },
            ].map((role) => (
              <div
                key={role.name}
                className="flex flex-col p-3 md:p-4 rounded-lg glass hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth"
              >
                <div className="flex-1 mb-3">
                  <p className="font-medium text-sm md:text-base text-gray-900 dark:text-white">
                    {role.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {role.users} users
                  </p>
                </div>
                <Button variant="secondary" size="sm" fullWidth>
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
