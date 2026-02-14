import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/auth-server";

const normalizeBranch = (value: string | undefined) =>
  (value || "").trim().toUpperCase();

export async function GET(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth || auth.role !== "staff" || !auth.staffId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const staffBranchMap = db.collection("staffBranchMap");
  const branches = db.collection("branches");
  const profiles = db.collection("sProfile");

  const mapping = await staffBranchMap.findOne({ staffId: auth.staffId });
  if (!mapping?.branchId) {
    return NextResponse.json({ branch: null, students: [] });
  }

  const branch = await branches.findOne({ branchId: mapping.branchId });
  const branchKey = normalizeBranch(branch?.branchName || branch?.branchId);

  const studentDocs = await profiles
    .find({})
    .toArray();

  const students = studentDocs
    .filter((doc) => normalizeBranch(doc["Branch"]) === branchKey)
    .map((doc) => ({
      rollNumber: String(doc["Roll no"] || ""),
      fullName: String(doc["Full name"] || ""),
      email: String(doc["Email"] || ""),
      year: String(doc["Year"] || ""),
      section: String(doc["Section"] || ""),
      branch: String(doc["Branch"] || ""),
    }))
    .filter((student) => student.rollNumber);

  return NextResponse.json({
    branch: branchKey,
    students,
  });
}
