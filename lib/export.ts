import { db } from "@/lib/db";
import type {
  FocusSession,
  Goal,
  Habit,
  HabitCompletion,
  Routine,
  Settings,
  Task,
  WeeklyReview,
} from "@/types";

export interface DailyOSExport {
  version: 1;
  exportedAt: string;
  routines: Routine[];
  tasks: Task[];
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  goals: Goal[];
  focusSessions: FocusSession[];
  weeklyReviews: WeeklyReview[];
  settings: Settings[];
}

export async function buildExportSnapshot(): Promise<DailyOSExport> {
  const [routines, tasks, habits, habitCompletions, goals, focusSessions, weeklyReviews, settings] =
    await Promise.all([
      db.getAll("routines"),
      db.getAll("tasks"),
      db.getAll("habits"),
      db.getAll("habitCompletions"),
      db.getAll("goals"),
      db.getAll("focusSessions"),
      db.getAll("weeklyReviews"),
      db.getAll("settings"),
    ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    routines,
    tasks,
    habits,
    habitCompletions,
    goals,
    focusSessions,
    weeklyReviews,
    settings,
  };
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportAsJSON(): Promise<void> {
  const snapshot = await buildExportSnapshot();
  downloadBlob(
    JSON.stringify(snapshot, null, 2),
    `daily-os-export-${snapshot.exportedAt.slice(0, 10)}.json`,
    "application/json"
  );
}

export async function importFromJSON(text: string): Promise<void> {
  const parsed = JSON.parse(text) as Partial<DailyOSExport>;
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid export file");

  const writes: Promise<unknown>[] = [];
  parsed.routines?.forEach((r) => writes.push(db.put("routines", r)));
  parsed.tasks?.forEach((t) => writes.push(db.put("tasks", t)));
  parsed.habits?.forEach((h) => writes.push(db.put("habits", h)));
  parsed.habitCompletions?.forEach((c) => writes.push(db.put("habitCompletions", c)));
  parsed.goals?.forEach((g) => writes.push(db.put("goals", g)));
  parsed.focusSessions?.forEach((f) => writes.push(db.put("focusSessions", f)));
  parsed.weeklyReviews?.forEach((w) => writes.push(db.put("weeklyReviews", w)));
  parsed.settings?.forEach((s) => writes.push(db.put("settings", s)));

  await Promise.all(writes);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function exportTasksAsCSV(): Promise<void> {
  const tasks = await db.getAll("tasks");
  const header = ["date", "title", "category", "start", "end", "type", "status", "priority"];
  const rows = tasks.map((t) =>
    [t.date, t.title, t.category, t.startTime, t.endTime, t.type, t.status, t.priority]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );
  downloadBlob([header.join(","), ...rows].join("\n"), "daily-os-tasks.csv", "text/csv");
}

export async function exportHabitsAsCSV(): Promise<void> {
  const [habits, completions] = await Promise.all([
    db.getAll("habits"),
    db.getAll("habitCompletions"),
  ]);
  const habitTitle = new Map(habits.map((h) => [h.id, h.title]));
  const header = ["date", "habit", "completed"];
  const rows = completions.map((c) =>
    [c.date, habitTitle.get(c.habitId) ?? c.habitId, String(c.completed)]
      .map((v) => csvEscape(v))
      .join(",")
  );
  downloadBlob([header.join(","), ...rows].join("\n"), "daily-os-habits.csv", "text/csv");
}

export async function resetAllData(): Promise<void> {
  await db.clearAll();
}
