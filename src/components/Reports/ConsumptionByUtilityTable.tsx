"use client";

import { Table, Column } from "@/components/ui";

interface ConsumptionByUtilityData {
  utility_type: string;
  customers: number;
  consumption: number;
}

interface ConsumptionByUtilityTableProps {
  data: ConsumptionByUtilityData[];
}

export const ConsumptionByUtilityTable = ({
  data,
}: ConsumptionByUtilityTableProps) => {
  const columns: Column[] = [
    {
      key: "utility_type",
      label: "Utility Type",
      render: (value: string) => (
        <span className="capitalize font-medium">{value}</span>
      ),
    },
    {
      key: "customers",
      label: "Active Meters",
      align: "center",
    },
    {
      key: "consumption",
      label: "Consumption (kWh)",
      align: "right",
      render: (value: number) => (
        <span className="font-semibold">{value.toLocaleString()}</span>
      ),
    },
    {
      key: "avg",
      label: "Avg per Meter",
      align: "right",
      render: (_: unknown, row: ConsumptionByUtilityData) => {
        const avg =
          row.customers > 0
            ? (row.consumption / row.customers).toFixed(2)
            : "0.00";
        return avg;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      className="bg-transparent shadow-none border-0"
    />
  );
};
