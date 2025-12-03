interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleProps) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
          block w-14 h-8 rounded-full transition-smooth
          ${
            checked
              ? "bg-gradient"
              : "bg-gray-400/30 dark:border dark:border-dark-border"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        >
          <div
            className={`
            absolute left-1 top-1 bg-white dark:bg-dark-text-primary w-6 h-6 rounded-full transition-smooth shadow-md
            ${checked ? "transform translate-x-6" : ""}
          `}
          />
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-dark-text-primary">
          {label}
        </span>
      )}
    </label>
  );
}
