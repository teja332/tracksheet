import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (client) return client;
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  client = await clientPromise;
  return client;
}

export async function getDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db();
}
