"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (data: any, row?: any) => ReactNode;
  align?: "left" | "center" | "right";
}

export interface TableProps {
  columns: Column[];
  data: unknown[];
  onRowClick?: (row: unknown) => void;
  className?: string;
  maxHeight?: string;
}
export const Table = ({
  columns,
  data,
  onRowClick,
  className = "",
  maxHeight = "max-h-[calc(100vh-200px)]",
}: TableProps) => {
  return (
    <div
      className={cn(
        "glass rounded-xl overflow-hidden flex flex-col",
        className
      )}
    >
      <div className={cn("overflow-auto scrollbar-thin", maxHeight)}>
        <table className="w-full relative">
          <thead className="sticky top-0 z-10 bg-white backdrop-blur-md dark:bg-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300",
                    column.align ? `text-${column.align}` : "text-left"
                  )}
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
                    className={cn(
                      "px-6 py-4 text-sm text-gray-600 dark:text-gray-400",
                      column.align ? `text-${column.align}` : "text-left"
                    )}
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
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
          No data available
        </div>
      )}
    </div>
  );
};
