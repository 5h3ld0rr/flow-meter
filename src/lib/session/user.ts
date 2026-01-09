import "server-only";
import { query } from "@/lib/db";
import { decrypt } from "./jwt";
import { getSession } from "./cookie";

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload || !payload.userId) return null;

  const result = await query<User>(
    "SELECT id, email, full_name, role, created_at FROM Users WHERE id = @id",
    { id: payload.userId }
  );

  return result.recordset[0] || null;
};

export const isAuthorized = async (allowedRoles: string[]) => {
  const user = await getCurrentUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const verifySession = async () => {
  const session = await getSession();
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload || !payload.userId) return null;

  return payload;
};
