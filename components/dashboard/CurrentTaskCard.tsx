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
      <Card className="p-7 md:p-8">
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
      <Card className="overflow-hidden p-7 md:p-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-border bg-[rgba(255,255,255,0.02)]"
                style={{ color: current.color }}
              >
                <CategoryIcon iconName={current.icon} className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted lg:hidden">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: current.color }}
                  aria-hidden="true"
                />
                In progress
              </div>
            </div>
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
              {current.category}
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.06em] md:text-[4.25rem] md:leading-[0.92]">
              {current.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              {remaining} min remaining. Started {formatTimeLabel(current.startTime)} and running until {formatTimeLabel(current.endTime)}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => router.push(`/focus?taskId=${current.id}`)} type="button">
                <Play className="h-4 w-4" aria-hidden="true" />
                Start Session
              </Button>
              <Button variant="secondary" onClick={() => completeTask(current.id)} type="button">
                <Check className="h-4 w-4" aria-hidden="true" />
                Mark done
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-elevated/80 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">In progress</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{Math.round(elapsedPct)}%</p>
                <p className="mt-1 text-sm text-muted">
                  {formatTimeLabel(current.startTime)} to {formatTimeLabel(current.endTime)}
                </p>
              </div>
              <ProgressRing value={elapsedPct} size={72} strokeWidth={5} label=" " />
            </div>
            <div className="mt-5 rounded-[20px] border border-border bg-surface px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Remaining</span>
                <span className="font-medium text-foreground">{remaining} min</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Status</span>
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: current.color }}
                    aria-hidden="true"
                  />
                  Active now
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
