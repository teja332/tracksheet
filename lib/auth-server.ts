import { NextRequest } from "next/server";
import { AuthTokenPayload, verifyAuthToken } from "./auth";

const COOKIE_NAME = "tracksheet_token";

export function getAuthFromRequest(request: NextRequest): AuthTokenPayload | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifyAuthToken(token);
  } catch {
    return null;
  }
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}
