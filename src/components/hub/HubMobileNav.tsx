"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lessons } from "@/lib/lessons/registry";
import { flattenEdaNavLinks } from "@/lib/lessons/eda/nav";
import { cn } from "@/lib/cn";

export function HubMobileNav() {
  const pathname = usePathname();
  const inEda = pathname === "/learn/eda" || pathname.startsWith("/learn/eda/");
  const edaLinks = flattenEdaNavLinks();

  return (
    <div className="border-b border-zinc-200 bg-white/90 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="flex gap-2 overflow-x-auto p-3 pb-1">
        <Link
          href="/"
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
            pathname === "/"
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
          )}
        >
          Hub
        </Link>
        <Link
          href="/learn"
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
            pathname === "/learn"
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
          )}
        >
          Percorso
        </Link>
        {lessons.map((l) => {
          const href = l.slug === "eda" ? "/learn/eda" : `/learn/${l.slug}`;
          const active =
            l.slug === "eda"
              ? inEda
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={l.slug}
              href={href}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
              )}
            >
              {l.shortTitle}
            </Link>
          );
        })}
      </div>

      {inEda ? (
        <div className="flex gap-1.5 overflow-x-auto border-t border-zinc-100 px-3 py-2 dark:border-zinc-800/80">
          <p className="shrink-0 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            EDA
          </p>
          {edaLinks.map((link) => {
            const active =
              link.href === "/learn/eda"
                ? pathname === "/learn/eda"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium",
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-400 dark:bg-indigo-500"
                    : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
