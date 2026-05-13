import type { LessonDefinition } from "./types";

export const patternsLesson: LessonDefinition = {
  slug: "patterns",
  title: "Design pattern (flusso animato)",
  shortTitle: "Pattern",
  summary:
    "Observer, Strategy e Factory: intent, collaborazioni e quando evitarli.",
  mermaid: `classDiagram
    class Subject {
      +attach(Observer)
      +notify()
    }
    class Observer {
      <<interface>>
      +update()
    }
    Subject --> Observer`,
  jsonContract: `{
  "pattern": "observer",
  "state": { "temperatureC": 22.4 },
  "subscribers": ["ui.dashboard", "rules.engine", "audit.logger"]
}`,
  serverSnippet: `// Observer — notifica automatica ai subscriber
type Observer<T> = (value: T) => void;

export class Observable<T> {
  private value: T;
  private observers = new Set<Observer<T>>();

  constructor(initial: T) {
    this.value = initial;
  }

  subscribe(fn: Observer<T>) {
    this.observers.add(fn);
    fn(this.value);
    return () => this.observers.delete(fn);
  }

  set(next: T) {
    this.value = next;
    for (const fn of this.observers) fn(next);
  }
}`,
  clientSnippet: `// React: pattern Observer è già nel modello stato + effetti
import { useSyncExternalStore } from "react";

const store = createExternalStore(0);

export function Counter() {
  const n = useSyncExternalStore(store.subscribe, store.get);
  return <button onClick={() => store.set(n + 1)}>{n}</button>;
}`,
  seniorNotes: [
    "Singleton: utile per risorse costose (logger), pericoloso per test e concorrenza se nasconde stato globale.",
    "Factory: nasconde costruttori concreti; evita se la gerarchia cresce senza dominio reale (over-engineering).",
    "Strategy: preferisci funzioni pure + map di strategie quando non ti serve polimorfismo OO esplicito.",
  ],
  sandpack: {
    "/index.ts": `import "./styles.css";

export type Listener = (v: number) => void;

export class Cell {
  private v = 0;
  private ls = new Set<Listener>();
  sub(l: Listener) {
    this.ls.add(l);
    l(this.v);
    return () => this.ls.delete(l);
  }
  set(n: number) {
    this.v = n;
    this.ls.forEach((l) => l(n));
  }
}

const c = new Cell();
c.sub((n) => console.log("A", n));
c.sub((n) => console.log("B", n));
c.set(1);

const app = document.getElementById("app");
if (app) {
  app.innerHTML =
    "<p style='padding:10px;font-family:system-ui'>Output in <strong>Console</strong> (Observer).</p>";
}
`,
  },
};
