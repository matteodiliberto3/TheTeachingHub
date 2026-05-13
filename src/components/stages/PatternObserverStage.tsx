"use client";

import { useReducedMotion } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const subs = ["UI", "Regole", "Audit"];

export function PatternObserverStage() {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(20);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setValue((v) => (v >= 28 ? 18 : v + 2));
    }, 1400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">Subject</p>
          <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {value}°C
          </p>
        </div>
        <button
          type="button"
          onClick={() => setValue((v) => v + 1)}
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Incrementa stato
        </button>
      </div>

      <div className="grid w-full grid-cols-3 gap-2">
        {subs.map((name) => (
          <motion.div
            key={name}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-center text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            animate={{
              boxShadow:
                value % 2 === 0
                  ? "0 0 0 rgba(0,0,0,0)"
                  : "0 0 0 2px rgba(99,102,241,0.45)",
            }}
            transition={{ duration: 0.35 }}
          >
            {name}
            <AnimatePresence mode="wait">
              <motion.p
                key={value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-[10px] text-zinc-500"
              >
                update({value})
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-[11px] text-zinc-500">
        Ogni subscriber reagisce al cambio stato senza conoscere gli altri.
      </p>
    </div>
  );
}
