import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth-server";

const normalizeBranch = (value: string | undefined) =>
  (value || "").trim().toUpperCase();

async function checkAuth(request: NextRequest, rollNumber: string) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return { authorized: false, error: "Unauthorized" };
  }

  if (auth.role === "student" && auth.rollNumber !== rollNumber) {
    return { authorized: false, error: "Forbidden" };
  }

  const db = await getDb();
  const profiles = db.collection("sProfile");
  const profileDoc = await profiles.findOne({ "Roll no": rollNumber });

  if (!profileDoc) {
    return { authorized: false, error: "Student not found" };
  }

  if (auth.role === "staff") {
    const staffBranchMap = db.collection("staffBranchMap");
    const branches = db.collection("branches");
    const mapping = await staffBranchMap.findOne({ staffId: auth.staffId });
    const branch = mapping?.branchId
      ? await branches.findOne({ branchId: mapping.branchId })
      : null;
    const staffBranchKey = normalizeBranch(branch?.branchName || branch?.branchId);
    const studentBranchKey = normalizeBranch(String(profileDoc["Branch"] || ""));

    if (!staffBranchKey || staffBranchKey !== studentBranchKey) {
      return { authorized: false, error: "Forbidden" };
    }
  }

  return { authorized: true, profileDoc };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  try {
    const resolvedParams = await params;
    const rollNumber = decodeURIComponent(resolvedParams.rollNumber || "").trim();
    if (!rollNumber) {
      return NextResponse.json({ error: "Missing roll number" }, { status: 400 });
    }

    const { authorized, error } = await checkAuth(request, rollNumber);
    if (!authorized) {
      const statusCode = error === "Unauthorized" ? 401 : error === "Forbidden" ? 403 : 404;
      return NextResponse.json({ error }, { status: statusCode });
    }

    const url = new URL(request.url);
    const section = url.searchParams.get("section");
    const baseUrl = process.env.ML_SERVICE_URL || "http://localhost:8001";

    const mlResponse = await fetch(`${baseUrl}/insights/${encodeURIComponent(rollNumber)}`);
    if (!mlResponse.ok) {
      const text = await mlResponse.text().catch(() => "");
      return NextResponse.json(
        { error: text || "Failed to fetch ML insights" },
        { status: mlResponse.status }
      );
    }

    const data = await mlResponse.json();
    if (section && data[section]) {
      return NextResponse.json({ [section]: data[section], updatedAt: data.updatedAt });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
