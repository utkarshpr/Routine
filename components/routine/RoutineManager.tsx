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
import { Plus } from "lucide-react";
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

export function RoutineManager() {
  const routines = useRoutineStore((s) => s.routines);
  const reorder = useRoutineStore((s) => s.reorder);
  const duplicate = useRoutineStore((s) => s.duplicate);
  const togglePause = useRoutineStore((s) => s.togglePause);
  const remove = useRoutineStore((s) => s.remove);
  const removeFutureByRoutineId = useTaskStore((s) => s.removeFutureByRoutineId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Routine | null>(null);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Routines</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          type="button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New routine
        </Button>
      </div>

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
