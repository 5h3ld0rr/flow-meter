import { z } from "zod";

/**
 * Customer validation schemas using Zod
 */

// Phone number regex - allows various formats
const phoneRegex = /^\+?[\d\s\-()]+$/;

// Base customer schema
export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters"),

  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .refine(
      (phone) => phone.replace(/\D/g, "").length >= 10,
      "Phone number must have at least 10 digits"
    ),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters"),
});

// Schema for creating a new customer
export const createCustomerSchema = customerSchema;

// Schema for updating a customer (all fields optional)
export const updateCustomerSchema = customerSchema.partial().extend({
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

// Type exports
export type CustomerInput = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
