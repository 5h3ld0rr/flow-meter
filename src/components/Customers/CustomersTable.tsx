"use client";

import {
  Badge,
  GlassCard,
  Table,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { UTILITIES } from "@/constants";
import { cn } from "@/lib/utils";
import { Building2, Edit, Eye, Home, Landmark, Trash2 } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    key: "customer_id",
    label: "Customer ID",
    render: (id: string) => <span className="font-mono">{id}</span>,
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
    key: "type",
    label: "Type",
    render: (type: string) => {
      const config = {
        household: { icon: Home, color: "info" as const, label: "Household" },
        business: {
          icon: Building2,
          color: "purple" as const,
          label: "Business",
        },
        government: {
          icon: Landmark,
          color: "orange" as const,
          label: "Government",
        },
      };

      const typeConfig =
        config[type as keyof typeof config] || config.household;
      const Icon = typeConfig.icon;

      return (
        <Badge
          variant={typeConfig.color}
          className="p-1.5"
          tooltip={typeConfig.label}
        >
          <Icon size={14} />
        </Badge>
      );
    },
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
              <TooltipProvider key={utility}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{utilityConfig.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
      const isActive = status === "active";
      return <Badge variant={isActive ? "success" : "danger"}>{status}</Badge>;
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

export const CustomersTable = ({ data }: { data: Customer[] }) => {
  return (
    <GlassCard>
      <Table columns={columns} data={data} />
    </GlassCard>
  );
};
