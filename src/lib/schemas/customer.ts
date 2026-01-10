import { z } from "zod";

const phoneRegex = /^\+?[\d\s\-()]+$/;

export const customerDbSchema = z.object({
  customer_id: z.string("Invalid customer ID"),
  name: z.string().min(2).max(100),
  email: z.email("Invalid email"),
  phone: z
    .string()
    .regex(phoneRegex)
    .refine(
      (p) => /^\+?\d{10,15}$/.test(p.replace(/\D/g, "")),
      "Invalid phone"
    ),
  address: z.string().min(5, "Invalid address").max(500, "Invalid address"),
  status: z.enum(["active", "inactive", "overdue"] as [string, ...string[]], {
    message: "Invalid status",
  }),
  type: z.enum(
    ["household", "business", "government"] as [string, ...string[]],
    {
      message: "Invalid customer type",
    }
  ),
  balance: z.number("Invalid balance"),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createCustomerSchema = customerDbSchema.pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  type: true,
});

export const updateCustomerSchema = createCustomerSchema.extend({
  customer_id: customerDbSchema.shape.customer_id,
});

export type Customer = z.infer<typeof customerDbSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
