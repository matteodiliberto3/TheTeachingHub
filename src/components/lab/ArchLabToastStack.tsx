"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

export type ArchLabToastVariant = "success" | "error" | "info";

export type ArchLabToastItem = {
  id: string;
  variant: ArchLabToastVariant;
  message: string;
};

type Props = {
  toasts: ArchLabToastItem[];
  onDismiss: (id: string) => void;
};

const VARIANT_STYLES: Record<ArchLabToastVariant, string> = {
  success: "border-emerald-500/40 bg-emerald-950/90 text-emerald-50",
  error: "border-red-500/45 bg-red-950/90 text-red-50",
  info: "border-zinc-500/40 bg-zinc-900/95 text-zinc-100",
};

/**
 * Toast leggeri per il laboratorio architettonico (nessuna dipendenza esterna).
 */
export function ArchLabToastStack({ toasts, onDismiss }: Props) {
  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-200 flex w-[min(100%,22rem)] -translate-x-1/2 flex-col gap-2 px-4 sm:left-auto sm:right-6 sm:translate-x-0"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastRow key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastRow({
  toast,
  onDismiss,
}: {
  toast: ArchLabToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const ms = toast.variant === "info" ? 3200 : 7000;
    const tid = window.setTimeout(() => onDismiss(toast.id), ms);
    return () => window.clearTimeout(tid);
  }, [toast.id, toast.variant, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto rounded-lg border px-3.5 py-2.5 text-sm leading-snug shadow-lg backdrop-blur-sm",
        VARIANT_STYLES[toast.variant],
      )}
    >
      <div className="flex gap-2">
        <p className="min-w-0 flex-1">{toast.message}</p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded px-1.5 text-xs font-medium text-white/70 underline-offset-2 hover:text-white hover:underline"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}
