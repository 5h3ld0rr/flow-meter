"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState, InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[];
  size?: "sm" | "md" | "lg";
}

export const Input = ({
  type = "text",
  name,
  placeholder,
  label,
  defaultValue,
  error,
  options = [],
  disabled = false,
  required = false,
  className = "",
  step,
  readOnly = false,
  icon,
  size = "md",
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 z-10">
            {icon}
          </div>
        )}
        {type === "select" ? (
          <select
            name={name}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            className={cn(
              "w-full cursor-pointer px-4 py-2.5 rounded-lg glass text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-text-slate-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-blue-500 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
              icon ? "pl-10" : "",
              error ? "ring-2 ring-red-500" : ""
            )}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-50 dark:bg-slate-900/80"
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            step={step}
            readOnly={readOnly}
            className={cn(
              "w-full rounded-lg glass text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-text-slate-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-blue-500 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              icon ? "pl-10" : "",
              type === "password" ? "pr-10" : "",
              error ? "ring-2 ring-red-500" : ""
            )}
            {...props}
          />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-smooth z-10"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
