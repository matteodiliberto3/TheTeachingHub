import { sql } from "drizzle-orm";
import { getDb } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: false, reason: "no_database_url" });
  }

  const db = getDb();
  if (!db) {
    return Response.json({ ok: false, reason: "db_unavailable" });
  }

  try {
    await db.execute(sql`select 1 as ok`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, reason: "query_failed" }, { status: 500 });
  }
}
