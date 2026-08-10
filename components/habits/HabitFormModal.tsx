"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, TextField } from "@/components/ui/Field";
import { CategoryIcon, ICON_NAMES } from "@/components/ui/CategoryIcon";
import { ACCENT_COLORS, DAY_LABELS } from "@/lib/constants";
import { useHabitStore } from "@/stores/habitStore";
import { toast } from "@/stores/toastStore";
import type { DayOfWeek, Habit } from "@/types";

const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

export function HabitFormModal({ open, onClose, habit }: { open: boolean; onClose: () => void; habit?: Habit }) {
  const addHabit = useHabitStore((s) => s.add);
  const updateHabit = useHabitStore((s) => s.update);

  const [title, setTitle] = useState(habit?.title ?? "");
  const [icon, setIcon] = useState(habit?.icon ?? "Sparkles");
  const [color, setColor] = useState(habit?.color ?? ACCENT_COLORS[0]);
  const [days, setDays] = useState<DayOfWeek[]>(habit?.targetDaysOfWeek ?? ALL_DAYS);
  const [lastHabitId, setLastHabitId] = useState(habit?.id);

  if (habit?.id !== lastHabitId) {
    setLastHabitId(habit?.id);
    setTitle(habit?.title ?? "");
    setIcon(habit?.icon ?? "Sparkles");
    setColor(habit?.color ?? ACCENT_COLORS[0]);
    setDays(habit?.targetDaysOfWeek ?? ALL_DAYS);
  }

  function toggleDay(day: DayOfWeek) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    if (habit) {
      await updateHabit(habit.id, { title: title.trim(), icon, color, targetDaysOfWeek: days });
      toast("Habit updated", "success");
    } else {
      await addHabit({ title: title.trim(), icon, color, targetDaysOfWeek: days });
      toast("Habit added", "success");
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={habit ? "Edit habit" : "New habit"} className="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">{habit ? "Edit habit" : "New habit"}</h2>
        <div>
          <Label htmlFor="habit-title">Title</Label>
          <TextField id="habit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-1.5">
            {ICON_NAMES.map((name) => (
              <motion.button
                key={name}
                type="button"
                onClick={() => setIcon(name)}
                aria-label={name}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${icon === name ? "border-accent bg-accent/10" : "border-border bg-surface-2"}`}
              >
                <CategoryIcon iconName={name} className="h-4 w-4" />
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <Label>Color</Label>
          <div className="flex flex-wrap gap-1.5">
            {[color, ...ACCENT_COLORS.filter((c) => c !== color)].map((c) => (
              <motion.button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div>
          <Label>Target days</Label>
          <div className="flex gap-1.5">
            {ALL_DAYS.map((day) => (
              <motion.button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={`h-9 w-9 rounded-full text-xs font-medium ${days.includes(day) ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted"}`}
              >
                {DAY_LABELS[day][0]}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{habit ? "Save changes" : "Add habit"}</Button>
        </div>
      </form>
    </Modal>
  );
}
