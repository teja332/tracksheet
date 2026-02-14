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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string; section: string }> }
) {
  try {
    const resolvedParams = await params;
    const rollNumber = decodeURIComponent(resolvedParams.rollNumber || "").trim();
    const section = decodeURIComponent(resolvedParams.section || "").trim();

    if (!rollNumber) {
      return NextResponse.json({ error: "Missing roll number" }, { status: 400 });
    }

    if (!section) {
      return NextResponse.json({ error: "Missing section" }, { status: 400 });
    }

    const { authorized, error, profileDoc } = await checkAuth(request, rollNumber);
    if (!authorized || !profileDoc) {
      const statusCode = error === "Unauthorized" ? 401 : error === "Forbidden" ? 403 : 404;
      return NextResponse.json({ error }, { status: statusCode });
    }

    const db = await getDb();
    const fullName = String(profileDoc["Full name"] || "");

    // Map sections to collections
    const collectionMap: Record<string, { collection: string; query: Record<string, unknown> }> = {
      profile: {
        collection: "sProfile",
        query: { "Roll no": rollNumber },
      },
      academic: {
        collection: "sAcademics",
        query: fullName ? { "Full name": fullName } : { "Roll no": rollNumber },
      },
      cocircular: {
        collection: "sCociruculars",
        query: fullName ? { "Full name": fullName } : { "Roll no": rollNumber },
      },
      extracircular: {
        collection: "sEcirculars",
        query: fullName ? { "Full name": fullName } : { "Roll no": rollNumber },
      },
    };

    const config = collectionMap[section];
    if (!config) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const collection = db.collection(config.collection);
    const result = await collection.deleteOne(config.query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Student data not found" }, { status: 404 });
    }
    // If deleting profile section, also delete user entry
    if (section === "profile") {
      const usersCollection = db.collection("users")
      await usersCollection.deleteOne({ email: String(profileDoc["Email"] || "") })
    }
    return NextResponse.json({ success: true, message: `${section} deleted successfully` });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
