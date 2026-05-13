"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: 0,
    title: "Comando",
    body: "Il client invia PlaceOrder: è un intento, non una vista.",
    active: "write" as const,
  },
  {
    id: 1,
    title: "Write model",
    body: "Invarianti e persistenza transazionale locale; niente query pesanti qui.",
    active: "write" as const,
  },
  {
    id: 2,
    title: "Evento pubblicato",
    body: "OrderPlaced esce verso bus / outbox → verso worker di proiezione.",
    active: "bus" as const,
  },
  {
    id: 3,
    title: "Read model",
    body: "Worker aggiorna viste denormalizzate / cache di lettura.",
    active: "read" as const,
  },
  {
    id: 4,
    title: "Query",
    body: "Il client legge GET /orders/:id — può essere leggermente stale.",
    active: "read" as const,
  },
];

/**
 * Percorso CQRS passo-passo: comando → write → bus → read → query.
 */
export function EdaCqrsSplitStage() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const next = useCallback(() => setIdx((i) => Math.min(i + 1, steps.length - 1)), []);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  const ring = (zone: "write" | "read" | "bus") =>
    step.active === zone ? "ring-2 ring-indigo-400/70 shadow-[0_0_20px_rgba(99,102,241,0.25)]" : "";

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-3 text-[11px]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] text-zinc-500">
          Passo {idx + 1}/{steps.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="rounded-full border border-zinc-600 px-3 py-1 text-[10px] font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
          >
            Indietro
          </button>
          <button
            type="button"
            onClick={next}
            disabled={idx === steps.length - 1}
            className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
          >
            Avanti
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2">
        <div
          className={`flex flex-col rounded-xl border border-fuchsia-400/35 bg-fuchsia-500/10 p-3 transition-shadow ${ring("write")}`}
        >
          <p className="text-xs font-semibold text-fuchsia-100">Write model</p>
          <p className="mt-2 text-[10px] leading-relaxed text-fuchsia-100/85">Comandi e invarianti</p>
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-2 text-center transition-shadow ${ring("bus")}`}
        >
          <p className="text-[10px] font-semibold text-indigo-100">Bus / outbox</p>
          <p className="mt-1 text-[9px] text-indigo-200/80">Eventi verso projection</p>
        </div>
        <div
          className={`flex flex-col rounded-xl border border-teal-400/35 bg-teal-500/10 p-3 transition-shadow ${ring("read")}`}
        >
          <p className="text-xs font-semibold text-teal-100">Read model</p>
          <p className="mt-2 text-[10px] leading-relaxed text-teal-100/85">Viste veloci</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-3"
        >
          <p className="text-xs font-semibold text-zinc-100">{step.title}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-zinc-400">{step.body}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
