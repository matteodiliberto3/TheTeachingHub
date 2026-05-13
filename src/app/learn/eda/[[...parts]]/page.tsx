import { notFound } from "next/navigation";
import { EdaLessonShell } from "@/components/lesson/EdaLessonShell";
import { EdaLessonTrack } from "@/components/lesson/EdaLessonTrack";
import { getEdaPage } from "@/lib/lessons/eda/pages";

function toPathKey(parts: string[] | undefined): string {
  if (!parts || parts.length === 0) return "";
  return parts.join("/");
}

export default async function EdaCatchAllPage({
  params,
}: {
  params: Promise<{ parts?: string[] }>;
}) {
  const { parts } = await params;
  const pathKey = toPathKey(parts);
  const page = getEdaPage(pathKey);
  if (!page) notFound();

  return (
    <div className="w-full min-w-0">
      <EdaLessonTrack pathKey={pathKey} />
      <EdaLessonShell page={page} />
    </div>
  );
}
