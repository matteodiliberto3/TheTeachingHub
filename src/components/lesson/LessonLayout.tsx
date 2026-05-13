import type { ReactNode } from "react";
import { SeniorNotes } from "./SeniorNotes";
import { CodeTabs } from "./CodeTabs";

type Props = {
  title: string;
  summary: string;
  stage: ReactNode;
  jsonContract: string;
  serverSnippet: string;
  clientSnippet: string;
  seniorNotes: string[];
  labExtra?: ReactNode;
  diagram?: ReactNode;
};

function SectionTitle({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
    >
      {children}
    </h2>
  );
}

/**
 * Contenuto didattico in colonna centrata; il Playground usa tutta la larghezza della
 * colonna principale (accanto alla sidebar), senza trucco 100vw che crea margini errati.
 */
export function LessonLayout({
  title,
  summary,
  stage,
  jsonContract,
  serverSnippet,
  clientSnippet,
  seniorNotes,
  labExtra,
  diagram,
}: Props) {
  return (
    <div className="flex w-full min-w-0 max-w-none flex-col gap-12 pb-16">
      <article className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {summary}
          </p>
        </header>

        <section className="flex flex-col gap-3" aria-labelledby="sec-stage">
          <SectionTitle id="sec-stage">Palcoscenico</SectionTitle>
          <div className="min-h-[260px] rounded-2xl border border-zinc-200 bg-linear-to-b from-white to-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
            {stage}
          </div>
        </section>

        {diagram ? (
          <section className="flex flex-col gap-3" aria-labelledby="sec-diagram">
            <SectionTitle id="sec-diagram">Diagramma</SectionTitle>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              {diagram}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-3" aria-labelledby="sec-lab">
          <SectionTitle id="sec-lab">Laboratorio codice</SectionTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Contratto e snippet di riferimento. Il playground a schermo intero segue sotto.
          </p>
          <CodeTabs
            json={jsonContract}
            server={serverSnippet}
            client={clientSnippet}
          />
        </section>
      </article>

      {labExtra ? (
        <section
          className="w-full min-w-0 border-y border-zinc-200 bg-zinc-950 py-6 dark:border-zinc-800"
          aria-labelledby="sec-playground"
        >
          <div className="mx-auto mb-4 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle id="sec-playground">Playground</SectionTitle>
            <p className="mt-1 text-xs text-zinc-500">
              Editor, anteprima e console su tutta la larghezza della colonna (area accanto al
              menu).
            </p>
          </div>
          <div className="w-full min-w-0 px-0">{labExtra}</div>
        </section>
      ) : null}

      <article className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SeniorNotes items={seniorNotes} />
      </article>
    </div>
  );
}
