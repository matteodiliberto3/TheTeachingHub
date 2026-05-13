import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Lightweight progress for associates (no auth in v1). */
export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonSlug: text("lesson_slug").notNull(),
  clientId: text("client_id").notNull(),
  status: text("status").notNull().default("viewed"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
