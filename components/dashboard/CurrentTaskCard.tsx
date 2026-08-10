"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Play } from "lucide-react";
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

export function CurrentTaskCard({ current, next }: { current: Task | null; next: Task | null }) {
  const router = useRouter();
  const now = useNow(30_000);
  const completeTask = useTaskStore((s) => s.completeTask);

  if (!current) {
    return (
      <Card className="p-7 md:p-8" spotlight>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">{next ? copy.nextUp : copy.dayComplete}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          {next ? next.title : copy.allCaughtUp}
        </h2>
        {next && (
          <p className="mt-2 text-sm text-muted">Starting at {formatTimeLabel(next.startTime)}</p>
        )}
      </Card>
    );
  }

  const remaining = minutesRemaining(current, now);
  const total = durationMinutes(current.startTime, current.endTime);
  const elapsedPct = total === 0 ? 0 : Math.min(100, ((total - remaining) / total) * 100);

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" layout>
      <Card className="p-7 md:p-8" spotlight>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(145deg, ${current.color}22, transparent 58%)` }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/35 shadow-[var(--shadow-card)] dark:border-white/12"
              style={{ backgroundColor: `${current.color}22`, color: current.color }}
            >
              <CategoryIcon iconName={current.icon} className="h-5 w-5" />
            </div>
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: current.color }}>
              {current.category}
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-[3.4rem] md:leading-[0.96]">
              {current.title}
            </h2>
            <p className="mt-3 text-sm text-muted md:text-[15px]">
              {remaining} min remaining. Started {formatTimeLabel(current.startTime)} and running until {formatTimeLabel(current.endTime)}.
            </p>
          </div>
          <div className="flex items-center gap-4 self-start rounded-[24px] border border-white/40 bg-white/55 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
            <ProgressRing value={elapsedPct} size={64} strokeWidth={4} label=" " />
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">In progress</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em]">{Math.round(elapsedPct)}%</p>
            </div>
          </div>
        </div>
        <div className="relative mt-7 flex flex-wrap gap-3">
          <Button onClick={() => router.push(`/focus?taskId=${current.id}`)} type="button">
            <Play className="h-4 w-4" aria-hidden="true" />
            Start Session
          </Button>
          <Button variant="secondary" onClick={() => completeTask(current.id)} type="button">
            <Check className="h-4 w-4" aria-hidden="true" />
            Mark done
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
