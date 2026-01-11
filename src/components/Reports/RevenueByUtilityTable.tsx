"use client";

import { Table, Column } from "@/components/ui";

interface RevenueByUtilityData {
  utility_type: string;
  customers: number;
  consumption: number;
  revenue: number;
  growth: number;
}

interface RevenueByUtilityTableProps {
  data: RevenueByUtilityData[];
}

export const RevenueByUtilityTable = ({ data }: RevenueByUtilityTableProps) => {
  const columns: Column[] = [
    {
      key: "utility_type",
      label: "Utility Type",
      render: (value: string) => (
        <span className="capitalize font-medium">{value}</span>
      ),
    },
    {
      key: "customers",
      label: "Customers",
    },
    {
      key: "consumption",
      label: "Consumption",
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "revenue",
      label: "Revenue",
      render: (value: number) => (
        <span className="font-semibold">LKR {value.toLocaleString()}</span>
      ),
    },
    {
      key: "growth",
      label: "Growth",
      render: (value: number) => {
        const isPositive = value >= 0;
        return (
          <span
            className={
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {isPositive ? "+" : ""}
            {value.toFixed(2)}%
          </span>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      className="bg-transparent shadow-none border-0"
    />
  );
};
