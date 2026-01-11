"use client";

import { Badge, Table, toast } from "@/components/ui";

export const PaymentsTable = ({ data }: { data: Payment[] }) => {
  const columns = [
    {
      key: "payment_id",
      label: "Payment ID",
      render: (paymentId: string) => (
        <span
          className="cursor-pointer"
          onClick={async () => {
            await navigator.clipboard.writeText(paymentId);
            toast("success", "Payment ID copied to clipboard");
          }}
        >
          {paymentId}
        </span>
      ),
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
          LKR {amount.toFixed(2)}
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
};
