"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { CategoryIcon, ICON_NAMES } from "@/components/ui/CategoryIcon";
import { CATEGORY_META, DAY_LABELS, ACCENT_COLORS } from "@/lib/constants";
import { dayOfWeek, todayKey } from "@/lib/dates";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore } from "@/stores/taskStore";
import { toast } from "@/stores/toastStore";
import { CATEGORIES, type Category, type DayOfWeek, type Routine, type TaskType } from "@/types";

const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

interface FormState {
  title: string;
  category: Category;
  startTime: string;
  endTime: string;
  daysOfWeek: DayOfWeek[];
  priority: "low" | "medium" | "high";
  icon: string;
  color: string;
  notes: string;
  recurring: boolean;
  oneTimeDate: string;
  reminderEnabled: boolean;
  reminderOffset: number;
  reminderSound: boolean;
  completionRequired: boolean;
  type: TaskType;
}

function initialState(routine?: Routine): FormState {
  if (routine) {
    return {
      title: routine.title,
      category: routine.category,
      startTime: routine.startTime,
      endTime: routine.endTime,
      daysOfWeek: routine.daysOfWeek,
      priority: routine.priority,
      icon: routine.icon,
      color: routine.color,
      notes: routine.notes ?? "",
      recurring: routine.recurring,
      oneTimeDate: todayKey(),
      reminderEnabled: routine.reminder.enabled,
      reminderOffset: routine.reminder.offsetMinutes,
      reminderSound: routine.reminder.sound,
      completionRequired: routine.completionRequired,
      type: routine.type,
    };
  }
  const meta = CATEGORY_META.Other;
  return {
    title: "",
    category: "Other",
    startTime: "09:00",
    endTime: "10:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    priority: "medium",
    icon: meta.icon,
    color: meta.color,
    notes: "",
    recurring: true,
    oneTimeDate: todayKey(),
    reminderEnabled: true,
    reminderOffset: 10,
    reminderSound: true,
    completionRequired: true,
    type: "FLEXIBLE",
  };
}

export function RoutineFormModal({
  open,
  onClose,
  routine,
}: {
  open: boolean;
  onClose: () => void;
  routine?: Routine;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(routine));
  const [lastRoutineId, setLastRoutineId] = useState(routine?.id);
  const addRoutine = useRoutineStore((s) => s.add);
  const updateRoutine = useRoutineStore((s) => s.update);
  const addManualTask = useTaskStore((s) => s.addManualTask);

  if (routine?.id !== lastRoutineId) {
    setLastRoutineId(routine?.id);
    setForm(initialState(routine));
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDay(day: DayOfWeek) {
    set(
      "daysOfWeek",
      form.daysOfWeek.includes(day)
        ? form.daysOfWeek.filter((d) => d !== day)
        : [...form.daysOfWeek, day].sort((a, b) => a - b)
    );
  }

  function handleCategoryChange(category: Category) {
    const meta = CATEGORY_META[category];
    setForm((prev) => ({ ...prev, category, icon: meta.icon, color: meta.color }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const daysOfWeek = form.recurring ? form.daysOfWeek : [dayOfWeek(form.oneTimeDate)];
    const payload = {
      title: form.title.trim(),
      category: form.category,
      startTime: form.startTime,
      endTime: form.endTime,
      daysOfWeek,
      priority: form.priority,
      icon: form.icon,
      color: form.color,
      notes: form.notes.trim() || undefined,
      recurring: form.recurring,
      reminder: { enabled: form.reminderEnabled, offsetMinutes: form.reminderOffset, sound: form.reminderSound },
      completionRequired: form.completionRequired,
      type: form.type,
      paused: routine?.paused ?? false,
    };

    if (routine) {
      await updateRoutine(routine.id, payload);
      toast("Routine updated", "success");
    } else {
      const created = await addRoutine(payload);
      if (!form.recurring) {
        await addManualTask({
          routineId: created.id,
          date: form.oneTimeDate,
          title: created.title,
          category: created.category,
          startTime: created.startTime,
          endTime: created.endTime,
          priority: created.priority,
          icon: created.icon,
          color: created.color,
          notes: created.notes,
          type: created.type,
          status: "pending",
          completionRequired: created.completionRequired,
        });
      }
      toast("Routine created", "success");
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={routine ? "Edit routine" : "New routine"} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">{routine ? "Edit routine" : "New routine"}</h2>

        <div>
          <Label htmlFor="rf-title">Title</Label>
          <TextField id="rf-title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rf-category">Category</Label>
            <SelectField
              id="rf-category"
              value={form.category}
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <Label htmlFor="rf-priority">Priority</Label>
            <SelectField
              id="rf-priority"
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as FormState["priority"])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </SelectField>
          </div>
          <div>
            <Label htmlFor="rf-start">Start time</Label>
            <TextField id="rf-start" type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="rf-end">End time</Label>
            <TextField id="rf-end" type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => set("recurring", true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${form.recurring ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2"}`}
          >
            Recurring
          </motion.button>
          <motion.button
            type="button"
            onClick={() => set("recurring", false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${!form.recurring ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2"}`}
          >
            One-time
          </motion.button>
        </div>

        {form.recurring ? (
          <div>
            <Label>Days of week</Label>
            <div className="flex gap-1.5">
              {ALL_DAYS.map((day) => (
                <motion.button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className={`h-9 w-9 rounded-full text-xs font-medium ${form.daysOfWeek.includes(day) ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted"}`}
                >
                  {DAY_LABELS[day][0]}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="rf-date">Date</Label>
            <TextField id="rf-date" type="date" value={form.oneTimeDate} onChange={(e) => set("oneTimeDate", e.target.value)} />
          </div>
        )}

        <div>
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-1.5">
            {ICON_NAMES.map((name) => (
              <motion.button
                key={name}
                type="button"
                onClick={() => set("icon", name)}
                aria-label={name}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${form.icon === name ? "border-accent bg-accent/10" : "border-border bg-surface-2"}`}
              >
                <CategoryIcon iconName={name} className="h-4 w-4" />
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <Label>Color</Label>
          <div className="flex flex-wrap gap-1.5">
            {[form.color, ...ACCENT_COLORS.filter((c) => c !== form.color)].map((color) => (
              <motion.button
                key={color}
                type="button"
                onClick={() => set("color", color)}
                aria-label={color}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className={`h-8 w-8 rounded-full border-2 ${form.color === color ? "border-foreground" : "border-transparent"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="rf-notes">Notes</Label>
          <TextAreaField id="rf-notes" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => set("type", "FIXED")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${form.type === "FIXED" ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2"}`}
          >
            Fixed
          </motion.button>
          <motion.button
            type="button"
            onClick={() => set("type", "FLEXIBLE")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium ${form.type === "FLEXIBLE" ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2"}`}
          >
            Flexible
          </motion.button>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-3">
          <label className="flex items-center justify-between text-sm">
            Reminder
            <input
              type="checkbox"
              checked={form.reminderEnabled}
              onChange={(e) => set("reminderEnabled", e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
          </label>
          {form.reminderEnabled && (
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Notify before</span>
              <SelectField
                className="w-28"
                value={String(form.reminderOffset)}
                onChange={(e) => set("reminderOffset", Number(e.target.value))}
              >
                {[0, 5, 10, 15, 30].map((m) => (
                  <option key={m} value={m}>
                    {m === 0 ? "At start" : `${m} min`}
                  </option>
                ))}
              </SelectField>
            </div>
          )}
          <label className="flex items-center justify-between text-sm">
            Completion required
            <input
              type="checkbox"
              checked={form.completionRequired}
              onChange={(e) => set("completionRequired", e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{routine ? "Save changes" : "Create routine"}</Button>
        </div>
      </form>
    </Modal>
  );
}
