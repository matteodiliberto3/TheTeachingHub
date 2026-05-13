"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

type Props = {
  files: Record<string, string>;
  template?: "vanilla-ts" | "react-ts";
};

/**
 * Nessuna altezza fissa sul wrapper: evita la “fascia grigia” (sfondo vuoto sotto Sandpack).
 * Nessun overflow-hidden orizzontale: evita il codice tagliato a sinistra nell’editor.
 */
export function SandpackLab({ files, template = "vanilla-ts" }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center bg-zinc-900/50 text-sm text-zinc-400">
        Caricamento playground…
      </div>
    );
  }

  return (
    <div className="sandpack-hub w-full min-w-0 bg-[#09090b] py-1">
      <div className="sandpack-hub-inner w-full min-w-0 max-w-none">
        <Sandpack
          template={template}
          theme="dark"
          files={files}
          options={{
            recompileMode: "delayed",
            recompileDelay: 400,
            resizablePanels: false,
            editorWidthPercentage: 50,
            editorHeight: 420,
            showConsole: true,
            showConsoleButton: true,
            showNavigator: false,
            showLineNumbers: true,
            wrapContent: true,
          }}
        />
      </div>
    </div>
  );
}
