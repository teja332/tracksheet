import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getAuthFromRequest } from "@/lib/auth-server"
// @ts-ignore
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)
    if (!auth || auth.role !== "staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      fullName,
      rollNumber,
      email,
      phone,
      dob,
      address,
      year,
      branch,
      section,
      parentName,
      parentPhone,
      leetcode,
      codeforces,
      hackerrank,
      codechef,
    } = body

    // Validate required fields
    if (!fullName || !rollNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, rollNumber, email" },
        { status: 400 }
      )
    }

    const db = await getDb()

    // Check if student already exists
    const existingStudent = await db.collection("sProfile").findOne({ "Roll no": rollNumber })
    if (existingStudent) {
      return NextResponse.json({ error: "Student with this roll number already exists" }, { status: 400 })
    }

    // Create profile entry
    const profileData = {
      "Full name": fullName,
      "Roll no": rollNumber,
      Email: email,
      Phone: phone || "",
      "Date of Birth": dob || "",
      Address: address || "",
      Year: year || "",
      Branch: branch || "",
      Section: section || "",
      "Parent Name": parentName || "",
      "Parent Phone": parentPhone || "",
      LeetCode: leetcode || "username_here",
      CodeForces: codeforces || "username_here",
      HackerRank: hackerrank || "username_here",
      CodeChef: codechef || "username_here",
    }

    // Create empty academic entry
    const academicData = {
      "Full name": fullName,
      "Roll no": rollNumber,
      // Placeholder subjects - staff can edit these later
      "Mathematics": 0,
      "Physics": 0,
      "Chemistry": 0,
    }

    // Create empty co-curricular entry
    const cocircularData = {
      "Full name": fullName,
      "Roll no": rollNumber,
      "Sports": "none",
      "Cultural": "none",
      "Technical": "none",
    }

    // Create empty extra-curricular entry
    const extracircularData = {
      "Full name": fullName,
      "Roll no": rollNumber,
      "Clubs": "none",
      "Competitions": "none",
      "Events": "none",
    }

    // Insert into all collections
    const profileCollection = db.collection("sProfile")
    const academicCollection = db.collection("sAcademics")
    const cocircularCollection = db.collection("sCociruculars")
    const extracircularCollection = db.collection("sEcirculars")
    const usersCollection = db.collection("users")

    // Hash password with bcrypt (basic password: student email)
    const hashedPassword = await bcrypt.hash(email, 10)

    // Create user entry for login
    const userData = {
      email,
      password: hashedPassword,
      role: "student",
      rollNumber,
      fullName,
      createdAt: new Date(),
    }

    await Promise.all([
      profileCollection.insertOne(profileData),
      academicCollection.insertOne(academicData),
      cocircularCollection.insertOne(cocircularData),
      extracircularCollection.insertOne(extracircularData),
      usersCollection.insertOne(userData),
    ])

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student: {
        rollNumber,
        fullName,
        email,
        year: year || "N/A",
        branch: branch || "N/A",
        section: section || "N/A",
      },
    })
  } catch (error) {
    console.error("Error adding student:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
