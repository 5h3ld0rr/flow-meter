import { cn } from "@/lib/utils";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "date";
  name?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
}
export function Input({
  type = "text",
  name,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  className = "",
  icon,
}: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 z-40">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg glass text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-text-slate-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-blue-500 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
            icon ? "pl-10" : "",
            error ? "ring-2 ring-red-500" : ""
          )}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
