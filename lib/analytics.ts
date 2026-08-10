import { dateKey, durationMinutes, weekDates } from "@/lib/dates";
import type { Category, DayOfWeek, FocusSession, Task } from "@/types";

const STUDY_CATEGORIES: Category[] = ["DSA", "HLD", "LLD", "Golang"];

export function weekStudyMinutes(tasks: Task[], reference: Date, weekStartsOn: DayOfWeek): number {
  const dates = new Set(weekDates(reference, weekStartsOn).map(dateKey));
  return tasks
    .filter((t) => dates.has(t.date) && t.status === "completed" && STUDY_CATEGORIES.includes(t.category))
    .reduce((sum, t) => sum + durationMinutes(t.startTime, t.endTime), 0);
}

export function focusMinutesOn(sessions: FocusSession[], date: string): number {
  return Math.round(
    sessions
      .filter((s) => s.startedAt.slice(0, 10) === date && s.status !== "abandoned")
      .reduce((sum, s) => sum + s.elapsedSeconds, 0) / 60
  );
}

export function monthHabitCompletionPct(
  completions: { date: string; completed: boolean }[],
  monthPrefix: string
): number {
  const thisMonth = completions.filter((c) => c.date.startsWith(monthPrefix));
  if (thisMonth.length === 0) return 0;
  const done = thisMonth.filter((c) => c.completed).length;
  return Math.round((done / thisMonth.length) * 100);
}
