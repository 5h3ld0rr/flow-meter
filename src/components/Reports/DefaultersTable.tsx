"use client";

import { Table, Column } from "@/components/ui";

interface DefaulterData {
  name: string;
  customer_id: string;
  bill_count: number;
  outstanding: number;
}

interface DefaultersTableProps {
  data: DefaulterData[];
}

export const DefaultersTable = ({ data }: DefaultersTableProps) => {
  const columns: Column[] = [
    {
      key: "name",
      label: "Customer Name",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "customer_id",
      label: "Customer ID",
    },
    {
      key: "bill_count",
      label: "Overdue Bills",
      align: "center",
    },
    {
      key: "outstanding",
      label: "Outstanding Amount",
      align: "right",
      render: (value: number) => (
        <span className="text-red-600 font-semibold">
          ${value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "risk",
      label: "Risk Level",
      align: "right",
      render: (_: unknown, row: DefaulterData) => {
        const riskLevel =
          row.outstanding > 5000
            ? "High"
            : row.outstanding > 1000
            ? "Medium"
            : "Low";
        const riskColor =
          riskLevel === "High"
            ? "text-red-600"
            : riskLevel === "Medium"
            ? "text-amber-600"
            : "text-green-600";

        return <span className={`font-bold ${riskColor}`}>{riskLevel}</span>;
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
