import type { EdaPageDefinition } from "./types";
import { EDA_LABS } from "./content/labs";
import { getEdaTheory } from "./content/theory";

type EdaPageSeed = Omit<
  EdaPageDefinition,
  "theorySections" | "sandpack" | "sandpackTemplate" | "labTitle" | "labHint"
>;

function buildPage(seed: EdaPageSeed): EdaPageDefinition {
  const lab = EDA_LABS[seed.pathKey];
  return {
    ...seed,
    theorySections: getEdaTheory(seed.pathKey),
    ...(lab
      ? {
          sandpack: lab.files,
          ...(lab.template ? { sandpackTemplate: lab.template } : {}),
          ...(lab.labTitle ? { labTitle: lab.labTitle } : {}),
          ...(lab.labHint ? { labHint: lab.labHint } : {}),
        }
      : {}),
  };
}

/** Standard CloudEvents 1.0 — coerenza tra tutti gli esempi. */
const CE_HEADER = `"specversion": "1.0",
  "source": "/orders-service",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "time": "2026-05-13T12:00:00.000Z",
  "datacontenttype": "application/json"`;

const overviewMindMap = `flowchart LR
  Root["EDA"]
  Root --> Core["Core Concepts"]
  Root --> Patterns["Design Patterns"]
  Root --> Pros["Benefits"]
  Root --> Cons["Drawbacks"]
  Root --> UC["Use Cases"]
  Root --> Tech["Technology"]

  Core --> C1["Pub/Sub"]
  Core --> C2["Async comms"]
  Core --> C3["Broker"]

  Patterns --> P1["Event Notification"]
  Patterns --> P2["ECST"]
  Patterns --> P3["Event Sourcing"]
  Patterns --> P4["CQRS"]

  Tech --> T1["RabbitMQ / Kafka"]
  Tech --> T2["DLQ / Retries"]
  Tech --> T3["Storage / MV"]`;

function ce(type: string, dataJson: string): string {
  return `{
  ${CE_HEADER},
  "type": "${type}",
  "data": ${dataJson}
}`;
}

const pagesSeed: EdaPageSeed[] = [
  {
    pathKey: "",
    title: "Event-Driven Architecture",
    summary:
      "Entra nell'ecosistema EDA: la sidebar ti guida dalla mappa mentale a un percorso strutturato — Visual, contratto CloudEvents, codice server/client e cicche del senior.",
    mermaid: overviewMindMap,
    jsonContract: ce("com.example.hub.eda.map", `{
    "module": "eda",
    "version": 1,
    "sections": ["core", "patterns", "reliability", "tradeoffs", "labs"]
  }`),
    serverSnippet: `// Tutti gli esempi EDA del hub usano CloudEvents 1.0
// Vedi: https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md
export function toCloudEvent(type: string, source: string, data: unknown) {
  return {
    specversion: "1.0",
    type,
    source,
    id: crypto.randomUUID(),
    time: new Date().toISOString(),
    datacontenttype: "application/json",
    data,
  };
}`,
    clientSnippet: `// Parsing lato client (SSE/WebSocket/MessageChannel)
function onCloudEvent(raw: string) {
  const ev = JSON.parse(raw) as {
    type: string;
    data: unknown;
  };
  if (ev.type === "com.example.order.notification") {
    // Payload leggero: spesso serve un fetch per i dettagli
    return { kind: "notification", ref: ev.data };
  }
  return { kind: "other", ev };
}`,
    seniorNotes: [
      "Usa sempre `id` univoci e correlazione (`traceparent` o campo custom) per attraversare più servizi.",
      "Versiona i tipi (`com.example.order.v2`) quando rompi compatibilità sul payload.",
    ],
    seniorInsights: [
      {
        id: "ov-1",
        title: "Debugging complexity",
        body: "Con molti consumer, un bug diventa una storia distribuita: traccia con Correlation ID / Trace ID su ogni CloudEvent e propaga nei log strutturati.",
      },
      {
        id: "ov-2",
        title: "Non partire da Kafka se non serve",
        body: "Se hai un solo servizio e poche code, RabbitMQ o persino un bus in-process possono ridurre il carico operativo. Scala il broker con il dominio.",
      },
    ],
    stage: { kind: "eda-bus" },
  },
  {
    pathKey: "core-concepts",
    title: "Core Concepts",
    summary:
      "Publish-Subscribe, comunicazione asincrona, broker e disaccoppiamento publisher/consumer: le fondamenta prima dei pattern avanzati.",
    mermaid: `flowchart LR
      Pub[Publisher] -->|event| B[(Broker / Bus)]
      B --> S1[Subscriber A]
      B --> S2[Subscriber B]
      B --> S3[Subscriber C]`,
    jsonContract: ce("com.example.messaging.topic.subscribed", `{
    "topic": "orders.placed",
    "subscriberId": "billing-svc",
    "qos": "at-least-once"
  }`),
    serverSnippet: `// Publisher: non conosce i subscriber (disaccoppiamento)
await channel.publish("orders", "orders.placed", Buffer.from(JSON.stringify(ce)));

// Broker (es. RabbitMQ exchange) smista verso code dedicate`,
    clientSnippet: `// Observer vs Pub-Sub nel browser:
// — Observer: stesso processo, oggetti in memoria
// — Pub-Sub esteso: WebSocket/SSE verso un gateway che fa fan-out`,
    seniorNotes: [
      "Il broker introduce un hop di latenza ma rimuove accoppiamento temporale: i consumer possono essere offline e recuperare (a seconda del modello).",
    ],
    seniorInsights: [
      {
        id: "cc-1",
        title: "Eventual consistency",
        body: "Se l'utente ricarica e non vede ancora il dato, valuta optimistic UI sul client e stati di caricamento espliciti; il read model può essere indietro di secondi.",
      },
    ],
    architectureLab: { kind: "pubsub-sketch" },
    stage: { kind: "eda-bus" },
  },
  {
    pathKey: "design-patterns/event-notification",
    title: "Event Notification",
    summary:
      "Un segnale leggero (spesso solo ID e tipo) che invita il consumer a recuperare i dettagli via API: alto disaccoppiamento, payload minimi sul bus.",
    jsonContract: ce("com.example.order.notification", `{
    "orderId": "ord_9f3c2a",
    "changeType": "PLACED"
  }`),
    serverSnippet: `// Server: emit leggero (fire-and-forget verso il broker)
await bus.publish(
  "order.notification",
  toCloudEvent("com.example.order.notification", "/orders", {
    orderId: "ord_9f3c2a",
    changeType: "PLACED",
  }),
);`,
    clientSnippet: `// Client: alla notifica, fetch per stato completo
eventSource.addEventListener("com.example.order.notification", (e) => {
  const { orderId } = JSON.parse(e.data).data;
  void queryClient.prefetchQuery(["order", orderId], () => fetchOrder(orderId));
});`,
    seniorNotes: [
      "Evita chatty traffic: batcha i fetch o usa etag/versioning sul read API.",
    ],
    seniorInsights: [
      {
        id: "en-1",
        title: "Implementation overhead",
        body: "Ogni notifica diventa almeno due round-trip (evento + fetch): monitora QPS sul servizio di lettura e metti cache/CDN dove ha senso.",
      },
    ],
    stage: {
      kind: "message-flow",
      jsonPreview: `{ "orderId": "ord_9f3c2a", "changeType": "PLACED" }`,
      serverHint: "Emit CloudEvent minimale",
      brokerHint: "Fan-out verso consumer",
      clientHint: "Fetch dettagli ordine",
    },
  },
  {
    pathKey: "design-patterns/event-carried-state-transfer",
    title: "Event Carried State Transfer",
    summary:
      "Il messaggio trasporta il delta (o lo stato) necessario al consumer per aggiornare il proprio modello senza chiamate aggiuntive: UI più atomica, payload più grandi.",
    jsonContract: ce("com.example.profile.updated", `{
    "userId": "usr_42",
    "previous": { "displayName": "Ada", "avatarUrl": "/a.png" },
    "current": { "displayName": "Ada L.", "avatarUrl": "/b.png" }
  }`),
    serverSnippet: `await bus.publish(
  "profile.updated",
  toCloudEvent("com.example.profile.updated", "/profiles", {
    userId: "usr_42",
    previous: oldRow,
    current: newRow,
  }),
);`,
    clientSnippet: `// Client: applica patch locale atomica alla UI
function onProfileUpdated(ce: CloudEvent<ProfileDelta>) {
  mergeProfile(ce.data.userId, ce.data.current);
}`,
    seniorNotes: [
      "Attenzione a PII nel bus: maschera o cifra campi sensibili e applica retention policy.",
    ],
    seniorInsights: [
      {
        id: "ecst-1",
        title: "Increased storage & fan-out",
        body: "Payload ricchi moltiplicano byte su rete e log: valuta compression, snapshot periodici e soglie massime sul message size.",
      },
    ],
    stage: { kind: "ecst-payload" },
  },
  {
    pathKey: "design-patterns/event-sourcing",
    title: "Event Sourcing",
    summary:
      "La verità è la sequenza append-only di eventi; lo stato è una riduzione (o snapshot + replay). Audit e temporal queries diventano naturali.",
    jsonContract: ce("com.example.ledger.append", `{
    "streamId": "acc_7712",
    "expectedVersion": 12,
    "events": [
      { "type": "FundsReserved", "payload": { "amount": 5000 } },
      { "type": "FundsCaptured", "payload": { "amount": 5000 } }
    ]
  }`),
    serverSnippet: `// Append-only store (concetto): niente UPDATE in-place sugli eventi
await eventStore.append("acc_7712", [
  { type: "FundsReserved", payload: { amount: 5000 } },
  { type: "FundsCaptured", payload: { amount: 5000 } },
], { expectedVersion: 12 });`,
    clientSnippet: `// Ricostruzione stato nel client (es. debug / admin)
function project(events: DomainEvent[]) {
  return events.reduce((state, e) => apply(state, e), initialState);
}`,
    seniorNotes: [
      "Gli snapshot riducono il replay lungo; versiona le funzioni di proiezione quando cambi la semantica degli eventi legacy.",
    ],
    seniorInsights: [
      {
        id: "es-1",
        title: "Implementation overhead",
        body: "Non usare Event Sourcing se ti basta una tabella Users con CRUD: aumenti storage, migrazioni e debugging senza guadagno dominio.",
      },
    ],
    stage: { kind: "sourcing-timeline" },
  },
  {
    pathKey: "design-patterns/cqrs",
    title: "CQRS",
    summary:
      "Separa il modello di scrittura (comandi, invarianti forti) dal modello di lettura (query, viste denormalizzate, materialized views).",
    jsonContract: ce("com.example.order.command", `{
    "name": "PlaceOrder",
    "payload": { "customerId": "cus_1", "lines": [] }
  }`),
    serverSnippet: `// Write model: valida invarianti, emette eventi
await commandBus.handle(
  new PlaceOrder(cmd),
);

// Read model: aggiornato da worker che consuma gli stessi eventi
// (spesso in DB separato o schema dedicato)`,
    clientSnippet: `// Client: query leggere vs comandi espliciti
// Query: GET /orders/:id (read model)
// Command: POST /orders (write API)`,
    seniorNotes: [
      "La consistenza tra read e write diventa eventualmente consistente per design: documenta SLI per lag accettabile.",
    ],
    seniorInsights: [
      {
        id: "cq-1",
        title: "Eventual consistency",
        body: "Dopo un comando, non assumere che la lista ordini sia immediata: mostra stato pending o invalida la cache del read model quando arriva l'evento di conferma.",
      },
    ],
    stage: { kind: "cqrs-split" },
  },
  {
    pathKey: "reliability-tech/messaging-brokers",
    title: "Messaging Brokers",
    summary:
      "RabbitMQ eccelle su routing flessibile e code intelligenti; Kafka su log distribuito, retention e rilettura per stream processing.",
    jsonContract: ce("com.example.infra.broker.choice", `{
    "rabbit": { "strengths": ["routing", "dlx"] },
    "kafka": { "strengths": ["log", "replay", "consumer groups"] }
  }`),
    serverSnippet: `// Rabbit: exchange + routing key
// Kafka: topic partition, consumer group, offset commit`,
    clientSnippet: `// Nel browser non colleghi mai il broker diretto:
// usa API gateway / SSE / WebSocket curati e autenticati.`,
    seniorNotes: [
      "Kafka shine con volumi alti e pipeline; Rabbit con workflow variabili e TTL per-job.",
    ],
    seniorInsights: [
      {
        id: "mb-1",
        title: "Operational complexity",
        body: "Kafka richiede disciplina su topic design e monitoring consumer lag; Rabbit su cluster HA e policy DLX. Entrambi meritano runbook on-call.",
      },
    ],
    stage: { kind: "brokers-compare" },
  },
  {
    pathKey: "reliability-tech/reliability",
    title: "Reliability: DLQ & Retry",
    summary:
      "Ack/Nack, backoff e Dead Letter Queue: quando un messaggio fallisce, deve finire in un luogo visibile — non sparire nel vuoto.",
    jsonContract: ce("com.example.messaging.dlq", `{
    "originalType": "com.example.payment.charge",
    "failureReason": "timeout",
    "retryCount": 3,
    "deadLetter": true
  }`),
    serverSnippet: `// Pseudo-policy
const policy = {
  maxRetries: 3,
  backoffMs: [200, 2000, 20000],
  dlq: "payments.charge.dlq",
};`,
    clientSnippet: `// UI admin: ispeziona DLQ e requeue controllato
await fetch("/api/ops/dlq/payments", { method: "GET" });`,
    seniorNotes: [
      "Rendi i messaggi DLQ idempotenti al reprocessing: stesso idempotency-key sul side-effect.",
    ],
    seniorInsights: [
      {
        id: "rel-1",
        title: "Poison messages",
        body: "Senza DLQ un consumer bloccato rallenta tutta la partizione/coda: stacca il messaggio tossico, strumenta alert sul tasso DLQ.",
      },
    ],
    stage: { kind: "dlq-sim" },
  },
  {
    pathKey: "reliability-tech/data-storage",
    title: "Data Storage",
    summary:
      "Event store per history immutabile; Postgres con viste materializzate per read model veloci derivati dagli eventi.",
    jsonContract: ce("com.example.readmodel.refresh", `{
    "view": "order_summary_mv",
    "basedOnStream": "orders:ord_1",
    "lastAppliedPosition": 1288
  }`),
    serverSnippet: `// Postgres: MV refreshed da worker
REFRESH MATERIALIZED VIEW CONCURRENTLY order_summary_mv;`,
    clientSnippet: `// Il client legge sempre il read model già proiettato
const res = await fetch("/api/orders/summary");`,
    seniorNotes: [
      "CONCURRENTLY richiede indice unico sulla MV; pianifica window di refresh vs latenza accettata.",
    ],
    seniorInsights: [
      {
        id: "ds-1",
        title: "Storage costs",
        body: "Eventi + MV duplicano dati: misura growth, partiziona tabelle storiche e comprimi archive cold.",
      },
    ],
    stage: { kind: "message-flow", jsonPreview: `{ "view": "order_summary_mv" }`, serverHint: "Worker proietta eventi", brokerHint: "Stream interno (opzionale)", clientHint: "Query read model" },
  },
  {
    pathKey: "trade-offs",
    title: "Trade-offs (Pros & Cons)",
    summary:
      "Sintesi critica: decoupling e scalabilità vs complessità operativa, costi di storage e consistenza eventuale.",
    mermaid: `flowchart TB
      Pros[Benefits] --> P1[Decoupling]
      Pros --> P2[Scale indipendente]
      Cons[Drawbacks] --> C1[Debug distribuito]
      Cons --> C2[Overhead implementativo]
      Cons --> C3[Eventual consistency]`,
    jsonContract: ce("com.example.hub.tradeoff.summary", `{
    "whenEda": "domini con alta fan-out e team maturi",
    "whenNot": "CRUD semplice senza integrazioni"
  }`),
    serverSnippet: `// Checklist pre-architettura
// - Hai bisogno di replay / audit? -> ES/CQRS meritano
// - Hai solo notifiche? -> Notification + outbox può bastare`,
    clientSnippet: `// UX: rendi visibile lo stato intermedio (pending, synced)
// per ridurre percezione di inconsistenza`,
    seniorNotes: [
      "Allinea product e infra su SLO di freschezza dati prima di vendere real-time ovunque.",
    ],
    seniorInsights: [
      {
        id: "to-1",
        title: "Eventual consistency",
        body: "Cosa fai se l'utente aggiorna e non vede il dato? Optimistic UI, skeleton e invalidazione guidata dagli eventi in arrivo.",
      },
      {
        id: "to-2",
        title: "Implementation overhead",
        body: "Evita Event Sourcing se una tabella relazionale e un audit log bastano: meno moving parts, meno costi di storage e meno superficie di bug.",
      },
      {
        id: "to-3",
        title: "Debugging complexity",
        body: "Propagare Correlation ID su ogni hop (API → bus → worker) ti permette di ricostruire la catena su 5 servizi nei log aggregati.",
      },
    ],
    stage: { kind: "tradeoffs-interactive" },
  },
  {
    pathKey: "labs/e-commerce",
    title: "Lab: E-commerce Order Processing",
    summary:
      "Percorso tipico: ordine piazzato → pagamento → inventario → notifica: eventi orchestrano servizi senza orchestratore monolitico.",
    jsonContract: ce("com.example.order.placed", `{
    "orderId": "ord_1001",
    "customerId": "cus_77",
    "totalCents": 4990
  }`),
    serverSnippet: `// Catena eventi (semplificata)
// order.placed -> payment.requested -> inventory.reserved -> notification.send`,
    clientSnippet: `// UI: ascolta solo read model "order status" denormalizzato
subscribe("orders.read", (s) => setStatusChip(s));`,
    seniorNotes: [
      "Saga vs coreografia: qui coreografia; per transazioni distribuite complesse valuta orchestrazione esplicita.",
    ],
    seniorInsights: [
      {
        id: "lab-e-1",
        title: "Speed of execution",
        body: "Il parallelismo dei consumer accelera i percorsi non dipendenti, ma richiede chiarezza su ordine e compensazioni.",
      },
    ],
    stage: { kind: "eda-bus" },
  },
  {
    pathKey: "labs/multiplayer",
    title: "Lab: Multiplayer / Realtime",
    summary:
      "Stato replicato: input come comandi/eventi, simulazione autoritativa o CRDT; il bus trasporta aggiornamenti a bassa latenza.",
    jsonContract: ce("com.example.game.input", `{
    "matchId": "m_9z",
    "seq": 1042,
    "playerId": "p1",
    "input": { "dx": 1, "dy": 0 }
  }`),
    serverSnippet: `// Server autoritativo: valida seq, emette stato o delta
publish("match.m_9z.state", { seq: 1042, positions: {...} });`,
    clientSnippet: `// Client: predizione locale + riconciliazione quando arriva stato server
applyInputLocally(); waitForAuthoritativeFrame();`,
    seniorNotes: [
      "Per FPS stretti valuta UDP custom o protocolli dedicati; EDA su TCP/WebSocket per meta-game e lobby.",
    ],
    seniorInsights: [
      {
        id: "lab-m-1",
        title: "Debugging complexity",
        body: "Replay di match con stesso seed + log eventi rende riproducibili glitch di rete altrimenti 'fantasma'.",
      },
    ],
    stage: { kind: "message-flow", jsonPreview: `{ "matchId": "m_9z", "seq": 1042 }`, serverHint: "Authoritative", brokerHint: "Fan-out match", clientHint: "Reconcile UI" },
  },
];

const pages = pagesSeed.map(buildPage);

const byKey = new Map<string, EdaPageDefinition>();
for (const p of pages) {
  byKey.set(p.pathKey, p);
}

export function getEdaPage(pathKey: string): EdaPageDefinition | undefined {
  return byKey.get(pathKey);
}
