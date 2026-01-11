import { GlassCard } from "../ui/GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red";
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) => {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
    green:
      "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
    yellow:
      "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
    red: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  };
  return (
    <GlassCard hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </div>
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </GlassCard>
  );
};
