"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  render?: (data: any, row?: any) => ReactNode;
}
interface TableProps {
  columns: Column[];
  data: unknown[];
  onRowClick?: (row: unknown) => void;
  className?: string;
}
export function Table({
  columns,
  data,
  onRowClick,
  className = "",
}: TableProps) {
  return (
    <div className={cn("glass rounded-xl overflow-hidden", className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-gray-100 dark:border-gray-800 last:border-0
                  transition-smooth
                  ${
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      : ""
                  }
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}
