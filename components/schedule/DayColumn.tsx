"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus } from "lucide-react";
import { WeekTaskCard } from "@/components/schedule/WeekTaskCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { dateKey, todayKey } from "@/lib/dates";
import { useNow } from "@/hooks/useNow";
import { sortByStart, findConflicts, computeDayStatus } from "@/lib/scheduler";
import { useTaskStore } from "@/stores/taskStore";
import { useUIStore } from "@/stores/uiStore";
import { toast } from "@/stores/toastStore";
import type { Task } from "@/types";

export function DayColumn({ date, label, tasks }: { date: Date; label: string; tasks: Task[] }) {
  const key = dateKey(date);
  const { setNodeRef, isOver } = useDroppable({ id: key });
  const autoResolveDay = useTaskStore((s) => s.autoResolveDay);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const now = useNow(30_000);
  const sorted = sortByStart(tasks);
  const conflicts = findConflicts(tasks);
  const conflictedIds = useMemo(() => new Set(conflicts.flatMap((g) => g.taskIds)), [conflicts]);
  const isToday = key === todayKey();
  const isPast = key < todayKey();
  // `computeDayStatus` only compares time-of-day against `now`, so its current/overdue
  // placement is only meaningful for today's column — a past day is either done or
  // entirely stale, and a future day can't have a "current" or "overdue" task yet.
  const todayStatus = useMemo(() => (isToday ? computeDayStatus(tasks, now) : null), [isToday, tasks, now]);
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.filter((t) => t.completionRequired).length || tasks.length;

  function placementFor(task: Task): "current" | "overdue" | "upcoming" {
    if (task.status !== "pending") return "upcoming";
    if (isToday) {
      if (todayStatus?.current?.id === task.id) return "current";
      if (todayStatus?.overdueIds.includes(task.id)) return "overdue";
      return "upcoming";
    }
    return isPast ? "overdue" : "upcoming";
  }

  async function handleResolve() {
    await autoResolveDay(key);
    toast("Conflicts resolved", "success");
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group/col flex min-h-[200px] flex-col gap-2 rounded-2xl border p-2.5 transition-colors",
        isToday ? "border-accent/30 bg-accent/5" : "border-border bg-surface",
        isOver && "ring-2 ring-accent/50"
      )}
    >
      <div className="flex items-start justify-between gap-1 px-1">
        <div>
          <div className="flex items-center gap-1.5">
            <p className={cn("text-xs font-semibold", isToday && "text-accent")}>{label}</p>
            {isToday && <Badge className="px-1.5 py-0 text-[9px]">Today</Badge>}
          </div>
          <p className="text-[11px] text-muted">
            {date.getDate()}
            {totalCount > 0 && ` · ${completedCount}/${totalCount}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCommandPalette("add", key)}
          aria-label={`Add task on ${label}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted opacity-0 hover:bg-surface-2 hover:text-foreground group-hover/col:opacity-100"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {conflicts.length > 0 && (
        <div className="flex items-center justify-between gap-1 rounded-lg bg-danger/10 px-2 py-1.5 text-[11px] text-danger">
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Conflict
          </span>
          <Button size="sm" variant="danger" className="h-6 px-2 text-[10px]" onClick={handleResolve} type="button">
            Resolve
          </Button>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1.5">
        {sorted.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-1 py-4 text-center">
            <p className="text-[11px] text-muted">Nothing scheduled</p>
            <button
              type="button"
              onClick={() => openCommandPalette("add", key)}
              className="text-[11px] font-medium text-accent hover:underline"
            >
              + Add task
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {sorted.map((task) => (
              <WeekTaskCard
                key={task.id}
                task={task}
                hasConflict={conflictedIds.has(task.id)}
                placement={placementFor(task)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
