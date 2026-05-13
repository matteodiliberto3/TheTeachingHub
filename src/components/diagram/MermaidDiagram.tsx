"use client";

import { useEffect, useRef } from "react";

type Props = { chart: string; className?: string };

export function MermaidDiagram({ chart, className }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let cancelled = false;

    void (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains("dark")
          ? "dark"
          : "neutral",
        securityLevel: "strict",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      });
      const id = `mmd-${Math.random().toString(36).slice(2)}`;
      const { svg } = await mermaid.render(id, chart);
      if (!cancelled) el.innerHTML = svg;
    })();

    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, [chart]);

  return (
    <div
      ref={host}
      className={className}
      role="img"
      aria-label="Diagramma architetturale"
    />
  );
}
