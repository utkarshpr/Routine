"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TaskRow } from "@/components/timeline/TaskRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { sortByStart, type DayStatus } from "@/lib/scheduler";
import { copy } from "@/lib/copy";
import type { Task } from "@/types";

export function Timeline({ tasks, dayStatus }: { tasks: Task[]; dayStatus: DayStatus }) {
  const sorted = sortByStart(tasks);

  if (sorted.length === 0) {
    return <EmptyState title={copy.emptyTimeline} className="py-10" />;
  }

  return (
    <motion.ul layout className="divide-y divide-border/80">
      <AnimatePresence initial={false}>
        {sorted.map((task) => {
          let placement: "current" | "overdue" | "completed" | "skipped" | "upcoming" = "upcoming";
          if (task.status === "completed") placement = "completed";
          else if (task.status === "skipped") placement = "skipped";
          else if (dayStatus.current?.id === task.id) placement = "current";
          else if (dayStatus.overdueIds.includes(task.id)) placement = "overdue";

          return <TaskRow key={task.id} task={task} placement={placement} />;
        })}
      </AnimatePresence>
    </motion.ul>
  );
}
