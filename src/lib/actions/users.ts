"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hashPassword } from "../utils";

export type UserActionState =
  | {
      success: boolean;
      message: string;
    }
  | undefined;

export const createUser = async (data: {
  email: string;
  full_name: string;
  employee_id: string;
  password: string;
  role: "admin" | "staff" | "officer" | "cashier" | "manager";
}) => {
  try {
    const password_hash = hashPassword(data.password);

    await query(
      `INSERT INTO Users (email, password_hash, full_name, employee_id, role) 
       VALUES (@email, @password_hash, @full_name, @employee_id, @role)`,
      {
        email: data.email,
        password_hash,
        full_name: data.full_name,
        employee_id: data.employee_id,
        role: data.role,
      }
    );

    revalidatePath("/UMS/Settings");
    revalidatePath("/UMS/Users");
    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message:
        "Failed to create user (email or employee ID might already exist)",
    };
  }
};

export const createUserAction = async (
  state: UserActionState,
  formData: FormData
) => {
  const email = formData.get("email") as string;
  const full_name = formData.get("full_name") as string;
  const employee_id = formData.get("employee_id") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as
    | "admin"
    | "staff"
    | "officer"
    | "cashier"
    | "manager";

  if (
    !email ||
    !full_name ||
    !employee_id ||
    !password ||
    !confirmPassword ||
    !role
  ) {
    return { success: false, message: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  }

  return await createUser({ email, full_name, employee_id, password, role });
};

export const updateUser = async (
  userId: number,
  data: {
    email: string;
    full_name: string;
    role: "admin" | "staff" | "officer" | "cashier" | "manager";
    password?: string;
  },
  currentUserId: number
) => {
  try {
    // 1. Prevent self-role changing (Admin can't demote themselves)
    if (userId === currentUserId) {
      const currentUserResult = await query<{ role: string }>(
        "SELECT role FROM Users WHERE id = @userId",
        { userId }
      );
      if (
        currentUserResult.recordset[0]?.role === "admin" &&
        data.role !== "admin"
      ) {
        return {
          success: false,
          message: "You cannot change your own admin role",
        };
      }
    }

    // 2. If trying to change role FROM admin, check if it's the last admin
    if (data.role !== "admin") {
      const oldUser = await query<{ role: string }>(
        "SELECT role FROM Users WHERE id = @userId",
        { userId }
      );
      if (oldUser.recordset[0]?.role === "admin") {
        const adminCount = await query<{ count: number }>(
          "SELECT COUNT(*) as count FROM Users WHERE role = 'admin'"
        );
        if (adminCount.recordset[0].count <= 1) {
          return {
            success: false,
            message: "Cannot remove the last administrator",
          };
        }
      }
    }

    let password_hash: string | null = null;
    if (data.password) {
      password_hash = hashPassword(data.password);
    }

    const setClauses = [
      "email = @email",
      "full_name = @full_name",
      "role = @role",
      "updated_at = GETUTCDATE()",
    ];

    const params: Record<string, unknown> = {
      userId,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
    };

    if (password_hash) {
      setClauses.push("password_hash = @password_hash");
      params.password_hash = password_hash;
    }

    await query(
      `UPDATE Users SET ${setClauses.join(", ")} WHERE id = @userId`,
      params
    );

    revalidatePath("/UMS/Settings");
    revalidatePath("/UMS/Users");
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user" };
  }
};

export const updateUserAction = async (
  state: UserActionState,
  formData: FormData
) => {
  const userId = parseInt(formData.get("userId") as string);
  const currentUserId = parseInt(formData.get("currentUserId") as string);
  const email = formData.get("email") as string;
  const full_name = formData.get("full_name") as string;
  const role = formData.get("role") as
    | "admin"
    | "staff"
    | "officer"
    | "cashier"
    | "manager";
  const password = formData.get("password") as string;

  if (!userId || !email || !full_name || !role) {
    return {
      success: false,
      message: "All fields except password are required",
    };
  }

  const data = {
    email,
    full_name,
    role,
    password: password || undefined,
  };

  return await updateUser(userId, data, currentUserId);
};

export const deleteUser = async (userId: string) => {
  try {
    // Check if it's the last admin
    const adminCount = await query<{ count: number }>(
      "SELECT COUNT(*) as count FROM Users WHERE role = 'admin'"
    );

    const user = await query<{ role: string }>(
      "SELECT role FROM Users WHERE id = @userId",
      { userId }
    );

    if (
      user.recordset[0]?.role === "admin" &&
      adminCount.recordset[0].count <= 1
    ) {
      return {
        success: false,
        message: "Cannot delete the last administrator",
      };
    }

    await query("DELETE FROM Users WHERE id = @userId", { userId });
    revalidatePath("/UMS/Settings");
    revalidatePath("/UMS/Users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Verify current password
    const user = await query<{ password_hash: string }>(
      "SELECT password_hash FROM Users WHERE id = @userId",
      { userId }
    );

    if (!user.recordset[0]) {
      return { success: false, message: "User not found" };
    }

    const currentPasswordHash = hashPassword(currentPassword);
    if (currentPasswordHash !== user.recordset[0].password_hash) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Update to new password
    const newPasswordHash = hashPassword(newPassword);
    await query(
      "UPDATE Users SET password_hash = @password_hash, updated_at = GETUTCDATE() WHERE id = @userId",
      { userId, password_hash: newPasswordHash }
    );

    revalidatePath("/UMS/Settings");
    revalidatePath("/UMS/Users");
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Failed to change password" };
  }
};

export const changePasswordAction = async (
  state: UserActionState,
  formData: FormData
) => {
  const userId = parseInt(formData.get("userId") as string);
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!userId || !currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match" };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  }

  return await changePassword(userId, currentPassword, newPassword);
};
