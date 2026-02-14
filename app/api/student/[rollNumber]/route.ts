import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth-server";

const normalizeBranch = (value: string | undefined) =>
  (value || "").trim().toUpperCase();

const mapProfile = (doc: Record<string, unknown>) => ({
  fullName: String(doc["Full name"] || ""),
  email: String(doc["Email"] || ""),
  phone: String(doc["Phone"] || ""),
  dob: String(doc["Date of Birth"] || ""),
  address: String(doc["Address"] || ""),
  rollNumber: String(doc["Roll no"] || ""),
  year: String(doc["Year"] || ""),
  branch: String(doc["Branch"] || ""),
  section: String(doc["Section"] || ""),
  parentName: String(doc["Parent Name"] || ""),
  parentPhone: String(doc["Parent Phone"] || ""),
  leetcode: String(doc["LeetCode"] || ""),
  codeforces: String(doc["CodeForces"] || ""),
  hackerrank: String(doc["HackerRank"] || ""),
  codechef: String(doc["CodeChef"] || ""),
});

const mapAcademic = (doc: Record<string, unknown>) => {
  const entries = Object.entries(doc)
    .filter(([key]) => key !== "_id" && key !== "Full name")
    .map(([name, value]) => ({
      name,
      score: value,
    }));

  return { subjects: entries };
};

const mapCategoryEntries = (doc: Record<string, unknown>) => {
  return Object.entries(doc)
    .filter(([key]) => key !== "_id" && key !== "Full name")
    .map(([category, value]) => {
      const text = String(value || "").trim();
      const normalized = text.toLowerCase();
      const entries = normalized === "none" || normalized === "n/a" || normalized === "na"
        ? []
        : text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && line.toLowerCase() !== "none");
      return { category, entries };
    });
};

async function checkAuth(request: NextRequest, rollNumber: string) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return [false, NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
  }

  if (auth.role === "student" && auth.rollNumber !== rollNumber) {
    return [false, NextResponse.json({ error: "Forbidden" }, { status: 403 })];
  }

  const db = await getDb();
  const profiles = db.collection("sProfile");
  const profileDoc = await profiles.findOne({ "Roll no": rollNumber });

  if (!profileDoc) {
    return [false, NextResponse.json({ error: "Student not found" }, { status: 404 })];
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
      return [false, NextResponse.json({ error: "Forbidden" }, { status: 403 })];
    }
  }

  return [true, null];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const rollNumber = decodeURIComponent(resolvedParams.rollNumber || "").trim();
  if (!rollNumber) {
    return NextResponse.json({ error: "Missing roll number" }, { status: 400 });
  }

  if (auth.role === "student" && auth.rollNumber !== rollNumber) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const profiles = db.collection("sProfile");
  const academics = db.collection("sAcademics");
  const cocirculars = db.collection("sCociruculars");
  const ecirculars = db.collection("sEcirculars");

  const profileDoc = await profiles.findOne({ "Roll no": rollNumber });
  if (!profileDoc) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const fullName = String(profileDoc["Full name"] || "");
  
  // Try fullName match first, fallback to rollNumber if not found
  let academicDoc = await academics.findOne({ "Full name": fullName });
  if (!academicDoc) {
    academicDoc = await academics.findOne({ "Roll no": rollNumber });
  }

  let cocircularDoc = await cocirculars.findOne({ "Full name": fullName });
  if (!cocircularDoc) {
    cocircularDoc = await cocirculars.findOne({ "Roll no": rollNumber });
  }

  let ecircularDoc = await ecirculars.findOne({ "Full name": fullName });
  if (!ecircularDoc) {
    ecircularDoc = await ecirculars.findOne({ "Roll no": rollNumber });
  }

  return NextResponse.json({
    profile: mapProfile(profileDoc as Record<string, unknown>),
    academics: academicDoc ? mapAcademic(academicDoc as Record<string, unknown>) : { subjects: [] },
    cocirculars: cocircularDoc
      ? { categories: mapCategoryEntries(cocircularDoc as Record<string, unknown>) }
      : { categories: [] },
    ecirculars: ecircularDoc
      ? { categories: mapCategoryEntries(ecircularDoc as Record<string, unknown>) }
      : { categories: [] },
  });
}



export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Please use /api/student/[rollNumber]/update for PATCH requests" },
    { status: 400 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Please use /api/student/[rollNumber]/[section] for DELETE requests" },
    { status: 400 }
  );
}
