"use client";

import { motion } from "framer-motion";
import { Check, Circle, RotateCcw, SkipForward } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { cn } from "@/lib/cn";
import { formatDurationLabel, formatTimeLabel, durationMinutes } from "@/lib/dates";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types";

type Placement = "current" | "overdue" | "completed" | "skipped" | "upcoming";

export function TaskRow({ task, placement }: { task: Task; placement: Placement }) {
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const skipTask = useTaskStore((s) => s.skipTask);
  const isDone = task.status === "completed";
  const isSkipped = task.status === "skipped";
  return (
    <motion.li layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} whileHover={{ x: 1 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className={cn("group relative grid min-h-[68px] grid-cols-[3.5rem_1.75rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-2 py-2.5 transition-colors last:border-b-0 sm:grid-cols-[4.25rem_2rem_minmax(0,1fr)_auto] sm:gap-3 sm:px-3", placement === "current" && "bg-accent/[0.045]", placement !== "current" && "hover:bg-surface-2/60") }>
      {placement === "current" && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-success" aria-hidden="true" />}
      <span className={cn("text-[11px] tabular-nums tracking-[-0.01em]", placement === "current" ? "font-semibold text-foreground" : "text-muted")}>{formatTimeLabel(task.startTime)}</span>
      <span className={cn("relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", isDone ? "border-success/30 bg-success/10 text-success" : "border-border bg-surface-2")} style={!isDone ? { color: task.color } : undefined}>{isDone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <CategoryIcon iconName={task.icon} className="h-3.5 w-3.5" />}</span>
      <div className="min-w-0"><div className="flex min-w-0 items-center gap-2"><p className={cn("truncate text-sm font-medium tracking-[-0.02em]", (isDone || isSkipped) && "text-muted line-through")}>{task.title}</p>{placement === "current" && <span className="hidden shrink-0 items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-success sm:flex"><Circle className="h-2 w-2 fill-current" aria-hidden="true" />Now</span>}{placement === "overdue" && !isDone && !isSkipped && <><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger sm:hidden" aria-label="Overdue" /><span className="hidden shrink-0 text-[9px] font-semibold uppercase tracking-[0.14em] text-danger sm:inline">Overdue</span></>}</div><p className="mt-0.5 truncate text-[11px] text-muted">{formatDurationLabel(durationMinutes(task.startTime, task.endTime))} · {task.category}</p></div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">{isDone ? <button type="button" onClick={() => uncompleteTask(task.id)} aria-label={`Undo completion of ${task.title}`} className="flex h-7 w-7 items-center justify-center rounded-full text-success hover:bg-success/10"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /></button> : !isSkipped && <><button type="button" onClick={() => skipTask(task.id)} aria-label={`Skip ${task.title}`} className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-2"><SkipForward className="h-3.5 w-3.5" aria-hidden="true" /></button><button type="button" onClick={() => completeTask(task.id)} aria-label={`Complete ${task.title}`} className="flex h-7 w-7 items-center justify-center rounded-full text-success hover:bg-success/10"><Check className="h-3.5 w-3.5" aria-hidden="true" /></button></>}</div>
    </motion.li>
  );
}
