import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
  role: "student" | "staff";
  rollNumber?: string;
  staffId?: string;
  email: string;
};

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET in environment");
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, jwtSecret) as AuthTokenPayload;
}
