"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { useHabitStore } from "@/stores/habitStore";
import { toast } from "@/stores/toastStore";
import { copy } from "@/lib/copy";
import { cardVariants, listStagger } from "@/lib/motion";
import type { Habit } from "@/types";

export default function HabitsPage() {
  const habits = useHabitStore((s) => s.habits);
  const remove = useHabitStore((s) => s.remove);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);

  return (
    <motion.div
      className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={listStagger}
    >
      <motion.div variants={cardVariants} className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Habits</h1>
        <Button
          size="sm"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          type="button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New habit
        </Button>
      </motion.div>

      {habits.length === 0 ? (
        <EmptyState title={copy.emptyHabits} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={() => {
                  setEditing(habit);
                  setFormOpen(true);
                }}
                onDelete={() => setDeleteTarget(habit)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <HabitFormModal open={formOpen} onClose={() => setFormOpen(false)} habit={editing} />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            remove(deleteTarget.id);
            toast("Habit deleted");
          }
        }}
        title={`Delete "${deleteTarget?.title}"?`}
        description="Its history will be removed too."
      />
    </motion.div>
  );
}
