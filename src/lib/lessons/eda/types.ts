export type EdaStageConfig =
  | { kind: "eda-bus" }
  | {
      kind: "message-flow";
      jsonPreview: string;
      serverHint: string;
      brokerHint: string;
      clientHint: string;
    }
  | { kind: "brokers-compare" }
  | { kind: "dlq-sim" }
  | { kind: "cqrs-split" }
  | { kind: "sourcing-timeline" }
  | { kind: "ecst-payload" }
  | { kind: "tradeoffs-interactive" }
  | { kind: "none" };

export type SeniorInsight = {
  id: string;
  title: string;
  body: string;
};

/** Sezioni narrative per approfondimento teorico in pagina. */
export type EdaTheorySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

/** Laboratorio visivo (canvas sketch + Sandpack a step). */
export type EdaArchitectureLabKind = "pubsub-sketch";

export type EdaPageDefinition = {
  /** Chiave URL: "" per overview, altrimenti es. design-patterns/event-notification */
  pathKey: string;
  title: string;
  summary: string;
  /** Approfondimento testuale strutturato (glossario, definizioni, flussi mentali). */
  theorySections: EdaTheorySection[];
  mermaid?: string;
  jsonContract: string;
  serverSnippet: string;
  clientSnippet: string;
  seniorNotes: string[];
  seniorInsights: SeniorInsight[];
  sandpack?: Record<string, string>;
  /** Template Sandpack per il lab a pagina intera. */
  sandpackTemplate?: "vanilla-ts" | "react-ts";
  /** Titolo opzionale sopra il playground. */
  labTitle?: string;
  /** Istruzioni brevi per il lab (sotto il titolo). */
  labHint?: string;
  /** Lab architettonico (sostituisce il Sandpack standard quando presente). */
  architectureLab?: { kind: EdaArchitectureLabKind };
  stage: EdaStageConfig;
};
