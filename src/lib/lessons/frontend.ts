import type { LessonDefinition } from "./types";

export const frontendLesson: LessonDefinition = {
  slug: "frontend",
  title: "Architetture frontend: oltre la SPA",
  shortTitle: "Frontend",
  summary:
    "SPA, SSR, SSG/ISR, micro-frontend e islands: dove gira il JS e dove nasce l'HTML.",
  mermaid: `flowchart TB
  subgraph whereHtml[Dove nasce HTML]
    CSR[CSR / SPA shell]
    SSR[SSR per-request]
    SSG[SSG statico]
    ISR[ISR / on-demand]
  end
  subgraph whereJs[Dove gira JS]
    ALL[Tutto il bundle]
    ISL[Islands / partial hydration]
  end`,
  jsonContract: `{
  "page": "/catalog",
  "renderMode": "ssr",
  "cache": { "stale": 60, "revalidate": 300 },
  "islands": [
    { "name": "Filters", "strategy": "client", "props": { "categories": 12 } },
    { "name": "ProductGrid", "strategy": "server", "props": { "page": 1 } }
  ]
}`,
  serverSnippet: `// Next.js App Router — streaming SSR + dati server-only
import { Suspense } from "react";

export default async function Page() {
  const categories = await fetchCategories(); // DB / API interna
  return (
    <main>
      <Suspense fallback={<Skeleton />}>
        <ProductGrid categories={categories} />
      </Suspense>
    </main>
  );
}`,
  clientSnippet: `// Client Component — interazione senza mandare segreti al browser
"use client";

import { useTransition } from "react";

export function Filters({ initial }: { initial: string[] }) {
  const [pending, start] = useTransition();
  return (
    <form action={async (fd) => {
      start(async () => {
        await fetch("/api/search", { method: "POST", body: fd });
      });
    }}>
      {/* campi controllati + feedback pending */}
    </form>
  );
}`,
  seniorNotes: [
    "SSR migliora TTFB per contenuti dinamici ma aumenta carico server: misura RPS e caching per route.",
    "Micro-frontend risolvono autonomia di team ma introducono costi di integrazione, versioning e performance (payload duplicato).",
    "Islands/partial hydration riduono JS inviato: utile quando la pagina è prevalentemente statica.",
  ],
};
