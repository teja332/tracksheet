import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

const branchCodes = ["CE", "CSE", "ECE", "EE", "IT", "ME"];
const staffCount = 10;
const staffPassword = "staff123";
const studentPassword = "student123";

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("Tracksheet");
  const branches = db.collection("branches");
  const staffBranchMap = db.collection("staffBranchMap");
  const users = db.collection("users");
  const profiles = db.collection("sProfile");

  for (const code of branchCodes) {
    await branches.updateOne(
      { branchId: code },
      { $set: { branchId: code, branchName: code } },
      { upsert: true }
    );
  }

  const staffPasswordHash = await bcrypt.hash(staffPassword, 10);

  for (let i = 1; i <= staffCount; i += 1) {
    const staffId = `S${String(i).padStart(3, "0")}`;
    const email = `staff${String(i).padStart(2, "0")}@tracksheet.edu`;
    const branchId = branchCodes[Math.floor(Math.random() * branchCodes.length)];

    await users.updateOne(
      { email },
      {
        $set: {
          email,
          passwordHash: staffPasswordHash,
          role: "staff",
          staffId,
        },
      },
      { upsert: true }
    );

    await staffBranchMap.updateOne(
      { staffId },
      { $set: { staffId, branchId } },
      { upsert: true }
    );
  }

  const studentPasswordHash = await bcrypt.hash(studentPassword, 10);
  const studentDocs = await profiles.find({}).toArray();

  for (const doc of studentDocs) {
    const email = String(doc["Email"] || "").trim().toLowerCase();
    const rollNumber = String(doc["Roll no"] || "").trim();
    if (!email || !rollNumber) continue;

    await users.updateOne(
      { email },
      {
        $set: {
          email,
          passwordHash: studentPasswordHash,
          role: "student",
          rollNumber,
        },
      },
      { upsert: true }
    );
  }

  await client.close();
  console.log("Seed complete.");
  console.log(`Staff password: ${staffPassword}`);
  console.log(`Student password: ${studentPassword}`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
