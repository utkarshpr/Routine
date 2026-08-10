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
        <Card key={stat.label} className="overflow-hidden px-4 py-3">
          <p className="text-xs text-muted">{stat.label}</p>
          <NumberTicker value={stat.value} className="mt-0.5 block text-xl font-semibold tabular-nums tracking-tight" />
        </Card>
      ))}
    </div>
  );
}
