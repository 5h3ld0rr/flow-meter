"use client";

import { Table, Column } from "@/components/ui";

interface RevenueByUtilityData {
  utility_type: string;
  customers: number;
  consumption: number;
  revenue: number;
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
      render: () => (
        <span className="text-green-600 dark:text-green-400">+8%</span>
      ),
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
