"use client";

import { Badge, GlassCard, Table } from "@/components/ui";
import { UTILITIES } from "@/constants";
import { cn } from "@/lib/utils";
import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    key: "customer_id",
    label: "Customer ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "address",
    label: "Address",
  },
  {
    key: "utilities",
    label: "Services",
    render: (utilities: (keyof typeof UTILITIES)[]) => {
      if (!utilities || utilities.length === 0) {
        return (
          <div className="flex justify-center">
            <span className="text-gray-400 text-sm">-</span>
          </div>
        );
      }

      return (
        <div className="flex justify-center gap-1">
          {utilities.map((utility) => {
            const utilityConfig = UTILITIES[utility];
            return (
              <div
                key={utility}
                className={cn(
                  "p-2 rounded-lg",
                  utilityConfig.backgroundClassName
                )}
              >
                <utilityConfig.icon
                  size={16}
                  className={utilityConfig.textClassName}
                />
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    key: "balance",
    label: "Balance",
    render: (balance: number) => {
      return (
        <span
          className={
            balance > 0
              ? "text-red-600 dark:text-red-400 font-semibold"
              : "text-green-600 dark:text-green-400"
          }
        >
          ${balance.toFixed(2)}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (status: string) => {
      return (
        <Badge variant={status === "active" ? "success" : "danger"}>
          {status}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    render: (_: unknown, row: Customer) => {
      return (
        <div className="flex gap-2">
          <Link
            href={`/UMS/Customers/${row.customer_id}`}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-smooth"
          >
            <Eye size={16} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <Link
            href={`/UMS/Customers/${row.customer_id}/Edit`}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-smooth"
          >
            <Edit size={16} className="text-blue-600 dark:text-blue-400" />
          </Link>
          <Link
            href={`/UMS/Customers/${row.customer_id}/Delete`}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-smooth"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </Link>
        </div>
      );
    },
  },
];

export function CustomersTable({ data }: { data: Customer[] }) {
  return (
    <GlassCard>
      <Table columns={columns} data={data} />
    </GlassCard>
  );
}
