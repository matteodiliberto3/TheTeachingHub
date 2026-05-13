"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "json", label: "Schema JSON" },
  { id: "server", label: "Server" },
  { id: "client", label: "Client" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type Props = {
  json: string;
  server: string;
  client: string;
};

export function CodeTabs({ json, server, client }: Props) {
  const [tab, setTab] = useState<TabId>("json");

  const body =
    tab === "json" ? json : tab === "server" ? server : client;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap gap-1 border-b border-zinc-200 p-1 dark:border-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:bg-white/60 dark:text-zinc-400 dark:hover:bg-zinc-900/60",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre className="max-h-[min(420px,55vh)] overflow-auto p-4 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
        <code>{body}</code>
      </pre>
    </div>
  );
}
