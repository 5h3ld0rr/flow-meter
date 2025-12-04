"use server";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/lib/schemas/customer";
import {
  checkEmailExists,
  getCustomerCount,
  getCustomerIdByCustomerId,
  createCustomerRecord,
  updateCustomerRecord,
  deleteCustomerRecord,
} from "@/lib/queries/customers";
import { logActivity } from "../queries/activity";

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
      return {
        success: false,
        message: validationResult.error.issues.map((issue) => issue.message),
      };
    }

    const data = validationResult.data;

    const emailExists = await checkEmailExists(data.email);
    if (emailExists) {
      return { success: false, message: "Email already exists" };
    }

    const customerCount = await getCustomerCount();
    const customerId = `C${String(customerCount + 1).padStart(3, "0")}`;

    await createCustomerRecord({
      customerId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });

    const newCustomerId = await getCustomerIdByCustomerId(customerId);

    if (newCustomerId) {
      await logActivity("customer", newCustomerId, "New customer registered");
    }

    return { success: true, message: "Customer created successfully" };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, message: "Failed to create customer" };
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

    const data = validationResult.data;
    await updateCustomerRecord(data);

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
    await deleteCustomerRecord(id);

    return { success: true, message: "Customer deleted successfully" };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, message: "Failed to delete customer" };
  }
};
