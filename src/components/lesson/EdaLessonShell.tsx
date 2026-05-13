import type { ReactNode } from "react";
import { MermaidDiagram } from "@/components/diagram/MermaidDiagram";
import { ArchitectureLab } from "@/components/lab/ArchitectureLab";
import { SandpackLab } from "@/components/lab/SandpackLab";
import { CodeTabs } from "@/components/lesson/CodeTabs";
import { SeniorNotes } from "@/components/lesson/SeniorNotes";
import { SeniorInsights } from "@/components/lesson/SeniorInsights";
import { EdaStageSlot } from "@/components/stages/eda/EdaStageSlot";
import type { EdaPageDefinition } from "@/lib/lessons/eda/types";
import { TheoryNarrative } from "@/components/lesson/TheoryNarrative";

function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
    >
      {children}
    </h2>
  );
}

type Props = {
  page: EdaPageDefinition;
};

/**
 * Standard EDA: Approfondimento → Note da senior → Palcoscenico → … → Cicche senior → Lab (Sandpack) → (Lab architettonico se presente).
 */
export function EdaLessonShell({ page }: Props) {
  const diagram = page.mermaid ? (
    <MermaidDiagram chart={page.mermaid} className="[&_svg]:mx-auto [&_svg]:max-h-[380px]" />
  ) : null;

  const labExtra = page.sandpack ? (
    <SandpackLab files={page.sandpack} template={page.sandpackTemplate ?? "vanilla-ts"} />
  ) : null;

  return (
    <div className="flex w-full min-w-0 max-w-none flex-col gap-12 pb-16">
      <article className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {page.title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {page.summary}
          </p>
        </header>

        <TheoryNarrative sections={page.theorySections} />

        <SeniorNotes items={page.seniorNotes} />

        <section className="flex flex-col gap-3" aria-labelledby="eda-sec-stage">
          <SectionTitle id="eda-sec-stage">Palcoscenico</SectionTitle>
          <div className="min-h-[260px] rounded-2xl border border-zinc-200 bg-linear-to-b from-white to-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
            <EdaStageSlot stage={page.stage} />
          </div>
        </section>

        {diagram ? (
          <section className="flex flex-col gap-3" aria-labelledby="eda-sec-diagram">
            <SectionTitle id="eda-sec-diagram">Diagramma</SectionTitle>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              {diagram}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-3" aria-labelledby="eda-sec-lab">
          <SectionTitle id="eda-sec-lab">Contratto e codice</SectionTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Schema JSON basato su CloudEvents 1.0, poi snippet server e client.
          </p>
          <CodeTabs
            json={page.jsonContract}
            server={page.serverSnippet}
            client={page.clientSnippet}
          />
        </section>

        <SeniorInsights items={page.seniorInsights} />
      </article>

      {labExtra ? (
        <section
          className="w-full min-w-0 border-y border-zinc-200 bg-zinc-950 py-6 dark:border-zinc-800"
          aria-labelledby="eda-sec-playground"
        >
          <div className="mx-auto mb-4 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle id="eda-sec-playground">{page.labTitle ?? "Lab interattivo"}</SectionTitle>
            <p className="mt-1 text-xs text-zinc-500">
              {page.labHint ??
                "Modifica il codice e osserva l’output in console: è un laboratorio isolato, non collegato al backend del hub."}
            </p>
          </div>
          <div className="w-full min-w-0 px-0">{labExtra}</div>
        </section>
      ) : null}

      {page.architectureLab ? <ArchitectureLab kind={page.architectureLab.kind} /> : null}
    </div>
  );
}
