"use client";

import { Table, Column } from "@/components/ui";

interface UtilityCustomerData {
  utility_type: string;
  customers: number;
}

interface UtilityCustomerTableProps {
  data: UtilityCustomerData[];
}

export const UtilityCustomerTable = ({ data }: UtilityCustomerTableProps) => {
  const totalCustomers = data.reduce((sum, r) => sum + r.customers, 0);

  const columns: Column[] = [
    {
      key: "utility_type",
      label: "Utility Type",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      key: "customers",
      label: "Total Customers",
      align: "center",
    },
    {
      key: "share",
      label: "Share %",
      align: "right",
      render: (_: unknown, row: UtilityCustomerData) => {
        const share =
          totalCustomers > 0
            ? ((row.customers / totalCustomers) * 100).toFixed(1)
            : "0";
        return <span className="font-semibold">{share}%</span>;
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
