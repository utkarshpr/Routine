import { addDays, dateKey } from "@/lib/dates";
import type { HabitCompletion } from "@/types";

function isDone(completions: HabitCompletion[], habitId: string, date: string): boolean {
  return completions.some((c) => c.habitId === habitId && c.date === date && c.completed);
}

/** Consecutive completed days ending today (or yesterday if today isn't done yet). */
export function currentStreak(habitId: string, completions: HabitCompletion[], today: Date = new Date()): number {
  let streak = 0;
  let cursor = today;

  if (!isDone(completions, habitId, dateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  while (isDone(completions, habitId, dateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function completionPctForDates(
  habitId: string,
  completions: HabitCompletion[],
  dates: string[]
): number {
  if (dates.length === 0) return 0;
  const done = dates.filter((d) => isDone(completions, habitId, d)).length;
  return Math.round((done / dates.length) * 100);
}
