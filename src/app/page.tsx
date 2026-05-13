import Link from "next/link";
import { lessons } from "@/lib/lessons/registry";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          Engineering enablement
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hub vivo per architetture, pattern e sicurezza
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Ogni modulo unisce animazioni, contratti JSON, snippet server e client,
          playground Sandpack e note da senior. Obiettivo: contesto e trade-off,
          non solo definizioni.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Apri il percorso
          </Link>
          <a
            href="https://nextjs.org/docs"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            target="_blank"
            rel="noreferrer"
          >
            Documentazione Next.js
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {lessons.map((l) => (
          <Link
            key={l.slug}
            href={`/learn/${l.slug}`}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Modulo
            </p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-900 group-hover:text-indigo-700 dark:text-zinc-50 dark:group-hover:text-indigo-300">
              {l.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {l.summary}
            </p>
            <p className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              Entra nel modulo →
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
