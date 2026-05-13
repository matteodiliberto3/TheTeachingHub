"use client";

import { useMemo, useState } from "react";

type Item = { id: string; label: string; edaSignal: number };

const checklist: Item[] = [
  { id: "i1", label: "Più team/servizi consumano gli stessi fatti di business", edaSignal: 2 },
  { id: "i2", label: "Serve audit o replay storico degli eventi", edaSignal: 2 },
  { id: "i3", label: "Alta fan-out (notifiche, cache, analytics sullo stesso evento)", edaSignal: 2 },
  { id: "i4", label: "Carico sincrono già stabile e CRUD senza integrazioni", edaSignal: -2 },
  { id: "i5", label: "Team piccolo senza osservabilità distribuita matura", edaSignal: -1 },
];

/**
 * Scorecard interattiva: spunta i segnali del tuo contesto e leggi una raccomandazione qualitativa.
 */
export function EdaTradeoffsStage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const score = useMemo(
    () => checklist.reduce((s, it) => s + (checked[it.id] ? it.edaSignal : 0), 0),
    [checked],
  );

  const verdict =
    score >= 4
      ? "Spinta verso EDA strutturata: investi in contratti, osservabilità e training."
      : score <= -2
        ? "Spinta verso semplicità: notifiche mirate, outbox locale, crescita graduale."
        : "Zona grigia: prototipa i flussi critici e misura latenza/costi prima di committare.";

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-3 text-[11px]">
      <p className="text-[10px] text-zinc-500">
        Segnala cosa è vero oggi nel tuo prodotto: il punteggio è una bussola, non un verdetto assoluto.
      </p>
      <ul className="max-h-[200px] space-y-2 overflow-auto pr-1">
        {checklist.map((it) => (
          <li key={it.id}>
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/50 p-2 hover:border-zinc-600">
              <input
                type="checkbox"
                className="mt-0.5 accent-indigo-500"
                checked={!!checked[it.id]}
                onChange={() => setChecked((c) => ({ ...c, [it.id]: !c[it.id] }))}
              />
              <span className="text-[10px] leading-snug text-zinc-200">{it.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-indigo-500/35 bg-indigo-500/10 p-3 text-center">
        <p className="font-mono text-lg font-semibold text-indigo-100">{score}</p>
        <p className="mt-1 text-[10px] leading-relaxed text-indigo-100/85">{verdict}</p>
      </div>
    </div>
  );
}
