import "server-only";
import { decrypt } from "./jwt";
import { getSession } from "./cookie";

export const isAuthorized = async (allowedRoles: string[]) => {
  const user = await verifySession();
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
