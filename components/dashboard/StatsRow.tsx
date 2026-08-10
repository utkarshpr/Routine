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
        <Card key={stat.label} className="overflow-hidden rounded-[28px] px-5 py-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">{stat.label}</p>
          <NumberTicker
            value={stat.value}
            className="mt-4 block text-[2rem] font-semibold tabular-nums tracking-[-0.05em] md:text-[2.35rem]"
          />
        </Card>
      ))}
    </div>
  );
}
