"use client";

import { motion } from "framer-motion";
import { Check, Flame, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cardVariants } from "@/lib/motion";
import { celebrate } from "@/lib/confetti";
import { dateKey, monthDatesSoFar, todayKey, weekDates } from "@/lib/dates";
import { completionPctForDates, currentStreak } from "@/features/habits/streaks";
import { useHabitStore } from "@/stores/habitStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Habit } from "@/types";

export function HabitCard({ habit, onEdit, onDelete }: { habit: Habit; onEdit: () => void; onDelete: () => void }) {
  const completions = useHabitStore((s) => s.completions);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const weekStartsOn = useSettingsStore((s) => s.settings.weekStartsOn);

  const today = todayKey();
  const doneToday = completions.some((c) => c.habitId === habit.id && c.date === today && c.completed);
  const streak = currentStreak(habit.id, completions);
  const weekPct = completionPctForDates(habit.id, completions, weekDates(new Date(), weekStartsOn).map(dateKey));
  const monthPct = completionPctForDates(habit.id, completions, monthDatesSoFar(new Date()).map(dateKey));

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" layout>
      <Card className="p-4" spotlight>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const wasDone = doneToday;
              await toggleCompletion(habit.id, today);
              if (!wasDone) {
                const streakNow = currentStreak(habit.id, useHabitStore.getState().completions);
                if (streakNow > 0 && streakNow % 7 === 0) celebrate();
              }
            }}
            aria-label={doneToday ? "Mark not done today" : "Mark done today"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: doneToday ? habit.color : `${habit.color}1a`,
              color: doneToday ? "#fff" : habit.color,
            }}
          >
            {doneToday ? <Check className="h-4 w-4" aria-hidden="true" /> : <CategoryIcon iconName={habit.icon} className="h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{habit.title}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <Flame className="h-3 w-3" aria-hidden="true" /> {streak} day{streak === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit habit"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete habit"
            className="flex h-8 w-8 items-center justify-center rounded-full text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>This week</span>
            <span>{weekPct}%</span>
          </div>
          <ProgressBar value={weekPct} className="h-1.5" />
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>This month</span>
            <span>{monthPct}%</span>
          </div>
          <ProgressBar value={monthPct} className="h-1.5" />
        </div>
      </Card>
    </motion.div>
  );
}
