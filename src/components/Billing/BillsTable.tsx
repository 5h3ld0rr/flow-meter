"use client";

import { Table, Column, Badge, Button, toast } from "@/components/ui";
import type { IRecordSet } from "mssql";

interface BillsTableProps {
  bills: IRecordSet<Bill & { customer_name: string }>;
}

export const BillsTable = ({ bills }: BillsTableProps) => {
  const columns: Column[] = [
    {
      key: "bill_id",
      label: "Bill ID",
      render: (billId: string) => (
        <span
          className="cursor-pointer"
          onClick={async () => {
            await navigator.clipboard.writeText(billId);
            toast("success", "Bill ID copied to clipboard");
          }}
        >
          {billId}
        </span>
      ),
    },
    { key: "customer_name", label: "Customer" },
    {
      key: "created_at",
      label: "Date",
      align: "center",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "total_amount",
      label: "Amount",
      align: "center",
      render: (amount: number) => `LKR ${amount}`,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
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
    {
      key: "actions",
      label: "Actions",
      align: "center",
      render: (_: unknown, row: Bill) => (
        <div>
          <Button
            variant="ghost"
            size="sm"
            href={`/UMS/Billing/${row.bill_id}`}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={bills}
      className="bg-transparent shadow-none border-0"
    />
  );
};
