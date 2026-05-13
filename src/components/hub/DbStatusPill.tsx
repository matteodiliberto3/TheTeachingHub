"use client";

import { useEffect, useState } from "react";

export function DbStatusPill() {
  const [state, setState] = useState<"idle" | "ok" | "err" | "missing">("idle");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/db-health", { cache: "no-store" });
        const data = (await res.json()) as { ok?: boolean; reason?: string };
        if (cancelled) return;
        if (data.reason === "no_database_url") setState("missing");
        else if (res.ok && data.ok) setState("ok");
        else setState("err");
      } catch {
        if (!cancelled) setState("err");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    state === "idle"
      ? "DB: …"
      : state === "ok"
        ? "DB: connesso"
        : state === "missing"
          ? "DB: manca DATABASE_URL"
          : state === "err"
            ? "DB: errore"
            : "DB";

  const color =
    state === "ok"
      ? "bg-emerald-500/15 text-emerald-800 ring-emerald-500/30 dark:text-emerald-200"
      : state === "missing"
        ? "bg-amber-500/15 text-amber-900 ring-amber-500/30 dark:text-amber-100"
        : state === "err"
          ? "bg-rose-500/15 text-rose-900 ring-rose-500/30 dark:text-rose-100"
          : "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20 dark:text-zinc-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${color}`}
      title="Stato connessione Postgres (solo server)"
    >
      {label}
    </span>
  );
}
