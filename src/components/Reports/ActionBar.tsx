"use client";

import { Button } from "@/components/ui";
import { PDFExportButton } from "./PDFExportButton";
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Filter,
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

  // Determine report type from pathname
  const getReportType = ():
    | "revenue"
    | "consumption"
    | "customers"
    | "defaulters" => {
    if (pathname?.includes("Revenue")) return "revenue";
    if (pathname?.includes("Consumption")) return "consumption";
    if (pathname?.includes("Customers")) return "customers";
    if (pathname?.includes("Defaulters")) return "defaulters";
    return "revenue"; // default
  };

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
        <PDFExportButton reportType={getReportType()} variant="primary" />
      </div>
    </div>
  );
};
