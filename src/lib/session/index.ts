import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type Session = {
  userId: string;
};

export async function createSession(userId: string) {
  const session = await encrypt({ userId });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function encrypt(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error: unknown) {
    console.log("Failed to verify session");
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
