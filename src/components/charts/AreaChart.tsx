"use client";

import { useTheme } from "next-themes";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AreaChartProps {
  data: unknown[];
  dataKeys: {
    key: string;
    color: string;
    name: string;
  }[];
  xAxisKey: string;
}
export const AreaChart = ({ data, dataKeys, xAxisKey }: AreaChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <ResponsiveContainer>
      <RechartsAreaChart data={data}>
        <defs>
          {dataKeys.map((dataKey, index) => (
            <linearGradient
              key={dataKey.key}
              id={`color${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={dataKey.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={dataKey.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
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
        {dataKeys.map((dataKey, index) => (
          <Area
            key={dataKey.key}
            type="monotone"
            dataKey={dataKey.key}
            stroke={dataKey.color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color${index})`}
            name={dataKey.name}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
