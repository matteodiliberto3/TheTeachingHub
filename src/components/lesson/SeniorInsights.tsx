import { cn } from "@/lib/cn";
import type { SeniorInsight } from "@/lib/lessons/eda/types";

type Props = {
  items: SeniorInsight[];
  className?: string;
};

/** Cicche del senior su drawbacks, trade-off e mitigazioni operative. */
export function SeniorInsights({ items, className }: Props) {
  if (!items.length) return null;

  return (
    <aside
      className={cn(
        "rounded-xl border border-indigo-200/80 bg-indigo-50/90 p-4 text-sm text-indigo-950 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/35 dark:text-indigo-50",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800 dark:text-indigo-200">
        Cicche del senior
      </p>
      <ul className="mt-3 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border-l-2 border-indigo-300 pl-3 dark:border-indigo-600">
            <p className="font-medium text-indigo-950 dark:text-indigo-100">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-indigo-900/90 dark:text-indigo-100/85">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
