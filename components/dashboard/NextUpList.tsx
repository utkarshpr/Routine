import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTimeLabel } from "@/lib/dates";
import { copy } from "@/lib/copy";
import type { Task } from "@/types";

export function NextUpList({ tasks }: { tasks: Task[] }) {
  return (
    <section className="px-4 py-4" aria-label="Next tasks">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Queue</p><h2 className="mt-1 text-base font-semibold tracking-tight">Next up</h2></div><Link href="/schedule" aria-label="Open schedule" className="rounded-md p-1 text-muted transition-colors hover:text-foreground"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
      {tasks.length === 0 ? <EmptyState title={copy.allCaughtUp} className="py-5" /> : <ul className="mt-3 divide-y divide-border">{tasks.map((task) => <li key={task.id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${task.color}16`, color: task.color }}><CategoryIcon iconName={task.icon} className="h-3.5 w-3.5" /></div><span className="w-12 shrink-0 text-[11px] tabular-nums text-muted">{formatTimeLabel(task.startTime)}</span><span className="min-w-0 truncate text-sm font-medium">{task.title}</span></li>)}</ul>}
    </section>
  );
}
