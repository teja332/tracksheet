import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const skillPool = [
  "Python",
  "Java",
  "SQL",
  "DSA",
  "Web",
  "ML",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
];

const certPool = [
  { name: "Python Basics", issuer: "Coursera" },
  { name: "SQL Foundations", issuer: "edX" },
  { name: "Web Dev Essentials", issuer: "Udemy" },
  { name: "Data Structures", issuer: "NPTEL" },
];

const resources = [
  { title: "Data Structures Practice", skills: ["dsa", "problem solving"], type: "course" },
  { title: "SQL Fundamentals", skills: ["sql", "database"], type: "course" },
  { title: "Python for ML", skills: ["python", "ml"], type: "course" },
  { title: "Communication Workshop", skills: ["communication"], type: "workshop" },
  { title: "Leadership Lab", skills: ["leadership", "teamwork"], type: "workshop" },
];

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

const pickSkills = () => {
  const count = randInt(4, 8);
  const shuffled = [...skillPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((name) => ({
    name,
    level: randInt(50, 95),
  }));
};

const pickCerts = () => {
  const count = randInt(1, 3);
  const shuffled = [...certPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((cert) => ({
    name: cert.name,
    issuer: cert.issuer,
    year: randInt(2022, 2025),
  }));
};

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("Tracksheet");
  const profiles = await db.collection("sProfile").find({}).toArray();

  const attendanceCol = db.collection("sAttendance");
  const semestersCol = db.collection("sSemesters");
  const skillsCol = db.collection("sSkills");
  const certCol = db.collection("sCertifications");
  const resourcesCol = db.collection("sResources");

  if ((await resourcesCol.countDocuments()) === 0) {
    await resourcesCol.insertMany(resources);
  }

  for (const profile of profiles) {
    const rollNumber = String(profile["Roll no"] || "").trim();
    const fullName = String(profile["Full name"] || "").trim();
    if (!rollNumber) continue;

    await attendanceCol.deleteMany({ "Roll no": rollNumber });
    await semestersCol.deleteMany({ "Roll no": rollNumber });

    const attendanceDocs = months.map((month) => ({
      "Roll no": rollNumber,
      "Full name": fullName,
      Month: month,
      AttendancePct: Math.round(rand(70, 98)),
      TheoryPct: Math.round(rand(68, 98)),
      LabPct: Math.round(rand(65, 98)),
      AssignmentsCompleted: randInt(14, 20),
      AssignmentsTotal: 20,
      ParticipationScore: Math.round(rand(60, 95)),
    }));

    const semesterDocs = Array.from({ length: 6 }, (_, idx) => ({
      "Roll no": rollNumber,
      "Full name": fullName,
      Semester: idx + 1,
      GPA: Number(rand(6.2, 9.4).toFixed(2)),
    }));

    await attendanceCol.insertMany(attendanceDocs);
    await semestersCol.insertMany(semesterDocs);

    await skillsCol.updateOne(
      { "Roll no": rollNumber },
      {
        $set: {
          "Roll no": rollNumber,
          "Full name": fullName,
          skills: pickSkills(),
          softSkills: ["Communication", "Teamwork", "Leadership"].slice(0, randInt(1, 3)),
        },
      },
      { upsert: true }
    );

    await certCol.updateOne(
      { "Roll no": rollNumber },
      {
        $set: {
          "Roll no": rollNumber,
          "Full name": fullName,
          certifications: pickCerts(),
        },
      },
      { upsert: true }
    );
  }

  await client.close();
  console.log("ML seed complete.");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
