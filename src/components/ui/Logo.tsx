import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}
export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: {
      icon: 16,
      container: "w-8 h-8",
      text: "text-base",
      subtext: "text-xs",
    },
    md: {
      icon: 20,
      container: "w-10 h-10",
      text: "text-xl",
      subtext: "text-xs",
    },
    lg: {
      icon: 28,
      container: "w-14 h-14",
      text: "text-3xl",
      subtext: "text-sm",
    },
  };
  const currentSize = sizes[size];
  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div
        className={cn(
          "relative rounded-xl bg-linear-to-br from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 p-2 shadow-glow-cyan",
          currentSize.container
        )}
      >
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-400/20 to-purple-400/20 dark:from-cyan-400/20 dark:to-purple-400/20 animate-pulse" />
        <div className="relative flex items-center justify-center h-full">
          <div className="absolute">
            <Zap
              size={currentSize.icon}
              className="text-white animate-pulse-slow"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
      {/* Brand Text */}
      {showText && (
        <div>
          <h1 className={cn(currentSize.text, "font-bold text-gradient")}>
            FlowMeter
          </h1>
          <p
            className={cn(
              currentSize.subtext,
              "text-gray-600 dark:text-gray-400 font-medium"
            )}
          >
            Utility Intelligence
          </p>
        </div>
      )}
    </div>
  );
}
