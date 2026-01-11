"use client";

import { Badge, Table } from "@/components/ui";

export const PaymentsTable = ({ data }: { data: Payment[] }) => {
  const columns = [
    {
      key: "payment_id",
      label: "Payment ID",
    },
    {
      key: "payment_date",
      label: "Date",
      render: (date: Date) =>
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      key: "customer_name",
      label: "Customer",
    },
    {
      key: "bill_id",
      label: "Bill ID",
    },
    {
      key: "amount",
      label: "Amount",
      render: (amount: number) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "payment_method",
      label: "Method",
      render: (method: string) =>
        method.charAt(0).toUpperCase() + method.slice(1),
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => (
        <Badge variant={status === "completed" ? "success" : "warning"}>
          {status}
        </Badge>
      ),
    },
  ];

  return <Table columns={columns} data={data} />;
}
