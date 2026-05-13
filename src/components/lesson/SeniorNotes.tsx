import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  className?: string;
};

export function SeniorNotes({ items, className }: Props) {
  if (!items.length) return null;

  return (
    <aside
      className={cn(
        "rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 text-sm text-amber-950 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-50",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
        Note da senior
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-4">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
