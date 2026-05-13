"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lessons } from "@/lib/lessons/registry";
import { cn } from "@/lib/cn";

export function HubMobileNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-zinc-200 bg-white/90 p-3 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="flex gap-2 overflow-x-auto pb-1">
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
        {lessons.map((l) => {
          const href = `/learn/${l.slug}`;
          const active = pathname === href;
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
    </div>
  );
}
