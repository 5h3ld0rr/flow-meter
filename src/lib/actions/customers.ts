"use server";

/**
 * Server Actions for Customer Mutations
 * Contains all INSERT/UPDATE/DELETE operations for customers
 */

import { query } from "@/lib/db";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/lib/schemas/customer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkEmailExists,
  getCustomerCount,
  getCustomerIdByCustomerId,
} from "@/lib/data/customers";

export async function createCustomer(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  try {
    // Validate with Zod
    const validationResult = createCustomerSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const data = validationResult.data;

    // Check if email exists
    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      return { success: false, error: "Email already exists" };
    }

    // Generate customer ID
    const customerCount = await getCustomerCount();
    const customerId = `C${String(customerCount + 1).padStart(3, "0")}`;

    // Insert customer
    await query(
      `INSERT INTO Customers (customer_id, name, email, phone, address, status, balance)
       VALUES (@customerId, @name, @email, @phone, @address, 'active', 0.00)`,
      {
        customerId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      }
    );

    // Get the newly created customer's ID
    const newCustomerId = await getCustomerIdByCustomerId(customerId);

    // Log activity
    if (newCustomerId) {
      await query(
        `INSERT INTO Activities (activity_type, description, customer_id)
         VALUES ('customer', 'New customer registered', @customerId)`,
        { customerId: newCustomerId }
      );
    }

    revalidatePath("/UMS/Customers");
    redirect("/UMS/Customers");
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Failed to create customer" };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  try {
    const rawData = {
      name: (formData.get("name") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      status: (formData.get("status") as string) || undefined,
    };

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([, v]) => v !== undefined)
    );

    // Validate with Zod
    const validationResult = updateCustomerSchema.safeParse(cleanData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const data = validationResult.data;

    if (Object.keys(data).length === 0) {
      return { success: false, error: "No fields to update" };
    }

    const updates: string[] = [];
    const params: Record<string, string | number> = { id };

    if (data.name) {
      updates.push("name = @name");
      params.name = data.name;
    }

    if (data.email) {
      updates.push("email = @email");
      params.email = data.email;
    }

    if (data.phone) {
      updates.push("phone = @phone");
      params.phone = data.phone;
    }

    if (data.address) {
      updates.push("address = @address");
      params.address = data.address;
    }

    if (data.status) {
      updates.push("status = @status");
      params.status = data.status;
    }

    updates.push("updated_at = GETDATE()");

    await query(
      `UPDATE Customers SET ${updates.join(", ")} WHERE customer_id = @id`,
      params
    );

    revalidatePath("/UMS/Customers");
    return { success: true };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Failed to update customer" };
  }
}

export async function deleteCustomer(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await query(
      `UPDATE Customers SET status = 'inactive', updated_at = GETDATE() WHERE customer_id = @id`,
      { id }
    );

    revalidatePath("/UMS/Customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
