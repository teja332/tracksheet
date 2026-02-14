import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getAuthFromRequest } from "@/lib/auth-server"
// @ts-ignore
import bcrypt from "bcryptjs"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)
    if (!auth || auth.role !== "staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type - only Excel files
    const validExtensions = [".xlsx", ".xls", ".csv"]
    const fileName = file.name.toLowerCase()
    const isValidFile = validExtensions.some((ext) => fileName.endsWith(ext))

    if (!isValidFile) {
      return NextResponse.json(
        { error: "Invalid file type. Only .xlsx, .xls, and .csv files are allowed" },
        { status: 400 }
      )
    }

    // Read file buffer
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Parse Excel file
    const workbook = XLSX.read(uint8Array, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 })
    }

    const db = await getDb()
    const profileCollection = db.collection("sProfile")
    const academicCollection = db.collection("sAcademics")
    const cocircularCollection = db.collection("sCociruculars")
    const extracircularCollection = db.collection("sEcirculars")
    const usersCollection = db.collection("users")

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Process each row
    for (const row of data) {
      try {
        // Extract and validate required fields from Excel (case-insensitive)
        const rowData = row as Record<string, any>
        const fullName =
          rowData["Full name"] ||
          rowData["full name"] ||
          rowData["Full Name"] ||
          rowData["name"] ||
          rowData["Name"] ||
          ""
        const rollNumber =
          rowData["Roll no"] || rowData["roll no"] || rowData["Roll No"] || rowData["rollNumber"] || ""
        const email = rowData["Email"] || rowData["email"] || rowData["EMAIL"] || ""

        if (!fullName || !rollNumber || !email) {
          errors.push(
            `Row skipped: Missing required fields (Full name, Roll no, Email)`
          )
          errorCount++
          continue
        }

        // Check if student already exists
        const existingStudent = await profileCollection.findOne({
          "Roll no": String(rollNumber),
        })
        if (existingStudent) {
          errors.push(`Row skipped: Student with roll number ${rollNumber} already exists`)
          errorCount++
          continue
        }

        // Extract optional fields
        const phone = rowData["Phone"] || rowData["phone"] || ""
        const dob = rowData["Date of Birth"] || rowData["DoB"] || rowData["dob"] || ""
        const address = rowData["Address"] || rowData["address"] || ""
        const year = rowData["Year"] || rowData["year"] || ""
        const branch = rowData["Branch"] || rowData["branch"] || ""
        const section = rowData["Section"] || rowData["section"] || ""
        const parentName = rowData["Parent Name"] || rowData["parent name"] || ""
        const parentPhone = rowData["Parent Phone"] || rowData["parent phone"] || ""
        const leetcode = rowData["LeetCode"] || rowData["leetcode"] || "username_here"
        const codeforces = rowData["CodeForces"] || rowData["codeforces"] || "username_here"
        const hackerrank = rowData["HackerRank"] || rowData["hackerrank"] || "username_here"
        const codechef = rowData["CodeChef"] || rowData["codechef"] || "username_here"

        // Create profile entry with all fields from Excel
        const profileData = {
          "Full name": String(fullName),
          "Roll no": String(rollNumber),
          Email: String(email),
          Phone: String(phone),
          "Date of Birth": String(dob),
          Address: String(address),
          Year: String(year),
          Branch: String(branch),
          Section: String(section),
          "Parent Name": String(parentName),
          "Parent Phone": String(parentPhone),
          LeetCode: String(leetcode),
          CodeForces: String(codeforces),
          HackerRank: String(hackerrank),
          CodeChef: String(codechef),
        }

        // Create academic entry
        const academicData = {
          "Full name": String(fullName),
          "Roll no": String(rollNumber),
          Mathematics: 0,
          Physics: 0,
          Chemistry: 0,
        }

        // Create co-curricular entry
        const cocircularData = {
          "Full name": String(fullName),
          "Roll no": String(rollNumber),
          Sports: "none",
          Cultural: "none",
          Technical: "none",
        }

        // Create extra-curricular entry
        const extracircularData = {
          "Full name": String(fullName),
          "Roll no": String(rollNumber),
          Clubs: "none",
          Competitions: "none",
          Events: "none",
        }

        // Hash password and create user entry
        const hashedPassword = await bcrypt.hash(String(email), 10)
        const userData = {
          email: String(email),
          password: hashedPassword,
          role: "student",
          rollNumber: String(rollNumber),
          fullName: String(fullName),
          createdAt: new Date(),
        }

        // Insert all data simultaneously
        await Promise.all([
          profileCollection.insertOne(profileData),
          academicCollection.insertOne(academicData),
          cocircularCollection.insertOne(cocircularData),
          extracircularCollection.insertOne(extracircularData),
          usersCollection.insertOne(userData),
        ])

        successCount++
      } catch (rowError) {
        errors.push(
          `Row error: ${rowError instanceof Error ? rowError.message : "Unknown error"}`
        )
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${successCount} students`,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
      total: data.length,
    })
  } catch (error) {
    console.error("Error uploading Excel:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
