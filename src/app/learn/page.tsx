import Link from "next/link";
import { lessons } from "@/lib/lessons/registry";

export default function LearnIndexPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Percorso formativo
        </h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Ogni modulo combina animazione, contratto dati, snippet server/client e
          note operative. Apri un modulo per iniziare.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {lessons.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/learn/${l.slug}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-indigo-400/60 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/50"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                Modulo
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {l.shortTitle}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {l.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
