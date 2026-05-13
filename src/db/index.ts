import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type HubDb = PostgresJsDatabase<typeof schema>;

let _db: HubDb | null = null;
let _sql: ReturnType<typeof postgres> | null = null;

export function getDb(): HubDb | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!_db) {
    _sql = postgres(url, {
      max: 1,
      prepare: false,
      ssl: "require",
    });
    _db = drizzle(_sql, { schema });
  }
  return _db;
}
