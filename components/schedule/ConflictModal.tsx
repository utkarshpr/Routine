"use client";

import { Lock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { describeConflictGroup, sortByStart, type ConflictGroup } from "@/lib/scheduler";
import { formatTimeLabel } from "@/lib/dates";
import type { Task } from "@/types";

export function ConflictModal({
  open,
  onClose,
  conflicts,
  tasks,
  onResolve,
}: {
  open: boolean;
  onClose: () => void;
  conflicts: ConflictGroup[];
  tasks: Task[];
  onResolve: () => void;
}) {
  const byId = new Map(tasks.map((t) => [t.id, t]));

  return (
    <Modal open={open} onClose={onClose} title="Schedule conflicts" className="max-w-md">
      <h2 className="text-lg font-semibold">Why this day has conflicts</h2>
      <p className="mt-1 text-sm text-muted">These tasks overlap in time, so they can&rsquo;t both happen as scheduled.</p>

      <div className="mt-4 max-h-80 space-y-4 overflow-y-auto">
        {conflicts.map((group, i) => {
          const groupTasks = sortByStart(
            group.taskIds.map((id) => byId.get(id)).filter((t): t is Task => Boolean(t))
          );
          const pairs = describeConflictGroup(groupTasks);
          const hasFixed = groupTasks.some((t) => t.type === "FIXED");

          return (
            <div key={group.taskIds.join("-")} className="rounded-xl border border-danger/30 bg-danger/5 p-3">
              <div className="flex flex-wrap gap-1.5">
                {groupTasks.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-xs"
                  >
                    {t.type === "FIXED" && <Lock className="h-3 w-3 text-muted" aria-hidden="true" />}
                    {t.title} · {formatTimeLabel(t.startTime)}–{formatTimeLabel(t.endTime)}
                  </span>
                ))}
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                {pairs.map(({ a, b, overlapMinutes }) => (
                  <li key={`${a.id}-${b.id}`}>
                    <span className="font-medium text-foreground">{a.title}</span> ends at {formatTimeLabel(a.endTime)}, but{" "}
                    <span className="font-medium text-foreground">{b.title}</span> starts at {formatTimeLabel(b.startTime)} —
                    they overlap by {overlapMinutes} min.
                  </li>
                ))}
              </ul>
              {hasFixed && (
                <p className="mt-2 flex items-center gap-1 text-[11px] text-muted">
                  <Lock className="h-3 w-3" aria-hidden="true" /> Fixed-time tasks won&rsquo;t be moved automatically.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl bg-surface-2 p-3 text-xs text-muted">
        Auto-resolve pushes flexible tasks later, one after another, until nothing overlaps. Fixed-time tasks stay put, so a
        conflict involving two fixed tasks needs a manual move.
      </p>

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={() => {
            onResolve();
            onClose();
          }}
        >
          Auto-resolve conflicts
        </Button>
      </div>
    </Modal>
  );
}
