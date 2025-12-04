import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const verifyPassword = (
  password: string,
  password_hash: string
): boolean => {
  return bcrypt.compareSync(password, password_hash);
};
