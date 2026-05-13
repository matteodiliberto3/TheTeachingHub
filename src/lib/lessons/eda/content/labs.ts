import type { EdaPageDefinition } from "../types";

const styles = `body { margin: 0; font-family: system-ui, sans-serif; background: #09090b; color: #e4e4e7; }
#app { padding: 12px; font-size: 13px; line-height: 1.5; }
kbd { background: #27272a; padding: 2px 6px; border-radius: 4px; }`;

export type EdaLabBundle = {
  files: Record<string, string>;
  template?: NonNullable<EdaPageDefinition["sandpackTemplate"]>;
  labTitle?: string;
  labHint?: string;
};

export const edaLabStyles: Record<string, string> = {
  "/styles.css": styles,
};

export const EDA_LABS: Partial<Record<string, EdaLabBundle>> = {
  "": {
    labTitle: "Lab: bus in-process (pub/sub)",
    labHint:
      "Esegui e apri la Console: due subscriber sullo stesso topic ricevono lo stesso evento. È il nucleo concettuale prima di Rabbit/Kafka.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type Listener = (payload: unknown) => void;

class MiniBus {
  private subs = new Map<string, Set<Listener>>();
  publish(topic: string, payload: unknown) {
    const set = this.subs.get(topic);
    if (!set) return;
    set.forEach((l) => l(payload));
  }
  subscribe(topic: string, listener: Listener) {
    if (!this.subs.has(topic)) this.subs.set(topic, new Set());
    this.subs.get(topic)!.add(listener);
    return () => this.subs.get(topic)!.delete(listener);
  }
}

const bus = new MiniBus();
const unsubBill = bus.subscribe("order.placed", (p) =>
  console.log("[billing] ricevuto:", p),
);
bus.subscribe("order.placed", (p) => console.log("[notify] ricevuto:", p));
bus.publish("order.placed", { orderId: "ord_1", totalCents: 4990 });
unsubBill();
console.log("Dopo unsubscribe billing, un solo subscriber attivo sul topic.");
bus.publish("order.placed", { orderId: "ord_2", totalCents: 1200 });

document.getElementById("app")!.innerHTML =
  "<p>Output in <kbd>Console</kbd>. Prova ad aggiungere un terzo <code>subscribe</code>.</p>";
`,
    },
  },
  "core-concepts": {
    labTitle: "Lab: at-least-once e dedup",
    labHint:
      "Simula un broker che può riconsegnare lo stesso messaggio: il consumer deve essere idempotente (dedup per messageId).",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type Msg = { id: string; body: string };

class AtLeastOnceMailbox {
  private inbox: Msg[] = [];
  /** Simula retry del broker: lo stesso id può comparire due volte. */
  enqueue(m: Msg) {
    this.inbox.push(m);
  }
  deliverBatch(): Msg[] {
    return this.inbox.splice(0, this.inbox.length);
  }
}

const processed = new Set<string>();

function handle(msg: Msg) {
  if (processed.has(msg.id)) {
    console.log("SKIP duplicato:", msg.id);
    return;
  }
  processed.add(msg.id);
  console.log("APPLY:", msg.body);
}

const box = new AtLeastOnceMailbox();
box.enqueue({ id: "m1", body: "Paga 10€" });
box.enqueue({ id: "m1", body: "Paga 10€" }); // duplicato realistico

for (const m of box.deliverBatch()) handle(m);

document.getElementById("app")!.innerHTML =
  "<p>Guarda la console: il secondo <code>m1</code> viene scartato grazie all’idempotenza.</p>";
`,
    },
  },
  "design-patterns/event-notification": {
    labTitle: "Lab: notifica leggera + fetch simulato",
    labHint:
      "Dopo l’evento minimale, il client carica lo stato completo (qui mockato). Estendi con batching o cache.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type CloudEvent<T> = { type: string; data: T };

const fakeApi: Record<string, unknown> = {
  ord_9f3c2a: { id: "ord_9f3c2a", lines: 2, totalCents: 8900 },
};

async function fetchOrderDetail(orderId: string) {
  await new Promise((r) => setTimeout(r, 120));
  return fakeApi[orderId];
}

function onNotification(ce: CloudEvent<{ orderId: string; changeType: string }>) {
  console.log("Notifica ricevuta:", ce.data);
  return fetchOrderDetail(ce.data.orderId);
}

void (async () => {
  const ce: CloudEvent<{ orderId: string; changeType: string }> = {
    type: "com.example.order.notification",
    data: { orderId: "ord_9f3c2a", changeType: "PLACED" },
  };
  const detail = await onNotification(ce);
  console.log("Dettaglio caricato post-evento:", detail);
  document.getElementById("app")!.innerHTML =
    "<p>Flusso: evento piccolo → <code>fetchOrderDetail</code>. Vedi console.</p>";
})();
`,
    },
  },
  "design-patterns/event-carried-state-transfer": {
    labTitle: "Lab: merge del delta sul read model",
    labHint:
      "Applica <code>current</code> sullo stato locale senza round-trip. Aggiungi validazione schema se il payload cresce.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type Row = { sku: string; qty: number; price: number };

function applyEcst(local: Row, prev: Row, next: Row): Row {
  if (local.sku !== prev.sku) {
    console.warn("Conflitto: snapshot locale diverso da previous dell’evento");
    return local;
  }
  return { ...local, ...next };
}

let cart: Row = { sku: "A1", qty: 1, price: 12.5 };
const ev = {
  previous: { sku: "A1", qty: 1, price: 12.5 } as Row,
  current: { sku: "A1", qty: 2, price: 11.0 } as Row,
};
console.log("Prima:", cart);
cart = applyEcst(cart, ev.previous, ev.current);
console.log("Dopo ECST:", cart);

document.getElementById("app")!.innerHTML =
  "<p>Lo stato locale è stato aggiornato solo con i campi dell’evento (pattern ECST).</p>";
`,
    },
  },
  "design-patterns/event-sourcing": {
    labTitle: "Lab: fold degli eventi → stato",
    labHint:
      "La funzione <code>reduce</code> è la proiezione: in produzione versionala quando cambi la semantica degli eventi legacy.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type Ev =
  | { type: "FundsReserved"; amount: number }
  | { type: "FundsCaptured"; amount: number }
  | { type: "FundsReleased"; amount: number };

type State = { balance: number; reserved: number };

const initial: State = { balance: 1000, reserved: 0 };

function apply(s: State, e: Ev): State {
  switch (e.type) {
    case "FundsReserved":
      return { ...s, balance: s.balance - e.amount, reserved: s.reserved + e.amount };
    case "FundsCaptured":
      return { ...s, reserved: s.reserved - e.amount };
    case "FundsReleased":
      return { ...s, balance: s.balance + e.amount, reserved: s.reserved - e.amount };
  }
}

const stream: Ev[] = [
  { type: "FundsReserved", amount: 500 },
  { type: "FundsCaptured", amount: 500 },
];

const final = stream.reduce(apply, initial);
console.log("Stato ricostruito:", final);

document.getElementById("app")!.innerHTML =
  "<p>Riproduzione deterministica: stesso stream → stesso stato finale.</p>";
`,
    },
  },
  "design-patterns/cqrs": {
    labTitle: "Lab: comando vs query (in memoria)",
    labHint:
      "Il write model emette un evento; il read model è aggiornato da un handler separato (simula worker asincrono).",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type OrderView = { id: string; status: string; totalCents: number };

const readModel = new Map<string, OrderView>();

type Cmd = { name: "PlaceOrder"; customerId: string; id: string; totalCents: number };

function handleCommand(cmd: Cmd) {
  if (cmd.name !== "PlaceOrder") return;
  // write side: validazioni + persistenza immaginata
  const ev = {
    type: "OrderPlaced",
    payload: { id: cmd.id, customerId: cmd.customerId, totalCents: cmd.totalCents },
  };
  console.log("Emit event:", ev);
  // projection async
  queueMicrotask(() => {
    readModel.set(cmd.id, {
      id: cmd.id,
      status: "PLACED",
      totalCents: cmd.totalCents,
    });
    console.log("Read model aggiornato (ritardo simulato)");
  });
}

handleCommand({ name: "PlaceOrder", customerId: "c1", id: "o1", totalCents: 4200 });
setTimeout(() => {
  console.log("Query GET /orders/o1 →", readModel.get("o1"));
  document.getElementById("app")!.innerHTML =
    "<p>Nota il ritardo tra comando e lettura: eventual consistency di progetto.</p>";
}, 0);
`,
    },
  },
  "reliability-tech/messaging-brokers": {
    labTitle: "Lab: routing key vs partition key (concetto)",
    labHint:
      "Due funzioni pure che mostrano come scegliere la chiave di smistamento in stile Rabbit vs Kafka.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

function rabbitRoute(exchange: string, routingKey: string) {
  return { exchange, routingKey, note: "Topic/fanout/direct bindings sul broker" };
}

function kafkaPartition(topic: string, key: string, partitions: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return { topic, partition: h % partitions, note: "Ordering per chiave dentro la partizione" };
}

console.log("Rabbit:", rabbitRoute("orders", "orders.eu.paid"));
console.log("Kafka:", kafkaPartition("orders", "cust_77", 12));

document.getElementById("app")!.innerHTML =
  "<p>Esperimenta cambiando <code>routingKey</code> o la chiave Kafka e osserva la console.</p>";
`,
    },
  },
  "reliability-tech/reliability": {
    labTitle: "Lab: backoff e decisione DLQ",
    labHint:
      "Policy dichiarativa: dopo N tentativi con backoff esponenziale, marca per DLQ. Collegalo a metriche in produzione.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

const policy = { maxRetries: 3, backoffMs: [50, 200, 800] };

async function processWithRetry(id: string, op: () => Promise<void>) {
  for (let attempt = 0; attempt < policy.maxRetries; attempt++) {
    try {
      await op();
      console.log(id, "OK al tentativo", attempt + 1);
      return;
    } catch {
      const wait = policy.backoffMs[Math.min(attempt, policy.backoffMs.length - 1)];
      console.warn(id, "fail tentativo", attempt + 1, "sleep", wait);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  console.error(id, "→ DLQ (retry esauriti)");
}

let fails = 0;
void processWithRetry("pay-1", async () => {
  fails++;
  if (fails < 3) throw new Error("timeout");
});

setTimeout(() => {
  document.getElementById("app")!.innerHTML =
    "<p>Apri la console per vedere i tentativi e l’invio logico in DLQ.</p>";
}, 2000);
`,
    },
  },
  "reliability-tech/data-storage": {
    labTitle: "Lab: proiezione + versione read model",
    labHint:
      "Traccia <code>lastAppliedPosition</code> come farebbe un worker che consuma dallo stream.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type Event = { pos: number; type: string; delta: number };

let readView = { revenueCents: 0 };
let lastApplied = 0;

function project(events: Event[]) {
  for (const e of events) {
    if (e.pos <= lastApplied) continue;
    if (e.type === "OrderPaid") readView = { revenueCents: readView.revenueCents + e.delta };
    lastApplied = e.pos;
  }
}

project([
  { pos: 1, type: "OrderPaid", delta: 1000 },
  { pos: 2, type: "OrderPaid", delta: 500 },
  { pos: 2, type: "OrderPaid", delta: 500 }, // duplicato pos: ignorato
]);
console.log({ readView, lastApplied });

document.getElementById("app")!.innerHTML =
  "<p>La posizione dello stream funge da cursore idempotente per la MV.</p>";
`,
    },
  },
  "trade-offs": {
    labTitle: "Lab: scorecard EDA (decisione guidata)",
    labHint:
      "Somma i pesi: se superi la soglia, l’EDA strutturata probabilmente paga il costo operativo.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

const signals = [
  { name: "Team multipli su stesso dominio", weight: 3 },
  { name: "Integrazioni >6 confini di servizio", weight: 2 },
  { name: "Bisogno di audit/replay", weight: 3 },
  { name: "CRUD interno senza integrazioni", weight: -3 },
];

const score = signals.reduce((s, x) => s + x.weight, 0);
console.table(signals);
console.log("Score sintetico:", score, score >= 4 ? "→ valuta EDA seria" : "→ parti semplice, evolvi se serve");

document.getElementById("app")!.innerHTML =
  "<p>Modifica i pesi in <code>signals</code> per riflettere il tuo prodotto.</p>";
`,
    },
  },
  "labs/e-commerce": {
    labTitle: "Lab: coreografia ordine (happy path)",
    labHint:
      "Catena di handler: ogni step pubblica il prossimo evento. In produzione aggiungi compensazioni (saga) dove serve.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type CE = { type: string; data: Record<string, unknown> };

class Bus {
  private h = new Map<string, Array<(d: Record<string, unknown>) => void>>();
  on(t: string, fn: (d: Record<string, unknown>) => void) {
    if (!this.h.has(t)) this.h.set(t, []);
    this.h.get(t)!.push(fn);
  }
  pub(ce: CE) {
    console.log("→", ce.type);
    this.h.get(ce.type)?.forEach((fn) => fn(ce.data));
  }
}

const bus = new Bus();
bus.on("order.placed", (d) =>
  bus.pub({ type: "payment.requested", data: { orderId: d.orderId } }),
);
bus.on("payment.requested", (d) =>
  bus.pub({ type: "inventory.reserved", data: { orderId: d.orderId } }),
);
bus.on("inventory.reserved", (d) =>
  bus.pub({ type: "notification.send", data: { orderId: d.orderId } }),
);

bus.pub({ type: "order.placed", data: { orderId: "ord_1001" } });

document.getElementById("app")!.innerHTML =
  "<p>Coreografia: nessun orchestratore centrale; attenzione al grafo di dipendenze.</p>";
`,
    },
  },
  "labs/multiplayer": {
    labTitle: "Lab: sequenza e riconciliazione",
    labHint:
      "Simula predizione client + frame autoritativo: se seq server > locale, resetta allo stato server.",
    files: {
      ...edaLabStyles,
      "/index.ts": `import "./styles.css";

type Frame = { seq: number; x: number };

let predicted: Frame = { seq: 100, x: 0 };
let lastAuth: Frame = { seq: 99, x: 0 };

function clientInput(dx: number) {
  predicted = { seq: predicted.seq + 1, x: predicted.x + dx };
  console.log("predetto", predicted);
}

function authoritative(f: Frame) {
  if (f.seq < predicted.seq) {
    console.warn("Frame vecchio ignorato");
    return;
  }
  lastAuth = f;
  predicted = { ...f };
  console.log("riconciliato", predicted);
}

clientInput(1);
clientInput(1);
authoritative({ seq: 102, x: 1 }); // esempio: server corregge

document.getElementById("app")!.innerHTML =
  "<p>Estendi con buffer di input e rollback smooth per UX migliore.</p>";
`,
    },
  },
};
