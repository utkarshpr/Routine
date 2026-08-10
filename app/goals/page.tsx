"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cardVariants, listStagger } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalFormModal } from "@/components/goals/GoalFormModal";
import { useGoalStore } from "@/stores/goalStore";
import { toast } from "@/stores/toastStore";
import { copy } from "@/lib/copy";
import type { Goal } from "@/types";

export default function GoalsPage() {
  const goals = useGoalStore((s) => s.goals);
  const remove = useGoalStore((s) => s.remove);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
        <Button
          size="sm"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          type="button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState title={copy.emptyGoals} />
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          initial="initial"
          animate="animate"
          variants={listStagger}
        >
          <AnimatePresence mode="popLayout">
            {goals.map((goal) => (
              <motion.div key={goal.id} variants={cardVariants} layout>
                <GoalCard
                  goal={goal}
                  onEdit={() => {
                    setEditing(goal);
                    setFormOpen(true);
                  }}
                  onDelete={() => setDeleteTarget(goal)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <GoalFormModal open={formOpen} onClose={() => setFormOpen(false)} goal={editing} />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            remove(deleteTarget.id);
            toast("Goal deleted");
          }
        }}
        title={`Delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
