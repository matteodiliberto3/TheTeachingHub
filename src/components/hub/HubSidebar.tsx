"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lessons } from "@/lib/lessons/registry";
import { cn } from "@/lib/cn";

export function HubSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 lg:block">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Percorso
        </p>
        <Link
          href="/"
          className="block rounded-lg px-2 py-1 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Panoramica hub
        </Link>
      </div>
      <nav className="space-y-1">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Moduli
        </p>
        {lessons.map((l) => {
          const href = `/learn/${l.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={l.slug}
              href={href}
              className={cn(
                "block rounded-lg px-2 py-2 text-sm transition-colors",
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
              )}
            >
              <span className="block font-medium">{l.shortTitle}</span>
              <span className="block text-xs opacity-80">{l.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
