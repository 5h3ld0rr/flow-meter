"use client";

import { Button, Input } from "@/components/ui";
import { PDFExportButton } from "./PDFExportButton";
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useState } from "react";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramStartDate = searchParams.get("startDate");
  const paramEndDate = searchParams.get("endDate");

  const [startDate, setStartDate] = useState(paramStartDate || "");
  const [endDate, setEndDate] = useState(paramEndDate || "");
  const [open, setOpen] = useState(false);

  const activeFiltersCount = [paramStartDate, paramEndDate].filter(
    Boolean
  ).length;

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

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("startDate");
    params.delete("endDate");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <div className="flex space-x-2 glass rounded-xl px-1">
        {REPORT_TABS.map((tab) => (
          <Button
            key={tab.label}
            href={`${tab.label}?${searchParams.toString()}`} // Preserve filters when switching tabs
            variant={pathname?.includes(tab.label) ? "primary" : "ghost"}
            icon={tab.icon}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (isOpen) {
              // Reset inputs to match URL when opening
              setStartDate(paramStartDate || "");
              setEndDate(paramEndDate || "");
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button variant={activeFiltersCount > 0 ? "primary" : "secondary"}>
              <Filter size={18} />
              {activeFiltersCount > 0 ? (
                <span>
                  {paramStartDate && paramEndDate
                    ? `${new Date(paramStartDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} - ${new Date(paramEndDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}`
                    : paramStartDate
                    ? `From ${new Date(paramStartDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}`
                    : paramEndDate
                    ? `Until ${new Date(paramEndDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}`
                    : "Filters"}
                </span>
              ) : (
                "Filters"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Filter Report</h4>
              <div className="space-y-2">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={handleClearFilter}>
                  Clear
                </Button>
                <Button variant="primary" size="sm" onClick={handleApplyFilter}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <PDFExportButton reportType={getReportType()} variant="primary" />
      </div>
    </div>
  );
};
