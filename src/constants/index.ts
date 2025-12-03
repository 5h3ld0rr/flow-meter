import { Droplet, Flame, Zap } from "lucide-react";

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
export const CONSUMPTION_DATA = [
  {
    day: "Mon",
    electricity: 4200,
    water: 2400,
    gas: 1800,
  },
  {
    day: "Tue",
    electricity: 4500,
    water: 2600,
    gas: 1900,
  },
  {
    day: "Wed",
    electricity: 4100,
    water: 2300,
    gas: 1700,
  },
  {
    day: "Thu",
    electricity: 4800,
    water: 2800,
    gas: 2100,
  },
  {
    day: "Fri",
    electricity: 4600,
    water: 2700,
    gas: 2000,
  },
  {
    day: "Sat",
    electricity: 3900,
    water: 2200,
    gas: 1600,
  },
  {
    day: "Sun",
    electricity: 3700,
    water: 2100,
    gas: 1500,
  },
];
export const RECENT_ACTIVITIES = [
  {
    id: 1,
    customer: "John Smith",
    action: "Payment received",
    amount: "$125.50",
    time: "5 min ago",
    type: "success",
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    action: "New meter reading",
    value: "1,245 kWh",
    time: "12 min ago",
    type: "info",
  },
  {
    id: 3,
    customer: "Mike Wilson",
    action: "Bill generated",
    amount: "$89.00",
    time: "25 min ago",
    type: "info",
  },
  {
    id: 4,
    customer: "Emily Davis",
    action: "Payment overdue",
    amount: "$156.75",
    time: "1 hour ago",
    type: "warning",
  },
];
export const TOP_CONSUMERS = [
  {
    name: "Industrial Park A",
    consumption: "45,230 kWh",
    change: "+12%",
  },
  {
    name: "Shopping Mall B",
    consumption: "38,450 kWh",
    change: "+8%",
  },
  {
    name: "Residential Complex C",
    consumption: "32,100 kWh",
    change: "-3%",
  },
  {
    name: "Office Tower D",
    consumption: "28,900 kWh",
    change: "+5%",
  },
];

export const METERS = [
  {
    id: "M001",
    type: "electricity",
    serial: "ELC-2024-001",
    customer: "John Smith",
    location: "123 Main St",
    status: "active",
    lastReading: "1,245 kWh",
    installDate: "2024-01-15",
  },
  {
    id: "M002",
    type: "water",
    serial: "WTR-2024-002",
    customer: "Sarah Johnson",
    location: "456 Oak Ave",
    status: "active",
    lastReading: "3,450 L",
    installDate: "2024-02-20",
  },
  {
    id: "M003",
    type: "gas",
    serial: "GAS-2024-003",
    customer: "Mike Wilson",
    location: "789 Pine Rd",
    status: "maintenance",
    lastReading: "890 m³",
    installDate: "2024-03-10",
  },
];

export const READINGS = [
  {
    date: "2024-01-15",
    meter: "ELC-2024-001",
    reading: "1,245 kWh",
    consumption: "245 kWh",
    status: "submitted",
  },
  {
    date: "2024-01-14",
    meter: "WTR-2024-002",
    reading: "3,450 L",
    consumption: "450 L",
    status: "submitted",
  },
  {
    date: "2024-01-13",
    meter: "GAS-2024-003",
    reading: "890 m³",
    consumption: "90 m³",
    status: "pending",
  },
];

export const PAYMENTS = [
  {
    id: "PAY001",
    date: "2024-01-15",
    customer: "John Smith",
    billId: "BILL-001",
    amount: 125.5,
    method: "Card",
    status: "completed",
  },
  {
    id: "PAY002",
    date: "2024-01-14",
    customer: "Sarah Johnson",
    billId: "BILL-002",
    amount: 89.0,
    method: "Cash",
    status: "completed",
  },
  {
    id: "PAY003",
    date: "2024-01-13",
    customer: "Mike Wilson",
    billId: "BILL-003",
    amount: 156.75,
    method: "Online",
    status: "pending",
  },
];

export const REVENUE_DATA = [
  {
    month: "Jan",
    revenue: 18500,
    target: 20000,
  },
  {
    month: "Feb",
    revenue: 21200,
    target: 20000,
  },
  {
    month: "Mar",
    revenue: 19800,
    target: 20000,
  },
  {
    month: "Apr",
    revenue: 23400,
    target: 22000,
  },
  {
    month: "May",
    revenue: 24100,
    target: 22000,
  },
  {
    month: "Jun",
    revenue: 22800,
    target: 22000,
  },
];
export const REGIONAL_DATA = [
  {
    region: "North",
    customers: 845,
    consumption: 89450,
    revenue: 13418,
  },
  {
    region: "South",
    customers: 723,
    consumption: 76230,
    revenue: 11435,
  },
  {
    region: "East",
    customers: 654,
    consumption: 68900,
    revenue: 10335,
  },
  {
    region: "West",
    customers: 625,
    consumption: 65420,
    revenue: 9813,
  },
];
