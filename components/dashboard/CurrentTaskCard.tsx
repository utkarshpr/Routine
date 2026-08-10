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
      <Card className="p-6">
        <p className="text-sm text-muted">{next ? copy.nextUp : copy.dayComplete}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {next ? next.title : copy.allCaughtUp}
        </h2>
        {next && (
          <p className="mt-1 text-sm text-muted">Starting at {formatTimeLabel(next.startTime)}</p>
        )}
      </Card>
    );
  }

  const remaining = minutesRemaining(current, now);
  const total = durationMinutes(current.startTime, current.endTime);
  const elapsedPct = total === 0 ? 0 : Math.min(100, ((total - remaining) / total) * 100);

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" layout>
      <Card className="p-6" spotlight>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${current.color}1a, transparent 65%)` }}
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-[var(--shadow-card)]"
              style={{ backgroundColor: `${current.color}22`, color: current.color }}
            >
              <CategoryIcon iconName={current.icon} className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium" style={{ color: current.color }}>
              {current.category}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">{current.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {remaining} min remaining · started {formatTimeLabel(current.startTime)}
            </p>
          </div>
          <ProgressRing value={elapsedPct} size={52} strokeWidth={4} label=" " />
        </div>
        <div className="relative mt-5 flex gap-2">
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
