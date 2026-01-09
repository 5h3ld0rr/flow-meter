"use server";

import { redirect, RedirectType } from "next/navigation";
import { createSession, deleteSession, verifySession } from "../session";
import { query } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/utils";

export const login = async (state: unknown, formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const result = await query<User>(
      `SELECT id, email, password_hash, full_name, role 
       FROM Users 
       WHERE email = @email`,
      { email }
    );

    if (result.recordset.length === 0) {
      return { success: false, message: "Invalid email or password" };
    }

    const user = result.recordset[0];

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return { success: false, message: "Invalid email or password" };
    }

    await createSession(user.id.toString(), user.role);
  } catch (error) {
    console.log("Login error:", error);
    return { success: false, message: "Something went wrong" };
  }
  redirect("/UMS/Dashboard", RedirectType.replace);
};

export const logout = async () => {
  await deleteSession();
  redirect("/Login", RedirectType.replace);
};

export const changePassword = async (state: unknown, formData: FormData) => {
  try {
    const session = await verifySession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, message: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: "New passwords do not match" };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long",
      };
    }

    // Get current user's password hash
    const result = await query<{ password_hash: string }>(
      `SELECT password_hash FROM Users WHERE id = @userId`,
      { userId: session.userId }
    );

    if (result.recordset.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = result.recordset[0];

    // Verify current password
    const isValidPassword = await verifyPassword(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash new password and update
    const newPasswordHash = hashPassword(newPassword);
    await query(
      `UPDATE Users SET password_hash = @newPasswordHash WHERE id = @userId`,
      { newPasswordHash, userId: session.userId }
    );

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.log("Change password error:", error);
    return { success: false, message: "Something went wrong" };
  }
};
