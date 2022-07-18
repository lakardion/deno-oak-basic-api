import {
  Bson,
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.30.1/mod.ts";

let db: Database;

export const connect = async () => {
  const client = new MongoClient();

  // Connect using srv url
  db = await client.connect(Deno.env.get("MONGO_DB_URI") ?? "");
};

export const getDb = () => {
  return db;
};
