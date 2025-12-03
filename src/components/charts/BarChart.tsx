"use client";

import { useTheme } from "next-themes";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartProps {
  data: unknown[];
  dataKeys: {
    key: string;
    color: string;
    name: string;
  }[];
  xAxisKey: string;
}

export function BarChart({ data, dataKeys, xAxisKey }: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ResponsiveContainer>
      <RechartsBarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={
            isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(156, 163, 175, 0.2)"
          }
        />
        <XAxis
          dataKey={xAxisKey}
          stroke={
            isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(107, 114, 128, 0.5)"
          }
          style={{
            fontSize: "12px",
            fill: isDark ? "#94a3b8" : "#6b7280",
          }}
        />
        <YAxis
          stroke={
            isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(107, 114, 128, 0.5)"
          }
          style={{
            fontSize: "12px",
            fill: isDark ? "#94a3b8" : "#6b7280",
          }}
        />
        <Tooltip
          cursor={{
            fill: "rgba(148, 163, 184, 0.1)",
          }}
          contentStyle={{
            backgroundColor: isDark
              ? "rgba(30, 41, 59, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "8px",
            boxShadow: isDark
              ? "0 4px 6px rgba(0, 0, 0, 0.3)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
            color: isDark ? "#f8fafc" : "#111827",
          }}
          labelStyle={{
            color: isDark ? "#f8fafc" : "#111827",
          }}
        />
        <Legend
          wrapperStyle={{
            color: isDark ? "#94a3b8" : "#6b7280",
          }}
        />
        {dataKeys.map((dataKey) => (
          <Bar
            key={dataKey.key}
            dataKey={dataKey.key}
            fill={dataKey.color}
            name={dataKey.name}
            radius={[8, 8, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
