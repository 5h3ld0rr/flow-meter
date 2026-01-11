"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTheme } from "next-themes";
interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}
export const PieChart = ({ data }: PieChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <ResponsiveContainer>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={{
            stroke: isDark ? "#94a3b8" : "#6b7280",
            strokeWidth: 1,
          }}
          label={({ name, percent }) =>
            `${name}: ${(percent! * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          stroke={isDark ? "#1e293b" : "#ffffff"}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
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
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
