"use server";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/lib/schemas/customer";
import { query } from "@/lib/db";

export const createCustomer = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  try {
    const validationResult = createCustomerSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }

    const data = validationResult.data;

    // REFACTORED: Simple INSERT
    await query(
      `INSERT INTO Customers (name, email, phone, address, status, balance)
       VALUES (@name, @email, @phone, @address, 'active', 0.00)`,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      }
    );

    return { success: true, message: "Customer created successfully" };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Failed to create customer" };
  }
};

export const updateCustomer = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const rawData = {
      customer_id: formData.get("customer_id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    const validationResult = updateCustomerSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues.map((issue) => issue.message),
      };
    }

    const { customer_id, name, email, phone, address } = validationResult.data;

    // REFACTORED: Simple UPDATE
    await query(
      `UPDATE Customers 
       SET name = @name, 
           email = @email, 
           phone = @phone, 
           address = @address,
           updated_at = GETUTCDATE()
       WHERE customer_id = @customer_id`,
      { customer_id, name, email, phone, address }
    );

    return { success: true, message: "Customer updated successfully" };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, message: "Failed to update customer" };
  }
};

export const deleteCustomer = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // REFACTORED: Simple soft-delete UPDATE
    await query(
      `UPDATE Customers 
       SET status = 'inactive', 
           updated_at = GETUTCDATE() 
       WHERE customer_id = @id`,
      { id }
    );

    return { success: true, message: "Customer deleted successfully" };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, message: "Failed to delete customer" };
  }
};
