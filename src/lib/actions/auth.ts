"use server";

import { redirect, RedirectType } from "next/navigation";
import { createSession, deleteSession } from "../session";
import { query } from "@/lib/db";
import { verifyPassword } from "@/lib/utils";

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

    await createSession(user.id.toString());
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
