"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, TextAreaField, TextField } from "@/components/ui/Field";
import { useGoalStore } from "@/stores/goalStore";
import { toast } from "@/stores/toastStore";
import { CATEGORIES, type Category, type Goal } from "@/types";

export function GoalFormModal({ open, onClose, goal }: { open: boolean; onClose: () => void; goal?: Goal }) {
  const addGoal = useGoalStore((s) => s.add);
  const updateGoal = useGoalStore((s) => s.update);

  const [title, setTitle] = useState(goal?.title ?? "");
  const [targetDate, setTargetDate] = useState(goal?.targetDate ?? "");
  const [areas, setAreas] = useState<Category[]>(goal?.areas ?? []);
  const [notes, setNotes] = useState(goal?.notes ?? "");
  const [lastGoalId, setLastGoalId] = useState(goal?.id);

  if (goal?.id !== lastGoalId) {
    setLastGoalId(goal?.id);
    setTitle(goal?.title ?? "");
    setTargetDate(goal?.targetDate ?? "");
    setAreas(goal?.areas ?? []);
    setNotes(goal?.notes ?? "");
  }

  function toggleArea(category: Category) {
    setAreas((prev) => (prev.includes(category) ? prev.filter((a) => a !== category) : [...prev, category]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;
    if (goal) {
      await updateGoal(goal.id, { title: title.trim(), targetDate, areas, notes });
      toast("Goal updated", "success");
    } else {
      await addGoal({ title: title.trim(), targetDate, areas, notes, progress: 0, milestones: [] });
      toast("Goal created", "success");
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={goal ? "Edit goal" : "New goal"} className="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">{goal ? "Edit goal" : "New goal"}</h2>
        <div>
          <Label htmlFor="goal-title">Title</Label>
          <TextField id="goal-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="goal-date">Target date</Label>
          <TextField id="goal-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
        </div>
        <div>
          <Label>Areas</Label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <motion.button
                key={c}
                type="button"
                onClick={() => toggleArea(c)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  areas.includes(c) ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted"
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="goal-notes">Notes</Label>
          <TextAreaField id="goal-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{goal ? "Save changes" : "Create goal"}</Button>
        </div>
      </form>
    </Modal>
  );
}
