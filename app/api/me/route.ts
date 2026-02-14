import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ userId: null }, { status: 200 });
  }

  return NextResponse.json({
    userId: auth.rollNumber || auth.staffId,
    role: auth.role,
    rollNumber: auth.rollNumber,
    staffId: auth.staffId,
    email: auth.email,
  });
}
