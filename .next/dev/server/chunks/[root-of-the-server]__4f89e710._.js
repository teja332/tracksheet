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
"[project]/app/api/student/[rollNumber]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-server.ts [app-route] (ecmascript)");
;
;
;
const normalizeBranch = (value)=>(value || "").trim().toUpperCase();
const mapProfile = (doc)=>({
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
        codechef: String(doc["CodeChef"] || "")
    });
const mapAcademic = (doc)=>{
    const entries = Object.entries(doc).filter(([key])=>key !== "_id" && key !== "Full name").map(([name, value])=>({
            name,
            score: value
        }));
    return {
        subjects: entries
    };
};
const mapCategoryEntries = (doc)=>{
    return Object.entries(doc).filter(([key])=>key !== "_id" && key !== "Full name").map(([category, value])=>{
        const text = String(value || "").trim();
        const normalized = text.toLowerCase();
        const entries = normalized === "none" || normalized === "n/a" || normalized === "na" ? [] : text.split("\n").map((line)=>line.trim()).filter((line)=>line && line.toLowerCase() !== "none");
        return {
            category,
            entries
        };
    });
};
async function checkAuth(request, rollNumber) {
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(request);
    if (!auth) {
        return [
            false,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        ];
    }
    if (auth.role === "student" && auth.rollNumber !== rollNumber) {
        return [
            false,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden"
            }, {
                status: 403
            })
        ];
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const profiles = db.collection("sProfile");
    const profileDoc = await profiles.findOne({
        "Roll no": rollNumber
    });
    if (!profileDoc) {
        return [
            false,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Student not found"
            }, {
                status: 404
            })
        ];
    }
    if (auth.role === "staff") {
        const staffBranchMap = db.collection("staffBranchMap");
        const branches = db.collection("branches");
        const mapping = await staffBranchMap.findOne({
            staffId: auth.staffId
        });
        const branch = mapping?.branchId ? await branches.findOne({
            branchId: mapping.branchId
        }) : null;
        const staffBranchKey = normalizeBranch(branch?.branchName || branch?.branchId);
        const studentBranchKey = normalizeBranch(String(profileDoc["Branch"] || ""));
        if (!staffBranchKey || staffBranchKey !== studentBranchKey) {
            return [
                false,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Forbidden"
                }, {
                    status: 403
                })
            ];
        }
    }
    return [
        true,
        null
    ];
}
async function GET(request, { params }) {
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(request);
    if (!auth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const resolvedParams = await params;
    const rollNumber = decodeURIComponent(resolvedParams.rollNumber || "").trim();
    if (!rollNumber) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing roll number"
        }, {
            status: 400
        });
    }
    if (auth.role === "student" && auth.rollNumber !== rollNumber) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Forbidden"
        }, {
            status: 403
        });
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const profiles = db.collection("sProfile");
    const academics = db.collection("sAcademics");
    const cocirculars = db.collection("sCociruculars");
    const ecirculars = db.collection("sEcirculars");
    const profileDoc = await profiles.findOne({
        "Roll no": rollNumber
    });
    if (!profileDoc) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Student not found"
        }, {
            status: 404
        });
    }
    if (auth.role === "staff") {
        const staffBranchMap = db.collection("staffBranchMap");
        const branches = db.collection("branches");
        const mapping = await staffBranchMap.findOne({
            staffId: auth.staffId
        });
        const branch = mapping?.branchId ? await branches.findOne({
            branchId: mapping.branchId
        }) : null;
        const staffBranchKey = normalizeBranch(branch?.branchName || branch?.branchId);
        const studentBranchKey = normalizeBranch(String(profileDoc["Branch"] || ""));
        if (!staffBranchKey || staffBranchKey !== studentBranchKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden"
            }, {
                status: 403
            });
        }
    }
    const fullName = String(profileDoc["Full name"] || "");
    // Try fullName match first, fallback to rollNumber if not found
    let academicDoc = await academics.findOne({
        "Full name": fullName
    });
    if (!academicDoc) {
        academicDoc = await academics.findOne({
            "Roll no": rollNumber
        });
    }
    let cocircularDoc = await cocirculars.findOne({
        "Full name": fullName
    });
    if (!cocircularDoc) {
        cocircularDoc = await cocirculars.findOne({
            "Roll no": rollNumber
        });
    }
    let ecircularDoc = await ecirculars.findOne({
        "Full name": fullName
    });
    if (!ecircularDoc) {
        ecircularDoc = await ecirculars.findOne({
            "Roll no": rollNumber
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        profile: mapProfile(profileDoc),
        academics: academicDoc ? mapAcademic(academicDoc) : {
            subjects: []
        },
        cocirculars: cocircularDoc ? {
            categories: mapCategoryEntries(cocircularDoc)
        } : {
            categories: []
        },
        ecirculars: ecircularDoc ? {
            categories: mapCategoryEntries(ecircularDoc)
        } : {
            categories: []
        }
    });
}
async function PATCH(request, { params }) {
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(request);
    if (!auth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Please use /api/student/[rollNumber]/update for PATCH requests"
    }, {
        status: 400
    });
}
async function DELETE(request, { params }) {
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(request);
    if (!auth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Please use /api/student/[rollNumber]/[section] for DELETE requests"
    }, {
        status: 400
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4f89e710._.js.map