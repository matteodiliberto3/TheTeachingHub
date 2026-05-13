"use client";

import { useMemo, useState } from "react";

const previous = { qty: 1, price: 12.5 } as const;
const current = { qty: 2, price: 11.0 } as const;

/**
 * ECST: mostra previous/current e applica il merge sullo stato locale simulato.
 */
export function EdaEcstPayloadStage() {
  const [applied, setApplied] = useState(false);
  const local = useMemo(
    () => (applied ? { ...previous, ...current } : { ...previous }),
    [applied],
  );

  return (
    <div className="flex h-full min-h-[240px] flex-col gap-3 text-[10px]">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setApplied((a) => !a)}
          className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-emerald-500"
        >
          {applied ? "Ripristina stato locale" : "Applica evento ECST"}
        </button>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-600 bg-zinc-900/80 p-2 font-mono text-rose-100">
          <p className="mb-1 text-[10px] font-semibold text-rose-200">previous (bus)</p>
          {JSON.stringify(previous)}
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2 font-mono text-emerald-50">
          <p className="mb-1 text-[10px] font-semibold text-emerald-200">current (bus)</p>
          {JSON.stringify(current)}
        </div>
      </div>

      <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-3 font-mono text-amber-50">
        <p className="mb-1 text-[10px] font-semibold text-amber-200">Read model locale (UI)</p>
        {JSON.stringify(local)}
      </div>

      <p className="text-center text-[10px] text-zinc-500">
        {applied
          ? "Nessun fetch: il consumer ha applicato i campi dell’evento sul proprio snapshot."
          : "Prima dell’evento lo snapshot locale coincide con `previous`."}
      </p>
    </div>
  );
}
