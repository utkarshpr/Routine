"use client";

import { NumberTicker } from "@/components/ui/effects/NumberTicker";
import { cn } from "@/lib/cn";

interface Stat { label: string; value: string }

export function StatsRow({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 overflow-hidden", className)}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={cn("min-w-0 px-3.5 py-3.5", index % 2 === 1 && "border-l border-border", index > 1 && "border-t border-border")}>
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{stat.label}</p>
          <NumberTicker value={stat.value} className="mt-1.5 block text-xl font-semibold tracking-[-0.045em] tabular-nums" />
        </div>
      ))}
    </div>
  );
}
