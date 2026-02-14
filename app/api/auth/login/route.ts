import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { signAuthToken } from "@/lib/auth";
import { getAuthCookieName } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const emailRaw = body?.email;
  const password = body?.password;

  if (!emailRaw || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const email = String(emailRaw).trim().toLowerCase();
  const db = await getDb();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash as string);
  if (!passwordOk) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const role = user.role as "student" | "staff";
  const rollNumber = user.rollNumber as string | undefined;
  const staffId = user.staffId as string | undefined;

  const token = signAuthToken({
    role,
    rollNumber,
    staffId,
    email,
  });

  const response = NextResponse.json({
    role,
    rollNumber,
    staffId,
    email,
  });

  response.cookies.set(getAuthCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
