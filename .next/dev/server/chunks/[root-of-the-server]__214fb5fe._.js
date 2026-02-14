module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDb",
    ()=>getDb,
    "getMongoClient",
    ()=>getMongoClient
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Missing MONGODB_URI in environment");
}
let client = null;
let clientPromise = null;
async function getMongoClient() {
    if (client) return client;
    if (!clientPromise) {
        clientPromise = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri).connect();
    }
    client = await clientPromise;
    return client;
}
async function getDb() {
    const mongoClient = await getMongoClient();
    return mongoClient.db();
}
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signAuthToken",
    ()=>signAuthToken,
    "verifyAuthToken",
    ()=>verifyAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET in environment");
}
function signAuthToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn
    });
}
function verifyAuthToken(token) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, jwtSecret);
}
}),
"[project]/lib/auth-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthCookieName",
    ()=>getAuthCookieName,
    "getAuthFromRequest",
    ()=>getAuthFromRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
;
const COOKIE_NAME = "tracksheet_token";
function getAuthFromRequest(request) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAuthToken"])(token);
    } catch  {
        return null;
    }
}
function getAuthCookieName() {
    return COOKIE_NAME;
}
}),
"[project]/app/api/student/upload-excel/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-server.ts [app-route] (ecmascript)");
// @ts-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-route] (ecmascript)");
;
;
;
;
;
async function POST(request) {
    try {
        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(request);
        if (!auth || auth.role !== "staff") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No file provided"
            }, {
                status: 400
            });
        }
        // Validate file type - only Excel files
        const validExtensions = [
            ".xlsx",
            ".xls",
            ".csv"
        ];
        const fileName = file.name.toLowerCase();
        const isValidFile = validExtensions.some((ext)=>fileName.endsWith(ext));
        if (!isValidFile) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid file type. Only .xlsx, .xls, and .csv files are allowed"
            }, {
                status: 400
            });
        }
        // Read file buffer
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        // Parse Excel file
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"](uint8Array, {
            type: "array"
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(worksheet);
        if (!data || data.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Excel file is empty"
            }, {
                status: 400
            });
        }
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
        const profileCollection = db.collection("sProfile");
        const academicCollection = db.collection("sAcademics");
        const cocircularCollection = db.collection("sCociruculars");
        const extracircularCollection = db.collection("sEcirculars");
        const usersCollection = db.collection("users");
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        // Process each row
        for (const row of data){
            try {
                // Extract and validate required fields from Excel (case-insensitive)
                const rowData = row;
                const fullName = rowData["Full name"] || rowData["full name"] || rowData["Full Name"] || rowData["name"] || rowData["Name"] || "";
                const rollNumber = rowData["Roll no"] || rowData["roll no"] || rowData["Roll No"] || rowData["rollNumber"] || "";
                const email = rowData["Email"] || rowData["email"] || rowData["EMAIL"] || "";
                if (!fullName || !rollNumber || !email) {
                    errors.push(`Row skipped: Missing required fields (Full name, Roll no, Email)`);
                    errorCount++;
                    continue;
                }
                // Check if student already exists
                const existingStudent = await profileCollection.findOne({
                    "Roll no": String(rollNumber)
                });
                if (existingStudent) {
                    errors.push(`Row skipped: Student with roll number ${rollNumber} already exists`);
                    errorCount++;
                    continue;
                }
                // Extract optional fields
                const phone = rowData["Phone"] || rowData["phone"] || "";
                const dob = rowData["Date of Birth"] || rowData["DoB"] || rowData["dob"] || "";
                const address = rowData["Address"] || rowData["address"] || "";
                const year = rowData["Year"] || rowData["year"] || "";
                const branch = rowData["Branch"] || rowData["branch"] || "";
                const section = rowData["Section"] || rowData["section"] || "";
                const parentName = rowData["Parent Name"] || rowData["parent name"] || "";
                const parentPhone = rowData["Parent Phone"] || rowData["parent phone"] || "";
                const leetcode = rowData["LeetCode"] || rowData["leetcode"] || "username_here";
                const codeforces = rowData["CodeForces"] || rowData["codeforces"] || "username_here";
                const hackerrank = rowData["HackerRank"] || rowData["hackerrank"] || "username_here";
                const codechef = rowData["CodeChef"] || rowData["codechef"] || "username_here";
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
                    CodeChef: String(codechef)
                };
                // Create academic entry
                const academicData = {
                    "Full name": String(fullName),
                    "Roll no": String(rollNumber),
                    Mathematics: 0,
                    Physics: 0,
                    Chemistry: 0
                };
                // Create co-curricular entry
                const cocircularData = {
                    "Full name": String(fullName),
                    "Roll no": String(rollNumber),
                    Sports: "none",
                    Cultural: "none",
                    Technical: "none"
                };
                // Create extra-curricular entry
                const extracircularData = {
                    "Full name": String(fullName),
                    "Roll no": String(rollNumber),
                    Clubs: "none",
                    Competitions: "none",
                    Events: "none"
                };
                // Hash password and create user entry
                const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(String(email), 10);
                const userData = {
                    email: String(email),
                    password: hashedPassword,
                    role: "student",
                    rollNumber: String(rollNumber),
                    fullName: String(fullName),
                    createdAt: new Date()
                };
                // Insert all data simultaneously
                await Promise.all([
                    profileCollection.insertOne(profileData),
                    academicCollection.insertOne(academicData),
                    cocircularCollection.insertOne(cocircularData),
                    extracircularCollection.insertOne(extracircularData),
                    usersCollection.insertOne(userData)
                ]);
                successCount++;
            } catch (rowError) {
                errors.push(`Row error: ${rowError instanceof Error ? rowError.message : "Unknown error"}`);
                errorCount++;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Successfully imported ${successCount} students`,
            successCount,
            errorCount,
            errors: errors.length > 0 ? errors : undefined,
            total: data.length
        });
    } catch (error) {
        console.error("Error uploading Excel:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__214fb5fe._.js.map