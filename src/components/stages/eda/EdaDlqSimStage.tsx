"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";

const COL_LEFT = ["16.67%", "50%", "83.33%"] as const;

type Phase = "queue" | "retry1" | "retry2" | "dlq";

/**
 * Simulazione: elaborazioni fallite con retry, poi DLQ. Stati espliciti per didattica.
 */
export function EdaDlqSimStage() {
  const [phase, setPhase] = useState<Phase>("queue");

  const consumeFail = useCallback(() => {
    setPhase((p) => {
      if (p === "queue") return "retry1";
      if (p === "retry1") return "retry2";
      return "dlq";
    });
  }, []);

  const reset = useCallback(() => setPhase("queue"), []);

  const msgLeft =
    phase === "queue"
      ? COL_LEFT[1]
      : phase === "retry1" || phase === "retry2"
        ? COL_LEFT[1]
        : COL_LEFT[2];

  const msgColor =
    phase === "dlq" ? "bg-amber-400/90 text-amber-950" : "bg-emerald-400/90 text-emerald-950";

  const caption =
    phase === "queue"
      ? "Messaggio in coda: premi “Elabora (fallisce)” per simulare un consumer fragile."
      : phase === "retry1"
        ? "Tentativo 1 fallito → nack/requeue con backoff (simulato)."
        : phase === "retry2"
          ? "Tentativo 2 fallito → ultimo retry prima della DLQ."
          : "Retry esauriti → messaggio isolato in DLQ per ispezione / requeue controllato.";

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-3 text-[11px]">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={consumeFail}
          disabled={phase === "dlq"}
          className="rounded-full border border-rose-400/50 px-3 py-1 text-[10px] font-medium text-rose-100 hover:bg-rose-500/20 disabled:opacity-40"
        >
          Elabora (fallisce)
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-zinc-500 px-3 py-1 text-[10px] text-zinc-300 hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>

      <div className="relative min-h-[160px] flex-1 grid grid-cols-3 items-center gap-2">
        <div className="rounded-lg border border-zinc-600 bg-zinc-800/80 p-2 text-center text-zinc-200">
          Producer
        </div>
        <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 p-2 text-center text-indigo-100">
          Coda principale
          {phase !== "queue" && phase !== "dlq" ? (
            <span className="mt-1 block font-mono text-[9px] text-indigo-200/90">
              retry {phase === "retry1" ? 1 : 2}/2
            </span>
          ) : null}
        </div>
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-center text-amber-50">
          DLQ
        </div>

        <motion.div
          layout
          className={`pointer-events-none absolute top-1/2 z-10 h-8 w-8 rounded-full text-center text-[10px] font-bold leading-8 shadow-lg ${msgColor}`}
          initial={false}
          animate={{
            left: msgLeft,
            top: "50%",
            x: "-50%",
            y: "-50%",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          msg
        </motion.div>
      </div>

      <p className="text-center text-[10px] leading-snug text-zinc-500">{caption}</p>
    </div>
  );
}
