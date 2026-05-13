export type EdaNavLink = {
  href: string;
  label: string;
  description?: string;
};

export type EdaNavSection = {
  id: string;
  index: string;
  title: string;
  links: EdaNavLink[];
};

/** Percorso a due livelli allineato alla mind map EDA (NotebookLM-style). */
export const edaContextualNav: EdaNavSection[] = [
  {
    id: "core",
    index: "01",
    title: "Core Concepts",
    links: [
      {
        href: "/learn/eda",
        label: "Panoramica EDA",
        description: "Mind map e ingresso nel modulo",
      },
      {
        href: "/learn/eda/core-concepts",
        label: "Le basi",
        description: "Pub-Sub, broker, disaccoppiamento",
      },
    ],
  },
  {
    id: "patterns",
    index: "02",
    title: "Design Patterns",
    links: [
      {
        href: "/learn/eda/design-patterns/event-notification",
        label: "Event Notification",
        description: "Segnale leggero, fetch dettagli",
      },
      {
        href: "/learn/eda/design-patterns/event-carried-state-transfer",
        label: "Event Carried State Transfer",
        description: "Payload con old/new state",
      },
      {
        href: "/learn/eda/design-patterns/event-sourcing",
        label: "Event Sourcing",
        description: "Append-only, ricostruzione stato",
      },
      {
        href: "/learn/eda/design-patterns/cqrs",
        label: "CQRS",
        description: "Scrittura vs lettura",
      },
    ],
  },
  {
    id: "reliability",
    index: "03",
    title: "Reliability & Tech",
    links: [
      {
        href: "/learn/eda/reliability-tech/messaging-brokers",
        label: "Messaging Brokers",
        description: "RabbitMQ vs Kafka",
      },
      {
        href: "/learn/eda/reliability-tech/reliability",
        label: "DLQ & Retry",
        description: "Ack, DLQ, policy di retry",
      },
      {
        href: "/learn/eda/reliability-tech/data-storage",
        label: "Data Storage",
        description: "Event store, Postgres, viste materializzate",
      },
    ],
  },
  {
    id: "tradeoffs",
    index: "04",
    title: "Trade-offs",
    links: [
      {
        href: "/learn/eda/trade-offs",
        label: "Pros & Cons",
        description: "Prospettiva senior",
      },
    ],
  },
  {
    id: "labs",
    index: "05",
    title: "Real-World Labs",
    links: [
      {
        href: "/learn/eda/labs/e-commerce",
        label: "E-commerce",
        description: "Ordini e notifiche",
      },
      {
        href: "/learn/eda/labs/multiplayer",
        label: "Multiplayer",
        description: "Stato replicato",
      },
    ],
  },
];

export function flattenEdaNavLinks(): EdaNavLink[] {
  return edaContextualNav.flatMap((s) => s.links);
}
