"use client";

import { useCallback, useEffect, useState } from "react";
import { ArchLabToastStack, type ArchLabToastItem } from "@/components/lab/ArchLabToastStack";
import { ArchitectureLabEditorOnly } from "@/components/lab/ArchitectureLabEditorOnly";
import { SketchyPubSubCanvas } from "@/components/lab/SketchyPubSubCanvas";
import {
  ARCH_LAB_MESSAGE_SOURCE,
  pubSubArchitectureSandpackFiles,
} from "@/lib/lessons/eda/labs/pubSubArchitectureLab";
import type { EdaArchitectureLabKind } from "@/lib/lessons/eda/types";

type Props = {
  kind: EdaArchitectureLabKind;
};

const stepHint = (s: number) => {
  if (s >= 3) return "Flusso animato: evento dal publisher verso il broker e verso i subscriber.";
  if (s >= 2) return "Step 2 ok: due subscriber sullo stesso topic ricevono entrambi lo stesso publish.";
  if (s >= 1) return "Step 1 ok: publish/subscribe funziona con un listener.";
  return "Step 1: in miniBus.ts sostituisci lo stub di createMiniBus con Map + Set. verify() è nello stesso file così la ricompilazione è coerente; premi «Verifica».";
};

/**
 * IDE-wide lab: solo editor Sandpack + mappa sketch, sincronizzati via postMessage.
 */
export function ArchitectureLab({ kind }: Props) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [toasts, setToasts] = useState<ArchLabToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((t: Omit<ArchLabToastItem, "id"> & { id?: string }) => {
    const id =
      t.id ??
      (typeof globalThis !== "undefined" &&
      "crypto" in globalThis &&
      typeof globalThis.crypto.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `toast-${Date.now()}`);
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  const handleVerifyPressed = useCallback(() => {
    pushToast({
      variant: "info",
      message:
        "Ricompilazione richiesta. miniBus.ts contiene sia createMiniBus sia verify: l’esito compare tra poco qui e sulla mappa.",
    });
  }, [pushToast]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== ARCH_LAB_MESSAGE_SOURCE) return;

      if (typeof d.step === "number") {
        setStep((prev) => Math.max(prev, d.step));
      }

      const n = d.labNotify;
      if (
        n &&
        typeof n === "object" &&
        typeof n.ok === "boolean" &&
        typeof n.message === "string"
      ) {
        pushToast({
          variant: n.ok ? "success" : "error",
          message: n.message,
        });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [pushToast]);

  if (kind !== "pubsub-sketch") return null;

  if (!mounted) {
    return (
      <div className="flex min-h-[min(50vh,420px)] w-full items-center justify-center bg-[#0c0c0e] py-16 text-sm text-zinc-500">
        Caricamento laboratorio…
      </div>
    );
  }

  return (
    <section
      className="architecture-lab w-full min-w-0 bg-[#0c0c0e] py-10 pb-16 dark:bg-[#070708]"
      aria-labelledby="arch-lab-heading"
    >
      <div className="mx-auto w-full max-w-[min(100%,1920px)] px-4 sm:px-6 lg:px-10 xl:px-14">
        <h2
          id="arch-lab-heading"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/85"
        >
          Laboratorio architettonico
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-400">
          Editor e mappa a metà schermo. Modifichi miniBus.ts: index.ts importa solo quel file, così verify e
          createMiniBus si ricompilano insieme. «Verifica» aggiorna toast e mappa. Il lab Sandpack classico resta
          sopra. Sandpack usa i server CodeSandbox: se in console compaiono timeout verso{" "}
          <code className="text-zinc-300">col.csbops.io</code>, controlla rete, VPN o firewall; in azienda serve
          spesso whitelist. Opzionale in <code className="text-zinc-300">.env.local</code>:{" "}
          <code className="text-zinc-300">NEXT_PUBLIC_SANDPACK_BUNDLER_URL</code> verso un bundler raggiungibile.
        </p>
        <p className="mt-3 text-sm font-medium text-zinc-200">{stepHint(step)}</p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[min(100%,1920px)] px-2 sm:px-4 lg:px-8 xl:px-12">
        <div className="overflow-hidden rounded-lg bg-[#09090b] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/6">
          <div className="grid min-h-[min(72vh,880px)] w-full grid-cols-1 grid-rows-[minmax(min(36vh,340px),1fr)_minmax(min(36vh,340px),1fr)] xl:grid-cols-2 xl:grid-rows-[minmax(min(72vh,880px),1fr)]">
            <div className="flex h-full min-h-0 min-w-0 flex-col border-b border-white/4 bg-[#09090b] xl:border-b-0 xl:border-r xl:border-white/4">
              <ArchitectureLabEditorOnly
                files={pubSubArchitectureSandpackFiles}
                onVerifyPressed={handleVerifyPressed}
              />
            </div>
            <div className="flex h-full min-h-0 min-w-0 items-stretch bg-black/40 p-4 sm:p-5">
              <SketchyPubSubCanvas step={step} className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <ArchLabToastStack toasts={toasts} onDismiss={dismissToast} />
    </section>
  );
}
