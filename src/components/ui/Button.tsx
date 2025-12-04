import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  align?: "center" | "start" | "end";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}
export const Button = ({
  children,
  icon,
  variant = "primary",
  align = "center",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  href,
  type = "button",
  className = "",
}: ButtonProps) => {
  const baseClasses =
    "font-medium rounded-lg transition-smooth focus:outline-none my-1 flex items-center gap-2 justify-" +
    align;
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-400 text-white shadow-lg dark:shadow-glow-cyan",
    secondary:
      "glass hover:bg-white/90 dark:hover:bg-gray-100/5 text-gray-700 dark:text-slate-300",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-100/5 text-gray-700 dark:text-slate-300",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 dark:from-red-500 dark:to-red-400 dark:hover:from-red-600 dark:hover:to-red-500 text-white",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "active-press";
  const widthClasses = fullWidth ? "w-full" : "";
  return href ? (
    <Link
      href={href}
      className={cn(
        "active-press",
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        widthClasses,
        className
      )}
    >
      {icon && (
        <div className={align == "center" && fullWidth ? "-ml-5" : ""}>
          {icon}
        </div>
      )}
      {children}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        widthClasses,
        className
      )}
    >
      {icon && (
        <div className={align == "center" && fullWidth ? "-ml-5" : ""}>
          {loading ? <Loader2Icon size={18} className="animate-spin" /> : icon}
        </div>
      )}
      {children}
    </button>
  );
}
