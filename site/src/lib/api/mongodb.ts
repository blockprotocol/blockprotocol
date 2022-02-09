import { MongoClient, Db } from "mongodb";
import { mustGetEnvVar } from "../../util/api";

const MONGODB_URI = mustGetEnvVar("MONGODB_URI");
const MONGODB_DB_NAME = mustGetEnvVar("MONGODB_DB_NAME");

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export const connectToDatabase = async () => {
  if (cachedClient && cachedDb) {
    await cachedClient?.connect(); // Reconnect if client.close() was called previously
    return { client: cachedClient, db: cachedDb };
  }

  const client: MongoClient = await MongoClient.connect(MONGODB_URI, {});

  const db = await client.db(MONGODB_DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
};
