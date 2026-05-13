import { getDb } from "@/db";
import { lessonProgress } from "@/db/schema";

export const dynamic = "force-dynamic";

type Body = {
  lessonSlug?: string;
  clientId?: string;
  status?: string;
};

export async function POST(req: Request) {
  const db = getDb();
  if (!db) {
    return Response.json({ ok: false, reason: "no_database" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  if (!body.lessonSlug || !body.clientId) {
    return Response.json({ ok: false, reason: "missing_fields" }, { status: 400 });
  }

  try {
    await db.insert(lessonProgress).values({
      lessonSlug: body.lessonSlug,
      clientId: body.clientId,
      status: body.status ?? "viewed",
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, reason: "insert_failed" }, { status: 500 });
  }
}
