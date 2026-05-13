import { edaLabStyles } from "../content/labs";

/** Messaggio dal Sandpack iframe verso la pagina (canvas). */
export const ARCH_LAB_MESSAGE_SOURCE = "th-arch-lab";

/**
 * index.ts è entry: importa miniBus e chiama runVerify() così ogni reload del preview riesegue i check
 * con il createMiniBus aggiornato. Tutta la logica resta in miniBus.ts.
 */
export const pubSubArchitectureSandpackFiles: Record<string, string> = {
  ...edaLabStyles,
  "/index.ts": `import "./styles.css";
import { runVerify } from "./miniBus";

console.log("[arch-lab] index.ts: entry, import miniBus ok");
/** Entry: ogni ricompilazione riesegue la verifica con il miniBus.ts aggiornato. */
runVerify();
console.log("[arch-lab] index.ts: runVerify() returned");
`,
  "/miniBus.ts": `/**
 * Sostituisci solo il corpo di createMiniBus (stub → Map + Set).
 * Non rimuovere report, labNotify, verify né export runVerify in fondo.
 */

export function createMiniBus(): {
  publish(topic: string, payload: unknown): void;
  subscribe(topic: string, listener: (payload: unknown) => void): () => void;
} {
  return {
    publish(topic, payload) {
      console.log("[arch-lab] createMiniBus.publish (stub)", { topic, payload });
    },
    subscribe(topic, listener) {
      console.log("[arch-lab] createMiniBus.subscribe (stub)", { topic, registra: false });
      return () => {};
    },
  };
}

function report(step: number) {
  console.log("[arch-lab] report → postMessage step", step);
  try {
    window.top?.postMessage({ source: "${ARCH_LAB_MESSAGE_SOURCE}", step }, "*");
  } catch {
    /* ignore */
  }
}

function labNotify(ok: boolean, step: number, message: string) {
  console.log("[arch-lab] labNotify → postMessage", { ok, step, message: message.slice(0, 80) + (message.length > 80 ? "…" : "") });
  try {
    window.top?.postMessage(
      { source: "${ARCH_LAB_MESSAGE_SOURCE}", labNotify: { ok, step, message } },
      "*",
    );
  } catch {
    /* ignore */
  }
}

function verify() {
  let reached = 0;
  console.log("[arch-lab] verify() start");
  try {
    const bus1 = createMiniBus();
    console.log("[arch-lab] verify step1 bus1 creato", bus1);
    let hits = 0;
    bus1.subscribe("orders.placed", () => {
      console.log("[arch-lab] verify step1 listener invocato, hits prima:", hits);
      hits++;
    });
    console.log("[arch-lab] verify step1 dopo subscribe, prima di publish");
    bus1.publish("orders.placed", { id: "o1" });
    console.log("[arch-lab] verify step1 dopo publish, hits=", hits);
    if (hits !== 1) {
      const hint0 =
        hits === 0
          ? "Il listener non è stato chiamato (0). Sostituisci lo stub in createMiniBus (Map + Set) e premi «Verifica»."
          : "ricevuto " + hits + " invece di 1.";
      labNotify(false, 0, "Step 1 non superato: dopo subscribe + publish il listener deve essere chiamato esattamente una volta (" + hint0 + ")");
      return;
    }

    reached = 1;
    report(1);
    console.log("[arch-lab] verify step1 OK, avvio step2");

    const bus2 = createMiniBus();
    let a = 0;
    let b = 0;
    bus2.subscribe("orders.placed", () => {
      a++;
      console.log("[arch-lab] verify step2 listener A, a=", a);
    });
    bus2.subscribe("orders.placed", () => {
      b++;
      console.log("[arch-lab] verify step2 listener B, b=", b);
    });
    bus2.publish("orders.placed", { id: "o2" });
    console.log("[arch-lab] verify step2 dopo publish a=", a, "b=", b);
    if (a !== 1 || b !== 1) {
      labNotify(
        false,
        1,
        "Step 2 non superato: due subscribe sullo stesso topic devono essere entrambi eseguiti a un solo publish (a=" +
          a +
          ", b=" +
          b +
          ").",
      );
      return;
    }

    report(2);
    report(3);
    labNotify(true, 3, "Tutto ok: pub/sub minimo funziona; la mappa è aggiornata.");
    console.log("[arch-lab] verify() completato con successo");
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    console.warn("[arch-lab] verify() catch", e);
    labNotify(false, reached, "Errore in verifica: " + raw);
    console.warn("[lab]", e);
  }
}

export function runVerify(): void {
  console.log("[arch-lab] runVerify() chiamato da index.ts");
  verify();
}

document.getElementById("app")!.innerHTML =
  "<p>Lab pub/sub: log con prefisso <code>[arch-lab]</code> nella <b>Console</b> del browser (seleziona il frame del preview Sandpack se non li vedi). Poi «Verifica».</p>";
`,
};
