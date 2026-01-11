"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "default"
    | "purple"
    | "orange";
  size?: "sm" | "md";
  className?: string;
  tooltip?: string;
}

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  tooltip,
}: BadgeProps) => {
  const variantClasses = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 dark:border dark:border-green-500/30",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border dark:border-yellow-500/30",
    danger:
      "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 dark:border dark:border-blue-500/30",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 dark:border dark:border-purple-500/30",
    orange:
      "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 dark:border dark:border-orange-500/30",
    default:
      "bg-gray-100 text-gray-800 dark:bg-gray-100/5 dark:text-slate-300 dark:border dark:border-dark-border",
  };
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  const badgeContent = (
    <span
      className={`
      inline-flex items-center font-medium rounded-full
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}
    >
      {children}
    </span>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
};
