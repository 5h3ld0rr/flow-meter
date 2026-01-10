"use client";

import {
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  Gauge,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
  History,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Logo } from "../ui/Logo";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/Button";

const NAV_ITEMS = [
  {
    path: "/UMS/Dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "officer", "cashier", "manager"],
  },
  {
    path: "/UMS/Customers",
    label: "Customers",
    icon: Users,
    roles: ["admin", "staff", "manager"],
  },
  {
    path: "/UMS/Meters",
    label: "Meters",
    icon: Gauge,
    roles: ["admin", "staff"],
  },
  {
    path: "/UMS/Readings",
    label: "Readings",
    icon: ClipboardList,
    roles: ["admin", "officer"],
  },
  {
    path: "/UMS/Billing",
    label: "Billing",
    icon: FileText,
    roles: ["admin", "cashier"],
  },
  {
    path: "/UMS/Payments",
    label: "Payments",
    icon: CreditCard,
    roles: ["admin", "cashier"],
  },
  {
    path: "/UMS/Reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    path: "/UMS/Users",
    label: "Users",
    icon: Users,
    roles: ["admin"],
  },
  {
    path: "/UMS/ActivityLog",
    label: "Activity Log",
    icon: History,
    roles: ["admin", "staff"],
  },
  {
    path: "/UMS/Settings",
    label: "Settings",
    icon: Settings,
    roles: ["admin", "staff"],
  },
];

interface SidebarProps {
  role?: string;
}

export const Sidebar = ({ role = "staff" }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const filteredNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen w-64 p-4 z-40
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <GlassCard className="h-full flex flex-col">
          {/* Logo */}
          <div className="pt-4 px-6">
            <Logo size="md" showText={true} />
          </div>
          {/* Navigation */}
          <nav className="flex-1 pt-8 px-4 overflow-y-auto scrollbar-thin">
            {filteredNavItems.map((item) => {
              const isActive = pathname.includes(item.path);
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  variant={isActive ? "primary" : "ghost"}
                  fullWidth
                  icon={<Icon size={20} className="mr-1" />}
                  align="start"
                  className="px-4 py-3 font-medium"
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
          {/* Footer */}
          <div className="py-4 border-t border-gray-200 dark:border-gray-700 mx-4">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              FlowMeter &copy; {new Date().getFullYear()}
            </p>
          </div>
        </GlassCard>
      </aside>
    </>
  );
};
