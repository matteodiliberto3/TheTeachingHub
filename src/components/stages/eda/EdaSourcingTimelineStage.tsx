"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";

const events = ["FundsReserved", "FundsCaptured", "PayoutScheduled"];

export function EdaSourcingTimelineStage() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (reduce) {
      setVisible(events.length);
      return;
    }
    const id = window.setInterval(() => {
      setVisible((v) => (v >= events.length ? 1 : v + 1));
    }, 1800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex h-full min-h-[220px] flex-col gap-2 text-[11px]">
      <p className="text-[11px] text-zinc-400">Append-only stream (semplificato)</p>
      <ul className="relative flex flex-1 flex-col justify-center gap-2 border-l border-zinc-700 pl-4">
        <AnimatePresence initial={false}>
          {events.slice(0, visible).map((e, i) => (
            <motion.li
              key={`${e}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-md border border-zinc-600 bg-zinc-800/80 px-2 py-1 font-mono text-[10px] text-emerald-100"
            >
              + {e}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
