"use client";

import { Table, Column, Badge } from "@/components/ui";

interface Bill {
  bill_id: string;
  billing_period_start: Date;
  billing_period_end: Date;
  consumption: number;
  base_amount: number;
  total_amount: number;
  status: string;
}

interface BillingHistoryTableProps {
  bills: Bill[];
  unit: string;
}

export const BillingHistoryTable = ({
  bills,
  unit,
}: BillingHistoryTableProps) => {
  const columns: Column[] = [
    {
      key: "bill_id",
      label: "Bill ID",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "period",
      label: "Period",
      render: (_: unknown, row: Bill) => (
        <>
          {new Date(row.billing_period_start).toLocaleDateString()} -{" "}
          {new Date(row.billing_period_end).toLocaleDateString()}
        </>
      ),
    },
    {
      key: "consumption",
      label: "Consumption",
      render: (value: number) => (
        <>
          {Number(value).toLocaleString()} {unit}
        </>
      ),
    },
    {
      key: "base_amount",
      label: "Base Amount",
      render: (value: number) => `LKR ${Number(value).toFixed(2)}`,
    },
    {
      key: "total_amount",
      label: "Total Amount",
      render: (value: number) => (
        <span className="font-semibold">LKR {Number(value).toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge
          variant={
            status === "paid"
              ? "success"
              : status === "overdue"
                ? "danger"
                : "warning"
          }
          size="sm"
        >
          {status}
        </Badge>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={bills.slice(0, 10)}
      className="bg-transparent shadow-none border-0"
    />
  );
};
