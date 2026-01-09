"use client";

import { useMemo } from "react";

import { Badge, GlassCard, Table } from "@/components/ui";
import { UserIcon, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { ROLES } from "@/constants";

export const UsersTable = ({ data }: { data: User[] }) => {
  const columns = useMemo(
    () => [
      {
        key: "employee_id",
        label: "Employee No",
        render: (id: string) => <span className="font-mono">{id}</span>,
      },

      {
        key: "full_name",
        label: "Name",
      },
      {
        key: "email",
        label: "Email",
      },
      {
        key: "role",
        label: "Role",
        render: (role: string) => {
          const roleKey = role.toLowerCase() as keyof typeof ROLES;
          const config = ROLES[roleKey];
          const Icon = config?.icon || UserIcon;
          return (
            <Badge
              variant={config?.badgeVariant || "default"}
              size="sm"
              className="capitalize gap-1.5"
            >
              <Icon size={12} />
              {role}
            </Badge>
          );
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (_: unknown, row: User) => (
          <div className="flex gap-2">
            <Link
              href={`/UMS/Users/${row.id}/Edit`}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-smooth"
            >
              <Eye size={16} className="text-gray-600 dark:text-gray-400" />
            </Link>
            <Link
              href={`/UMS/Users/${row.id}/Edit`}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-smooth"
            >
              <Edit size={16} className="text-blue-600 dark:text-blue-400" />
            </Link>
            <Link
              href={`/UMS/Users/${row.id}/Delete`}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-smooth disabled:opacity-50"
            >
              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <GlassCard>
      <Table
        columns={columns}
        data={data}
        className="border-0 shadow-none bg-transparent"
      />
    </GlassCard>
  );
};
