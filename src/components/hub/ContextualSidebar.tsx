"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { EdaNavSection } from "@/lib/lessons/eda/nav";

type Props = {
  /** Titolo contesto (es. modulo EDA) */
  contextTitle: string;
  contextSubtitle?: string;
  homeHref: string;
  homeLabel?: string;
  sections: EdaNavSection[];
};

export function ContextualSidebar({
  contextTitle,
  contextSubtitle,
  homeHref,
  homeLabel = "Torna al hub",
  sections,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white/90 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 lg:block">
      <div className="mb-5 space-y-1 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Modulo</p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{contextTitle}</p>
        {contextSubtitle ? (
          <p className="text-xs leading-snug text-zinc-500 dark:text-zinc-400">{contextSubtitle}</p>
        ) : null}
        <Link
          href={homeHref}
          className="mt-2 inline-flex rounded-lg px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
        >
          {homeLabel}
        </Link>
      </div>

      <nav className="space-y-6" aria-label="Navigazione contestuale">
        {sections.map((section) => (
          <div key={section.id}>
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <span className="mr-1.5 tabular-nums text-indigo-600 dark:text-indigo-400">
                {section.index}
              </span>
              {section.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {section.links.map((link) => {
                const active =
                  link.href === "/learn/eda"
                    ? pathname === "/learn/eda"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-2 py-2 text-sm transition-colors",
                        active
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
                      )}
                    >
                      <span className="block font-medium leading-snug">{link.label}</span>
                      {link.description ? (
                        <span className="mt-0.5 block text-[11px] opacity-80">{link.description}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
