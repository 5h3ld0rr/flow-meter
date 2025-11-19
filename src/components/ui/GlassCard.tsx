import { cn } from "@/lib/utils";
import React from "react";
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
  onClick?: () => void;
}
export function GlassCard({
  children,
  className = "",
  variant = "default",
  hover = false,
  onClick,
}: GlassCardProps) {
  const variantClasses = {
    default: "glass",
    strong: "glass-strong",
    subtle: "glass-subtle",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        "rounded-2xl bg-white dark:bg-slate-900/80",
        hover ? "hover-lift cursor-pointer" : "",
        className
      )}
    >
      {children}
    </div>
  );
}
