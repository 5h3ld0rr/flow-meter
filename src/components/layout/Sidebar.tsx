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
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Logo } from "../ui/Logo";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/Button";

const NAV_ITEMS = [
  { path: "/UMS/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/UMS/Customers", label: "Customers", icon: Users },
  { path: "/UMS/Meters", label: "Meters", icon: Gauge },
  { path: "/UMS/Readings", label: "Readings", icon: ClipboardList },
  { path: "/UMS/Billing", label: "Billing", icon: FileText },
  { path: "/UMS/Payments", label: "Payments", icon: CreditCard },
  { path: "/UMS/Reports", label: "Reports", icon: BarChart3 },
  { path: "/UMS/Settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  variant={isActive ? "primary" : "ghost"}
                  fullWidth
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
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
}
