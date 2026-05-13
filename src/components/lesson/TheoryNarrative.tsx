import type { EdaTheorySection } from "@/lib/lessons/eda/types";

type Props = {
  sections: EdaTheorySection[];
};

/**
 * Narrazione teorica strutturata: titoli di sezione + paragrafi in prosa accessibile.
 */
export function TheoryNarrative({ sections }: Props) {
  if (!sections.length) return null;

  return (
    <section
      className="space-y-10 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8"
      aria-labelledby="eda-theory-heading"
    >
      <div className="space-y-1">
        <h2
          id="eda-theory-heading"
          className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          Approfondimento
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Definizioni, contesto e collegamenti tra concetti — leggi prima del palcoscenico interattivo se parti da zero.
        </p>
      </div>

      <div className="space-y-10">
        {sections.map((sec) => (
          <div key={sec.id} className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {sec.title}
            </h3>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {sec.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
