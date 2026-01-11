import { JWTPayload } from "jose";

declare global {
  type utilityType = "electricity" | "water" | "gas";

  interface User {
    id: number;
    employee_id: string;
    email: string;
    password_hash: string;
    full_name: string;
    role: "admin" | "staff" | "officer" | "cashier" | "manager";
    created_at: Date;
    updated_at: Date;
  }

  interface Customer {
    customer_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: "active" | "inactive" | "overdue";
    type: "household" | "business" | "government";
    balance: number;
    created_at: Date;
    updated_at: Date;
  }

  interface Meter {
    meter_id: string;
    serial_number: string;
    customer_id: number;
    utility_type: utilityType;
    location: string;
    status: "active" | "inactive" | "maintenance";
    install_date: Date;
    last_reading_value: number | null;
    last_reading_date: Date | null;
    created_at: Date;
    updated_at: Date;
  }

  interface Reading {
    id: number;
    meter_id: string;
    reading_value: number;
    reading_date: Date;
    consumption: number;
    notes: string | null;
    created_by: number;
    created_at: Date;
  }

  interface Tariff {
    id: number;
    utility_type: utilityType;
    customer_type: "household" | "business" | "government";
    rate_per_unit: number;
    tax_percentage: number;
    effective_from: Date;
    effective_to: Date | null;
    created_at: Date;
  }

  interface Bill {
    bill_id: string;
    customer_id: number;
    meter_id: number;
    billing_period_start: Date;
    billing_period_end: Date;
    previous_reading: number;
    current_reading: number;
    consumption: number;
    tariff_rate: number;
    base_amount: number;
    tax_amount: number;
    total_amount: number;
    due_date: Date;
    status: "draft" | "generated" | "sent" | "paid" | "overdue";
    created_at: Date;
    updated_at: Date;
  }

  interface Payment {
    payment_id: string;
    bill_id: number;
    customer_id: number;
    amount: number;
    payment_method: "cash" | "card" | "online" | "check";
    transaction_reference: string | null;
    payment_date: Date;
    status: "pending" | "completed" | "failed" | "refunded";
    notes: string | null;
    created_by: number;
    created_at: Date;
  }

  interface Activity {
    id: number;
    activity_type: "payment" | "reading" | "bill" | "customer" | "meter";
    description: string;
    customer_id: number | null;
    amount: number | null;
    metadata: string | null;
    created_at: Date;
  }

  interface RecordPaymentRequest {
    bill_id: number;
    amount: number;
    payment_method: "cash" | "card" | "online" | "check";
    transaction_reference?: string;
    payment_date: Date;
    notes?: string;
  }

  interface DashboardStats {
    totalCustomers: number;
    totalCustomersTrend: number;
    activeMeters: number;
    activeMetersTrend: number;
    monthlyRevenue: number;
    monthlyRevenueTrend: number;
    outstandingAmount: number;
    outstandingTrend: number;
  }

  interface ConsumptionData {
    day: string;
    electricity: number;
    water: number;
    gas: number;
  }

  interface TopConsumer {
    name: string;
    consumption: string;
    change: string;
  }

  interface RecentActivity {
    id: number;
    customer: string;
    action: string;
    amount?: string;
    value?: string;
    time: string;
    type: string;
  }

  interface UtilityDistribution {
    name: string;
    value: number;
    color: string;
  }

  interface SessionPayload extends JWTPayload {
    userId: string;
    role: string;
    userName: string;
  }
}

export {};
