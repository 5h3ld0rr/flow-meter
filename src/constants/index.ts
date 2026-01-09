import {
  Banknote,
  Briefcase,
  Droplet,
  Flame,
  MapPin,
  Shield,
  Users,
  Zap,
} from "lucide-react";

export const UTILITIES = {
  electricity: {
    name: "Electricity",
    textClassName: "text-yellow-700 dark:text-yellow-400",
    backgroundClassName: "bg-yellow-100 dark:bg-yellow-900/20",
    color: "oklch(79.5% 0.184 86.047)",
    icon: Zap,
    unit: "kWh",
  },
  water: {
    name: "Water",
    textClassName: "text-blue-700  dark:text-blue-400",
    backgroundClassName: "bg-blue-100 dark:bg-blue-900/20",
    color: "oklch(62.3% 0.214 259.815)",
    icon: Droplet,
    unit: "L",
  },
  gas: {
    name: "Gas",
    textClassName: "text-orange-700  dark:text-orange-400",
    backgroundClassName: "bg-orange-100 dark:bg-orange-900/20",
    color: "oklch(70.5% 0.213 47.604)",
    icon: Flame,
    unit: "m³",
  },
};

export const ROLES = {
  admin: {
    label: "Administrator",
    icon: Shield,
    badgeVariant: "info" as const,
    iconClass: "text-blue-500",
  },
  staff: {
    label: "Administrative Staff",
    icon: Users,
    badgeVariant: "success" as const,
    iconClass: "text-green-500",
  },
  officer: {
    label: "Field Officer / Meter Reader",
    icon: MapPin,
    badgeVariant: "orange" as const,
    iconClass: "text-orange-500",
  },
  cashier: {
    label: "Cashier / Billing Clerk",
    icon: Banknote,
    badgeVariant: "warning" as const,
    iconClass: "text-yellow-500",
  },
  manager: {
    label: "Manager / Decision Maker",
    icon: Briefcase,
    badgeVariant: "purple" as const,
    iconClass: "text-purple-500",
  },
};
