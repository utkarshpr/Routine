"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { TextField } from "@/components/ui/Field";
import { daysUntil } from "@/lib/dates";
import { useGoalStore } from "@/stores/goalStore";
import type { Goal } from "@/types";

export function GoalCard({ goal, onEdit, onDelete }: { goal: Goal; onEdit: () => void; onDelete: () => void }) {
  const toggleMilestone = useGoalStore((s) => s.toggleMilestone);
  const addMilestone = useGoalStore((s) => s.addMilestone);
  const [newMilestone, setNewMilestone] = useState("");

  const remaining = daysUntil(goal.targetDate);

  function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    addMilestone(goal.id, newMilestone.trim());
    setNewMilestone("");
  }

  return (
    <Card className="p-5" spotlight>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">{goal.title}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {remaining >= 0 ? `${remaining} days left` : "Past due"} · {goal.targetDate}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {goal.areas.map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>
        </div>
        <ProgressRing value={goal.progress} size={56} strokeWidth={5} />
      </div>

      {goal.milestones.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {goal.milestones.map((m) => (
            <li key={m.id}>
              <motion.button
                type="button"
                onClick={() => toggleMilestone(goal.id, m.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left text-sm hover:bg-surface-2"
              >
                <motion.span
                  animate={{ scale: m.done ? [1.3, 1] : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    m.done ? "border-accent bg-accent" : "border-border"
                  }`}
                />
                <span className={m.done ? "text-muted line-through" : ""}>{m.title}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddMilestone} className="mt-3 flex gap-2">
        <TextField
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
          placeholder="Add a milestone"
          className="flex-1"
        />
        <button
          type="submit"
          aria-label="Add milestone"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted hover:text-foreground"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      <div className="mt-3 flex justify-end gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit goal"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete goal"
          className="flex h-8 w-8 items-center justify-center rounded-full text-danger hover:bg-danger/10"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}
