"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Clock3, PauseCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RoutineListItem } from "@/components/routine/RoutineListItem";
import { RoutineFormModal } from "@/components/routine/RoutineFormModal";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore } from "@/stores/taskStore";
import { toast } from "@/stores/toastStore";
import { todayKey } from "@/lib/dates";
import type { Routine } from "@/types";
import { buildAdaptedRoutineBlueprint, buildRoutinesFromBlueprint, type OnboardingGoal } from "@/lib/seed";

export function RoutineManager() {
  const routines = useRoutineStore((s) => s.routines);
  const clearAll = useRoutineStore((s) => s.clearAll);
  const reorder = useRoutineStore((s) => s.reorder);
  const duplicate = useRoutineStore((s) => s.duplicate);
  const togglePause = useRoutineStore((s) => s.togglePause);
  const remove = useRoutineStore((s) => s.remove);
  const removeFutureByRoutineId = useTaskStore((s) => s.removeFutureByRoutineId);
  const seed = useRoutineStore((s) => s.seed);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Routine | null>(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const sorted = [...routines].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = sorted.map((r) => r.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const next = [...ids];
    next.splice(oldIndex, 1);
    next.splice(newIndex, 0, String(active.id));
    reorder(next);
  }

  const activeCount = sorted.filter((routine) => !routine.paused).length;

  async function switchPreset(kind: "balanced" | "focus" | "recovery") {
    const goals: OnboardingGoal[] = kind === "focus" ? ["Work", "Learning", "Projects"] : kind === "recovery" ? ["Personal", "Recovery", "Fitness"] : ["Work", "Fitness", "Personal"];
    await clearAll();
    await seed(buildRoutinesFromBlueprint(buildAdaptedRoutineBlueprint({ wakeTime: "06:00", workStart: "10:00", workEnd: "18:00", sleepTime: "23:00", goals })));
    toast(`${kind === "focus" ? "Deep focus" : kind === "recovery" ? "Gentle pace" : "Balanced"} preset active`, "success");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="cred-label text-muted">Repeatable structure</p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.045em]">Routines</h2>
            <span className="text-xs text-muted">{activeCount} active · {sorted.length - activeCount} paused</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sorted.length > 0 && (
            <Button variant="danger" size="sm" onClick={() => setClearAllOpen(true)} type="button">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
            type="button"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New routine
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Switch preset</span>
        {([["balanced", "Balanced"], ["focus", "Deep focus"], ["recovery", "Gentle pace"]] as const).map(([kind, label]) => <Button key={kind} variant="secondary" size="sm" onClick={() => switchPreset(kind)} type="button">{label}</Button>)}
      </div>

      {sorted.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
          <div className="flex items-center gap-2 border-y border-border py-2 text-xs">
            <Clock3 className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            <span><strong>{sorted.length}</strong> <span className="text-muted">blocks</span></span>
          </div>
          <div className="flex items-center gap-2 border-y border-border py-2 text-xs">
            <PauseCircle className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            <span><strong>{activeCount}</strong> <span className="text-muted">in rhythm</span></span>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState title="No routines yet" description="Add your first block of the day." />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {sorted.map((routine) => (
                <RoutineListItem
                  key={routine.id}
                  routine={routine}
                  onEdit={() => {
                    setEditing(routine);
                    setFormOpen(true);
                  }}
                  onDuplicate={async () => {
                    await duplicate(routine.id);
                    toast("Routine duplicated", "success");
                  }}
                  onTogglePause={() => togglePause(routine.id)}
                  onDelete={() => setDeleteTarget(routine)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <RoutineFormModal open={formOpen} onClose={() => setFormOpen(false)} routine={editing} />
      <ConfirmDialog
        open={clearAllOpen}
        onClose={() => setClearAllOpen(false)}
        onConfirm={async () => {
          await clearAll();
          toast("All routines cleared");
        }}
        title="Clear all routines?"
        description="This removes every routine and all pending routine-based tasks from today onward, so you can start fresh."
        confirmLabel="Clear all"
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            remove(deleteTarget.id);
            removeFutureByRoutineId(deleteTarget.id, todayKey());
            toast("Routine deleted");
          }
        }}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This won't remove past completed days, only future scheduling."
      />
    </div>
  );
}
