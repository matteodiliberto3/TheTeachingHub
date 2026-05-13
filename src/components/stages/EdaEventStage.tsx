"use client";

import { useReducedMotion } from "framer-motion";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const services = [
  { id: "notify", label: "Notifiche", x: 78, y: 18 },
  { id: "bill", label: "Fatturazione", x: 78, y: 48 },
  { id: "inv", label: "Magazzino", x: 78, y: 78 },
];

export function EdaEventStage() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const busPulse = useMotionValue(1);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(busPulse, [1, 1.08, 1], {
      duration: 0.6,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [busPulse, reduce, tick]);

  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-xl overflow-hidden rounded-xl bg-zinc-900 text-zinc-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.35),transparent_55%)]" />
      <div className="absolute left-[8%] top-1/2 w-[28%] -translate-y-1/2 rounded-lg border border-zinc-700 bg-zinc-800/80 p-2 text-[11px] shadow-lg">
        <p className="font-semibold text-indigo-200">Order API</p>
        <p className="mt-1 text-zinc-400">Pubblica `order.placed`</p>
      </div>

      <motion.div
        style={{ scale: reduce ? 1 : busPulse }}
        className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-indigo-400/60 bg-indigo-500/20 text-center text-[11px] font-semibold text-indigo-100 shadow-[0_0_40px_rgba(99,102,241,0.35)]"
      >
        Event Bus
      </motion.div>

      {services.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-lg border border-zinc-700 bg-zinc-800/90 px-2 py-1 text-[10px] font-medium text-zinc-200 shadow"
          style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)" }}
        >
          {s.label}
        </div>
      ))}

      {!reduce &&
        services.map((s, i) => (
          <motion.span
            key={`${tick}-${s.id}`}
            className="absolute left-[30%] top-1/2 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: `${(s.x - 30) * 4}px`,
              y: `${(s.y - 50) * 3}px`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.1, delay: i * 0.12, ease: "easeOut" }}
          />
        ))}

      <p className="absolute bottom-2 left-3 right-3 text-center text-[10px] text-zinc-500">
        Messaggio replicato in parallelo verso consumer indipendenti
      </p>
    </div>
  );
}
