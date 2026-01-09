import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (
  password: string,
  password_hash: string
): boolean => {
  return bcrypt.compareSync(password, password_hash);
};
