"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Play, Timer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { cardVariants } from "@/lib/motion";
import { durationMinutes, formatTimeLabel, timeToMinutes } from "@/lib/dates";
import { useNow } from "@/hooks/useNow";
import { useTaskStore } from "@/stores/taskStore";
import { copy } from "@/lib/copy";
import type { Task } from "@/types";

function minutesRemaining(task: Task, now: Date): number {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let end = timeToMinutes(task.endTime);
  if (end <= timeToMinutes(task.startTime)) end += 1440;
  return Math.max(0, end - nowMin);
}

export function CurrentTaskCard({ current, next, overdueCount = 0, dayProgressPct = 0, onMoveOverdue }: { current: Task | null; next: Task | null; overdueCount?: number; dayProgressPct?: number; onMoveOverdue?: () => void }) {
  const router = useRouter();
  const now = useNow(30_000);
  const completeTask = useTaskStore((s) => s.completeTask);

  if (!current) {
    return (
      <Card className="bg-surface p-4 md:p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted"><Timer className="h-3.5 w-3.5" aria-hidden="true" />{overdueCount > 0 ? "Recover your day" : next ? copy.nextUp : copy.dayComplete}</div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">{overdueCount > 0 ? `${overdueCount} block${overdueCount === 1 ? "" : "s"} need attention` : next ? next.title : copy.allCaughtUp}</h2>
        {next && overdueCount === 0 && <p className="mt-1 text-sm text-muted">Starts at {formatTimeLabel(next.startTime)}</p>}
        {overdueCount > 0 && <p className="mt-1 text-sm text-muted">Choose what still matters and move forward without losing the rest of the day.</p>}
        {overdueCount > 0 && onMoveOverdue && <Button variant="secondary" size="sm" className="mt-4" onClick={onMoveOverdue} type="button">Move overdue to tomorrow</Button>}
      </Card>
    );
  }

  const remaining = minutesRemaining(current, now);
  const total = durationMinutes(current.startTime, current.endTime);
  const elapsedPct = total === 0 ? 0 : Math.min(100, ((total - remaining) / total) * 100);

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" layout>
      <Card spotlight className="bg-surface p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2" style={{ color: current.color }}><CategoryIcon iconName={current.icon} className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">In progress</span><span className="h-1 w-1 rounded-full bg-success" aria-hidden="true" /><span className="text-xs text-muted">{remaining} min left</span></div>
            <h2 className="mt-2 truncate text-2xl font-semibold tracking-[-0.045em] md:text-3xl">{current.title}</h2>
            <p className="mt-1 text-xs text-muted">{current.category} · {formatTimeLabel(current.startTime)}–{formatTimeLabel(current.endTime)}</p>
          </div>
          <ProgressRing value={elapsedPct} size={44} strokeWidth={4} label={`${Math.round(elapsedPct)}%`} />
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"><span>Day progress</span><span className="tabular-nums text-foreground">{dayProgressPct}%</span></div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-2"><motion.div className="h-full rounded-full bg-[var(--success)]" initial={{ width: 0 }} animate={{ width: `${dayProgressPct}%` }} transition={{ type: "spring", stiffness: 180, damping: 24 }} /></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => router.push(`/focus?taskId=${current.id}`)} type="button" size="sm"><Play className="h-3.5 w-3.5" aria-hidden="true" />Start session</Button>
          <Button variant="secondary" onClick={() => completeTask(current.id)} type="button" size="sm"><Check className="h-3.5 w-3.5" aria-hidden="true" />Mark done</Button>
          {overdueCount > 0 && onMoveOverdue && <Button variant="ghost" onClick={onMoveOverdue} type="button" size="sm">Move {overdueCount} overdue</Button>}
        </div>
      </Card>
    </motion.div>
  );
}
