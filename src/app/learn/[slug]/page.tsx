import { notFound } from "next/navigation";
import { getLesson, type LessonSlug } from "@/lib/lessons/registry";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { MermaidDiagram } from "@/components/diagram/MermaidDiagram";
import { SandpackLab } from "@/components/lab/SandpackLab";
import { EdaEventStage } from "@/components/stages/EdaEventStage";
import { FrontendArchStage } from "@/components/stages/FrontendArchStage";
import { PatternObserverStage } from "@/components/stages/PatternObserverStage";
import { SecurityFlowStage } from "@/components/stages/SecurityFlowStage";
import { LessonTrack } from "@/components/lesson/LessonTrack";

const slugs: LessonSlug[] = ["eda", "frontend", "patterns", "security"];

function isLessonSlug(s: string): s is LessonSlug {
  return (slugs as readonly string[]).includes(s);
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isLessonSlug(slug)) notFound();
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const stage =
    slug === "eda" ? (
      <EdaEventStage />
    ) : slug === "frontend" ? (
      <FrontendArchStage />
    ) : slug === "patterns" ? (
      <PatternObserverStage />
    ) : (
      <SecurityFlowStage />
    );

  const diagram = lesson.mermaid ? (
    <MermaidDiagram
      chart={lesson.mermaid}
      className="[&_svg]:mx-auto [&_svg]:max-h-[360px]"
    />
  ) : null;

  const labExtra = lesson.sandpack ? (
    <SandpackLab files={lesson.sandpack} />
  ) : null;

  return (
    <div className="w-full min-w-0">
      <LessonTrack slug={slug} />
      <LessonLayout
        title={lesson.title}
        summary={lesson.summary}
        stage={stage}
        jsonContract={lesson.jsonContract}
        serverSnippet={lesson.serverSnippet}
        clientSnippet={lesson.clientSnippet}
        seniorNotes={lesson.seniorNotes}
        labExtra={labExtra}
        diagram={diagram}
      />
    </div>
  );
}
