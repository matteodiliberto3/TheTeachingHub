import type { LessonDefinition } from "./types";

export const edaLesson: LessonDefinition = {
  slug: "eda",
  title: "Event-Driven Architecture (EDA)",
  shortTitle: "EDA",
  summary:
    "Comprendi accoppiamento debole, broker, consumer idempotenti e aggiornamenti UI in tempo reale.",
  mermaid: `flowchart LR
    UI[Client UI] -->|HTTP| API[Order API]
    API -->|publish| BUS[(Event Bus)]
    BUS --> N[Notifications]
    BUS --> B[Billing]
    BUS --> I[Inventory]
    BUS -->|SSE / WS| RT[Realtime gateway]`,
  jsonContract: `{
  "specversion": "1.0",
  "type": "com.example.order.placed",
  "source": "/orders-service",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "time": "2026-05-13T10:15:30.000Z",
  "datacontenttype": "application/json",
  "data": {
    "orderId": "ord_9f3c2a",
    "customerId": "cus_7712",
    "totalCents": 12990,
    "currency": "EUR",
    "lines": [
      { "sku": "BOOK-EDA-001", "qty": 1, "unitPriceCents": 12990 }
    ]
  }
}`,
  serverSnippet: `// Producer (Node) — invio evento al broker (concetto Kafka/RabbitMQ)
import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER!] });
const producer = kafka.producer();

export async function publishOrderPlaced(order: Order) {
  await producer.connect();
  await producer.send({
    topic: "orders.placed",
    messages: [
      {
        key: order.id,
        value: JSON.stringify({
          type: "com.example.order.placed",
          data: order,
        }),
      },
    ],
  });
}`,
  clientSnippet: `// Consumer UI — aggiornamento via SSE (alternativa: WebSocket)
const es = new EventSource("/api/orders/stream");

es.addEventListener("order.placed", (event) => {
  const payload = JSON.parse((event as MessageEvent).data);
  queryClient.setQueryData(["order", payload.orderId], payload);
});

es.onerror = () => {
  es.close();
  // backoff + riconnessione consigliata in produzione
};`,
  seniorNotes: [
    "In produzione tratta ogni delivery come 'at-least-once': l'idempotenza sul consumer evita doppi addebiti o doppie spedizioni.",
    "Versiona il payload (es. schemaVersion) e pianifica la migrazione: gli eventi vivono più a lungo del deploy singolo.",
    "Non esporre il broker direttamente al browser: usa gateway firmati, ACL e payload minimi.",
  ],
  sandpack: {
    "/index.ts": `import "./styles.css";

type Listener = (payload: unknown) => void;

class MiniBus {
  private subs = new Map<string, Set<Listener>>();

  publish(topic: string, payload: unknown) {
    this.subs.get(topic)?.forEach((l) => {
      l(payload);
    });
  }

  subscribe(topic: string, listener: Listener) {
    if (!this.subs.has(topic)) this.subs.set(topic, new Set());
    this.subs.get(topic)!.add(listener);
    return () => this.subs.get(topic)!.delete(listener);
  }
}

const bus = new MiniBus();
bus.subscribe("order.placed", (p) => console.log("Billing:", p));
bus.subscribe("order.placed", (p) => console.log("Notify:", p));
bus.publish("order.placed", { orderId: "ord_1" });

const app = document.getElementById("app");
if (app) {
  app.innerHTML =
    "<p style='padding:10px;font-family:system-ui'>Apri la tab <strong>Console</strong> sotto per i log del bus.</p>";
}
`,
  },
};
