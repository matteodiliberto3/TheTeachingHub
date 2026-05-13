"use client";

import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";
import type { ReactNode } from "react";
import { getSandpackNetworkOptions } from "@/lib/sandpackNetworkOptions";

type Props = {
  files: Record<string, string>;
  template?: "vanilla-ts" | "react-ts";
  children?: ReactNode;
  /** Chiamato prima di forzare refresh/ricompilazione (es. toast “in corso”). */
  onVerifyPressed?: () => void;
};

function ArchLabVerifyBar({ onVerifyPressed }: { onVerifyPressed?: () => void }) {
  const { refresh } = useSandpackNavigation();
  const { code, updateCode } = useActiveCode();

  return (
    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/8 bg-[#0c0c0e] px-3 py-2.5">
      <button
        type="button"
        onClick={() => {
          onVerifyPressed?.();
          updateCode(code, true);
          /* microtask: lascia propagare lo stato Sandpack prima del refresh */
          queueMicrotask(() => {
            refresh();
          });
        }}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:bg-emerald-700"
      >
        Verifica
      </button>
    </div>
  );
}

/**
 * Solo editor CodeMirror (nessun preview/console/tabs Sandpack).
 */
export function ArchitectureLabEditorOnly({
  files,
  template = "vanilla-ts",
  children,
  onVerifyPressed,
}: Props) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <SandpackProvider
        template={template}
        theme="dark"
        files={files}
        options={{
          ...getSandpackNetworkOptions(),
          activeFile: "/miniBus.ts",
          visibleFiles: ["/miniBus.ts"],
          initMode: "immediate",
          autorun: true,
          autoReload: false,
          recompileMode: "immediate",
        }}
      >
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <div className="architecture-lab-editor-only relative flex min-h-0 min-w-0 flex-1 flex-col">
            <SandpackCodeEditor
              showTabs={false}
              showLineNumbers
              showRunButton={false}
              showInlineErrors
              wrapContent
              className="min-h-0 flex-1 [&_.cm-editor]:text-[15px] [&_.cm-scroller]:overflow-auto!"
            />
            {/* Preview: non spostare fuori viewport (alcuni browser limitano iframe); altezza minima in basso */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[3px] overflow-hidden opacity-[0.04]"
              aria-hidden
            >
              <SandpackPreview showOpenInCodeSandbox={false} />
            </div>
            {children}
          </div>
          <ArchLabVerifyBar onVerifyPressed={onVerifyPressed} />
        </div>
      </SandpackProvider>
    </div>
  );
}
