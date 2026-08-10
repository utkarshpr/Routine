"use client";

import { Card } from "@/components/ui/Card";
import { NumberTicker } from "@/components/ui/effects/NumberTicker";
import { cn } from "@/lib/cn";

interface Stat {
  label: string;
  value: string;
}

export function StatsRow({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{stat.label}</p>
          <NumberTicker value={stat.value} className="mt-2 block text-[1.65rem] font-semibold tabular-nums tracking-[-0.04em]" />
        </Card>
      ))}
    </div>
  );
}
