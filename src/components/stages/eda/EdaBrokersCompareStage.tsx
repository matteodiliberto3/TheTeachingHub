"use client";

import { useMemo, useState } from "react";

type Scenario = {
  id: string;
  label: string;
  hint: string;
  rabbitScore: number;
  kafkaScore: number;
  rabbitWhy: string;
  kafkaWhy: string;
};

const scenarios: Scenario[] = [
  {
    id: "ops",
    label: "Code operative & workflow",
    hint: "Job variabili, TTL, routing verso team diversi",
    rabbitScore: 5,
    kafkaScore: 3,
    rabbitWhy: "Exchange + binding granulari, DLX, priorità e code per consumer sono il pane quotidiano delle code operative.",
    kafkaWhy: "Si può fare, ma spesso paghi complessità dove un broker classico è più immediato.",
  },
  {
    id: "log",
    label: "Log eventi & analytics",
    hint: "Replay, retention lunga, stream processing",
    rabbitScore: 2,
    kafkaScore: 5,
    rabbitWhy: "Non è impossibile, ma non è il caso d’uso primario: spesso servono plugin e discipline diverse.",
    kafkaWhy: "Log partizionato, retention e consumer groups rendono naturale rileggere e ricalcolare.",
  },
  {
    id: "fanout",
    label: "Fan-out real-time",
    hint: "Notifiche, cache bust, integrazioni read-side",
    rabbitScore: 4,
    kafkaScore: 4,
    rabbitWhy: "Fan-out flessibile con routing; ottimo se messaggi piccoli e latenza sub-ms non è l’unico driver.",
    kafkaWhy: "Fan-out tramite consumer groups multipli sullo stesso topic; ottimo se molti team consumano lo stesso log.",
  },
];

/**
 * Confronto RabbitMQ vs Kafka guidato da scenario: punteggi illustrativi + copy contestuale.
 */
export function EdaBrokersCompareStage() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId) ?? scenarios[0],
    [scenarioId],
  );

  const maxScore = Math.max(scenario.rabbitScore, scenario.kafkaScore);
  const rabbitWin = scenario.rabbitScore === maxScore && scenario.kafkaScore < maxScore;
  const kafkaWin = scenario.kafkaScore === maxScore && scenario.rabbitScore < maxScore;
  const tie = scenario.rabbitScore === scenario.kafkaScore;

  return (
    <div className="flex h-full min-h-[260px] flex-col gap-3 text-[11px]">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenarioId(s.id)}
            className={`rounded-full border px-3 py-1 text-[10px] font-medium transition-colors ${
              s.id === scenarioId
                ? "border-indigo-400 bg-indigo-500/25 text-indigo-50"
                : "border-zinc-600 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] leading-snug text-zinc-500">{scenario.hint}</p>

      <div className="grid flex-1 grid-cols-2 gap-3">
        <div
          className={`rounded-xl border p-3 transition-colors ${
            rabbitWin || (tie && scenario.rabbitScore >= 4)
              ? "border-orange-300 bg-orange-500/15 text-orange-50 ring-1 ring-orange-400/40"
              : "border-orange-400/35 bg-orange-500/10 text-orange-50"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">RabbitMQ</p>
            <span className="rounded bg-orange-950/50 px-2 py-0.5 font-mono text-[10px] text-orange-100">
              {scenario.rabbitScore}/5
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-orange-100/90">{scenario.rabbitWhy}</p>
        </div>
        <div
          className={`rounded-xl border p-3 transition-colors ${
            kafkaWin || (tie && scenario.kafkaScore >= 4)
              ? "border-sky-300 bg-sky-500/15 text-sky-50 ring-1 ring-sky-400/40"
              : "border-sky-400/35 bg-sky-500/10 text-sky-50"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Apache Kafka</p>
            <span className="rounded bg-sky-950/50 px-2 py-0.5 font-mono text-[10px] text-sky-100">
              {scenario.kafkaScore}/5
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-sky-100/90">{scenario.kafkaWhy}</p>
        </div>
      </div>
      {tie && scenario.rabbitScore >= 4 ? (
        <p className="text-center text-[10px] text-zinc-500">
          Pareggio contestuale: approfondisci latenza, retention e skill interne prima di scegliere.
        </p>
      ) : null}
    </div>
  );
}
