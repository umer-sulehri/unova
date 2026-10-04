import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "unova_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const TOKEN_SECRET = "unova-admin-session-v1";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "unova-admin";
}

// Token is derived from the password, so changing ADMIN_PASSWORD
// automatically invalidates any existing sessions.
export function sessionToken(): string {
  return createHash("sha256")
    .update(`${adminPassword()}::${TOKEN_SECRET}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(candidate: string): boolean {
  return safeEqual(candidate, adminPassword());
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  return safeEqual(token, sessionToken());
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
