"use client";

import { useReducedMotion } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

type Props = {
  jsonPreview: string;
  serverHint: string;
  brokerHint: string;
  clientHint: string;
};

const zones = [
  { id: "server", label: "Server", hintKey: "server" as const },
  { id: "broker", label: "Broker", hintKey: "broker" as const },
  { id: "client", label: "Client", hintKey: "client" as const },
];

/**
 * Simulazione step-by-step: JSON che attraversa Server → Broker → Client.
 * L'utente avanza con "Play" (riduce motion: salta direttamente allo step finale).
 */
export function EdaMessageFlowStage({ jsonPreview, serverHint, brokerHint, clientHint }: Props) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  const hints = { server: serverHint, broker: brokerHint, client: clientHint };

  const play = useCallback(() => {
    if (reduce) {
      setStep(3);
      return;
    }
    setStep((s) => (s >= 3 ? 0 : s + 1));
  }, [reduce]);

  const activeZone = step === 0 ? "server" : step === 1 ? "broker" : step >= 2 ? "client" : "server";

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-zinc-500">
          Step {Math.min(step, 3)}/3 — CloudEvent in transito
        </p>
        <button
          type="button"
          onClick={play}
          className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow hover:bg-indigo-500"
        >
          {reduce ? "Mostra percorso" : step >= 3 ? "Riavvia" : "Play"}
        </button>
      </div>

      <div className="relative grid flex-1 grid-cols-3 gap-2 text-[11px]">
        {zones.map((z) => {
          const on = activeZone === z.id;
          return (
            <div
              key={z.id}
              className={`flex flex-col rounded-lg border p-2 transition-colors ${
                on
                  ? "border-indigo-400/70 bg-indigo-500/10 text-indigo-50"
                  : "border-zinc-700 bg-zinc-800/40 text-zinc-400"
              }`}
            >
              <span className="font-semibold">{z.label}</span>
              <span className="mt-1 text-[10px] leading-snug text-zinc-400">{hints[z.hintKey]}</span>
            </div>
          );
        })}

        <AnimatePresence initial={false}>
          <motion.div
            key={step}
            className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              x:
                step === 0 ? "-28%" : step === 1 ? "0%" : step >= 2 ? "28%" : "-28%",
            }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            <div className="max-w-[200px] rounded-md border border-amber-400/60 bg-zinc-950/90 p-2 font-mono text-[10px] leading-relaxed text-amber-100 shadow-lg">
              {jsonPreview}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
