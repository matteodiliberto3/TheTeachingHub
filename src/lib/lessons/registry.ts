import { edaLesson } from "./eda";
import { frontendLesson } from "./frontend";
import { patternsLesson } from "./patterns";
import { securityLesson } from "./security";
import type { LessonDefinition, LessonSlug } from "./types";

export const lessons: LessonDefinition[] = [
  edaLesson,
  frontendLesson,
  patternsLesson,
  securityLesson,
];

export function getLesson(slug: LessonSlug): LessonDefinition | undefined {
  return lessons.find((l) => l.slug === slug);
}

export type { LessonDefinition, LessonSlug };
