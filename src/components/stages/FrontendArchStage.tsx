"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";

const models = [
  {
    id: "spa",
    title: "SPA / CSR",
    tag: "Client-heavy",
    points: ["Navigazione istantanea", "SEO più impegnativa", "Bundle iniziale più grande"],
  },
  {
    id: "ssr",
    title: "SSR",
    tag: "HTML per richiesta",
    points: ["SEO e meta dinamici", "Carico server per view", "TTFB migliorabile con cache"],
  },
  {
    id: "ssg",
    title: "SSG / ISR",
    tag: "Pre-render",
    points: ["Pagine veloci al edge", "Dati quasi statici", "Invalidazione da pianificare"],
  },
  {
    id: "mfe",
    title: "Micro-frontend",
    tag: "Team autonomi",
    points: ["Deploy indipendenti", "Duplicazione dipendenze", "Contratti runtime chiari"],
  },
  {
    id: "islands",
    title: "Islands",
    tag: "JS mirato",
    points: ["Idratazione parziale", "Ottimo per contenuti statici", "Tooling specifico"],
  },
] as const;

export function FrontendArchStage() {
  const [active, setActive] = useState<(typeof models)[number]["id"]>("spa");

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {models.map((m) => {
        const selected = active === m.id;
        return (
          <motion.button
            key={m.id}
            type="button"
            layout
            onClick={() => setActive(m.id)}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              selected
                ? "border-indigo-500 bg-indigo-500/10 shadow-md"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-600",
            )}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {m.title}
              </p>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {m.tag}
              </span>
            </div>
            <ul className="mt-2 space-y-1 text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">
              {m.points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </motion.button>
        );
      })}
    </div>
  );
}
