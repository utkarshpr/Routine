"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw, SkipForward } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Badge } from "@/components/ui/Badge";
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
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-colors",
        placement === "current" && "border-accent/50 bg-accent/[0.06] shadow-[var(--shadow-card)]",
        placement === "overdue" && "border-danger/40 bg-danger/[0.06]",
        placement !== "current" && placement !== "overdue" && "border-border bg-surface hover:border-border-strong"
      )}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${task.color}1f`, color: task.color }}
      >
        <CategoryIcon iconName={task.icon} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", (isDone || isSkipped) && "text-muted line-through")}>
          {task.title}
        </p>
        <p className="text-xs text-muted">
          {formatTimeLabel(task.startTime)} · {formatDurationLabel(durationMinutes(task.startTime, task.endTime))}
        </p>
      </div>

      {placement === "overdue" && !isDone && !isSkipped && <Badge className="text-danger">Overdue</Badge>}

      <div className="flex shrink-0 items-center gap-1">
        {isDone ? (
          <button
            type="button"
            onClick={() => uncompleteTask(task.id)}
            aria-label="Undo completion"
            className="flex h-8 w-8 items-center justify-center rounded-full text-success hover:bg-success/10"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          !isSkipped && (
            <>
              <button
                type="button"
                onClick={() => skipTask(task.id)}
                aria-label="Skip task"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => completeTask(task.id)}
                aria-label="Complete task"
                className="flex h-8 w-8 items-center justify-center rounded-full text-success hover:bg-success/10"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )
        )}
      </div>
    </motion.li>
  );
}
