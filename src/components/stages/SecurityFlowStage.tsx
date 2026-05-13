"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SecurityFlowStage() {
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setBurst((b) => b + 1), 2000);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="mx-auto grid max-w-xl gap-4 md:grid-cols-2">
      <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
        <p className="text-xs font-semibold uppercase text-zinc-500">Richieste</p>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={`${burst}-${i}`}
              className="h-2 w-6 rounded-full bg-sky-500/80"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
          Traffico legittimo passa; burst anomalo viene attenuato dal rate
          limit.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-rose-500/40 bg-rose-500/5 p-3">
        <p className="text-xs font-semibold uppercase text-rose-700 dark:text-rose-200">
          Payload malevolo
        </p>
        <code className="block rounded-lg bg-zinc-950 p-2 text-[10px] text-rose-100">
          {`<script>alert(1)</script>`}
        </code>
        <motion.div
          key={burst}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-900 dark:text-emerald-100"
        >
          Middleware + CSP: bloccato prima del DOM / DB
        </motion.div>
      </div>
    </div>
  );
}
