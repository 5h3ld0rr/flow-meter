import "server-only";
import { cookies } from "next/headers";
import { encrypt } from "./jwt";

export const createSession = async (
  userId: string,
  role: string,
  userName: string
) => {
  const session = await encrypt({ userId, role, userName });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const deleteSession = async () => {
  (await cookies()).delete("session");
};

export const getSession = async () => {
  const cookie = (await cookies()).get("session")?.value;
  return cookie;
};
