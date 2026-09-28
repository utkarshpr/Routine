"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Badge } from "@/components/ui/Badge";
import { DAY_LABELS } from "@/lib/constants";
import { formatTimeLabel } from "@/lib/dates";
import type { Routine } from "@/types";

export function RoutineListItem({
  routine,
  onEdit,
  onDuplicate,
  onTogglePause,
  onDelete,
}: {
  routine: Routine;
  onEdit: () => void;
  onDuplicate: () => void;
  onTogglePause: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: routine.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="group flex items-center gap-2 rounded-xl border border-border bg-surface/80 p-2.5 transition-colors hover:border-border-strong sm:p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="flex h-9 w-7 shrink-0 cursor-grab items-center justify-center rounded-lg text-muted/70 hover:bg-surface-2 hover:text-foreground active:cursor-grabbing sm:w-8"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${routine.color}1f`, color: routine.color }}
      >
        <CategoryIcon iconName={routine.icon} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13px] font-medium ${routine.paused ? "text-muted" : ""}`}>{routine.title}</p>
        <p className="truncate text-xs text-muted">
          {formatTimeLabel(routine.startTime)}–{formatTimeLabel(routine.endTime)} ·{" "}
          {routine.recurring ? routine.daysOfWeek.map((d) => DAY_LABELS[d]).join(" ") : "One-time"}
        </p>
      </div>

      {routine.paused && <Badge>Paused</Badge>}

      <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={routine.paused ? "Resume routine" : "Pause routine"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
        >
          {routine.paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate routine"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit routine"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete routine"
          className="flex h-8 w-8 items-center justify-center rounded-full text-danger hover:bg-danger/10"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
