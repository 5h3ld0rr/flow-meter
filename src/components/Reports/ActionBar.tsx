"use client";

import { Button } from "@/components/ui";
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Filter,
  Download,
} from "lucide-react";
import { usePathname } from "next/navigation";

const REPORT_TABS = [
  {
    label: "Revenue",
    icon: <DollarSign size={18} />,
  },
  {
    label: "Consumption",
    icon: <TrendingUp size={18} />,
  },
  {
    label: "Customers",
    icon: <Users size={18} />,
  },
  {
    label: "Defaulters",
    icon: <AlertTriangle size={18} />,
  },
];
export const ActionBar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <div className="flex space-x-2 glass rounded-xl px-1">
        {REPORT_TABS.map((tab) => (
          <Button
            key={tab.label}
            href={tab.label}
            variant={pathname?.includes(tab.label) ? "primary" : "ghost"}
            icon={tab.icon}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">
          <Filter size={18} />
          Filters
        </Button>
        <Button variant="primary">
          <Download size={18} />
          Export
        </Button>
      </div>
    </div>
  );
}
