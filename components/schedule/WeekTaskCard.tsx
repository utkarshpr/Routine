"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, GripVertical, MoreHorizontal, SkipForward, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { cn } from "@/lib/cn";
import { addDays, addMinutesToTime, dateKey, formatTimeLabel } from "@/lib/dates";
import { cardVariants } from "@/lib/motion";
import { useTaskStore } from "@/stores/taskStore";
import { toast } from "@/stores/toastStore";
import { quickMoveOffsets } from "@/lib/scheduler";
import type { Task } from "@/types";

type Placement = "current" | "overdue" | "upcoming";

export function WeekTaskCard({
  task,
  placement = "upcoming",
  hasConflict = false,
}: {
  task: Task;
  placement?: Placement;
  hasConflict?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const [menuOpen, setMenuOpen] = useState(false);

  const completeTask = useTaskStore((s) => s.completeTask);
  const skipTask = useTaskStore((s) => s.skipTask);
  const removeTask = useTaskStore((s) => s.removeTask);
  const moveTask = useTaskStore((s) => s.moveTask);
  const moveTaskToDate = useTaskStore((s) => s.moveTaskToDate);

  const isDone = task.status === "completed";
  const isSkipped = task.status === "skipped";
  const isOverdue = placement === "overdue" && !isDone && !isSkipped;
  const isCurrent = placement === "current" && !isDone && !isSkipped;
  const showCategoryTint = !isCurrent && !isOverdue;

  const dragStyle = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 30 } : undefined;
  const style = {
    ...dragStyle,
    ...(showCategoryTint ? { backgroundColor: `${task.color}0d` } : undefined),
    ...(task.type === "FIXED" ? { borderLeftColor: task.color } : undefined),
  };

  async function moveBy(minutes: number) {
    await moveTask(task.id, addMinutesToTime(task.startTime, minutes));
    setMenuOpen(false);
    toast("Task rescheduled", "success");
  }

  async function moveToTomorrow() {
    await moveTaskToDate(task.id, dateKey(addDays(new Date(`${task.date}T00:00:00`), 1)));
    setMenuOpen(false);
    toast("Moved to tomorrow", "success");
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={isDragging ? undefined : { y: -1 }}
      className={cn(
        "group relative rounded-xl border p-2.5 text-xs transition-shadow hover:shadow-[var(--shadow-card)]",
        isCurrent && "border-accent/50 bg-accent/[0.06] shadow-[var(--shadow-card)]",
        isOverdue && "border-danger/40 bg-danger/[0.06]",
        !isCurrent && !isOverdue && "border-border",
        isDragging && "opacity-40",
        task.type === "FIXED" && "border-l-2",
        hasConflict && "ring-1 ring-danger/40"
      )}
    >
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-0.5 flex h-5 w-3.5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted/70 hover:text-muted"
          aria-label="Drag to reschedule"
        >
          <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ color: task.color }} aria-hidden="true">
          <CategoryIcon iconName={task.icon} className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate font-medium", (isDone || isSkipped) && "text-muted line-through")}>{task.title}</p>
          <p className="text-muted">{formatTimeLabel(task.startTime)}</p>
        </div>
        <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label="Task options"
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted opacity-0 hover:bg-surface-2 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <AnimatePresence>
            {menuOpen && (
              <DropdownMenu.Portal forceMount>
                <DropdownMenu.Content asChild align="end" sideOffset={4} forceMount>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="z-40 w-40 rounded-xl border border-border bg-surface p-1 text-xs shadow-xl"
                  >
                    {!isDone && (
                      <DropdownMenu.Item
                        onSelect={() => completeTask(task.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none data-[highlighted]:bg-surface-2"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" /> Complete
                      </DropdownMenu.Item>
                    )}
                    {quickMoveOffsets().map((m) => (
                      <DropdownMenu.Item
                        key={m}
                        onSelect={() => moveBy(m)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none data-[highlighted]:bg-surface-2"
                      >
                        Move +{m}m
                      </DropdownMenu.Item>
                    ))}
                    <DropdownMenu.Item
                      onSelect={moveToTomorrow}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none data-[highlighted]:bg-surface-2"
                    >
                      Move to tomorrow
                    </DropdownMenu.Item>
                    {!isSkipped && (
                      <DropdownMenu.Item
                        onSelect={() => skipTask(task.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none data-[highlighted]:bg-surface-2"
                      >
                        <SkipForward className="h-3.5 w-3.5" aria-hidden="true" /> Skip
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item
                      onSelect={() => removeTask(task.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-danger outline-none data-[highlighted]:bg-danger/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                    </DropdownMenu.Item>
                  </motion.div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            )}
          </AnimatePresence>
        </DropdownMenu.Root>
      </div>
    </motion.div>
  );
}
