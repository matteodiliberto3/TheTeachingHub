export type LessonSlug = "eda" | "frontend" | "patterns" | "security";

export type LessonDefinition = {
  slug: LessonSlug;
  title: string;
  shortTitle: string;
  summary: string;
  /** Mermaid source (optional diagram in lesson). */
  mermaid?: string;
  jsonContract: string;
  serverSnippet: string;
  clientSnippet: string;
  seniorNotes: string[];
  /** Optional Sandpack files (path -> content). */
  sandpack?: Record<string, string>;
};
