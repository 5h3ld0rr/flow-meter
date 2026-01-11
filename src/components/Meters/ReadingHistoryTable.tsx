"use client";

import { Table, Column } from "@/components/ui";

interface Reading {
  id: number;
  reading_date: Date;
  reading_value: number;
  consumption: number;
  notes: string | null;
}

interface ReadingHistoryTableProps {
  readings: Reading[];
  unit: string;
}

export const ReadingHistoryTable = ({
  readings,
  unit,
}: ReadingHistoryTableProps) => {
  const columns: Column[] = [
    {
      key: "reading_date",
      label: "Date",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      key: "reading_value",
      label: "Reading Value",
      render: (value: number) => (
        <span className="font-medium">
          {Number(value).toLocaleString()} {unit}
        </span>
      ),
    },
    {
      key: "consumption",
      label: "Consumption",
      render: (value: number) => (
        <span className="font-semibold">
          {Number(value).toLocaleString()} {unit}
        </span>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (notes: string | null) => notes || "-",
    },
  ];

  return (
    <Table
      columns={columns}
      data={readings.slice(0, 10)}
      className="bg-transparent shadow-none border-0"
    />
  );
};
