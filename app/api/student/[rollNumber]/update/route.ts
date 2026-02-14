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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  try {
    const resolvedParams = await params;
    const rollNumber = decodeURIComponent(resolvedParams.rollNumber || "").trim();
    if (!rollNumber) {
      return NextResponse.json({ error: "Missing roll number" }, { status: 400 });
    }

    const { authorized, error, profileDoc } = await checkAuth(request, rollNumber);
    if (!authorized || !profileDoc) {
      const statusCode = error === "Unauthorized" ? 401 : error === "Forbidden" ? 403 : 404;
      return NextResponse.json({ error }, { status: statusCode });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "Missing section or data" }, { status: 400 });
    }

    const db = await getDb();
    const fullName = String(profileDoc["Full name"] || "");

    // Map section names to collection and field updates
    const collectionMap: Record<string, { collection: string; query: Record<string, unknown>; updates: Record<string, unknown> }> = {
      profile: {
        collection: "sProfile",
        query: { "Roll no": rollNumber },
        updates: {
          "Date of Birth": data.dob || undefined,
          "Address": data.address || undefined,
          "Parent Name": data.parentName || undefined,
          "Parent Phone": data.parentPhone || undefined,
          "Full name": data.fullName || undefined,
          "Email": data.email || undefined,
          "Phone": data.phone || undefined,
          "Year": data.year || undefined,
          "Branch": data.branch || undefined,
          "Section": data.section || undefined,
        },
      },
      academic: {
        collection: "sAcademics",
        query: fullName ? { "Full name": fullName } : { "Roll no": rollNumber },
        updates: data,
      },
      cocircular: {
        collection: "sCociruculars",
        query: fullName ? { "Full name": fullName } : { "Roll no": rollNumber },
        updates: data,
      },
      extracircular: {
        collection: "sEcirculars",
        query: fullName ? { "Full name": fullName } : { "Roll no": rollNumber },
        updates: data,
      },
      platforms: {
        collection: "sProfile",
        query: { "Roll no": rollNumber },
        updates: {
          "LeetCode": data.leetcode || undefined,
          "CodeForces": data.codeforces || undefined,
          "HackerRank": data.hackerrank || undefined,
          "CodeChef": data.codechef || undefined,
        },
      },
    };

    const config = collectionMap[section];
    if (!config) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const collection = db.collection(config.collection);
    const cleanedUpdates = Object.fromEntries(
      Object.entries(config.updates).filter(([_, v]) => v !== undefined)
    );

    const result = await collection.updateOne(config.query, { $set: cleanedUpdates });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Student data not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `${section} updated successfully` });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
