import { dateKey, durationMinutes } from "@/lib/dates";
import type { Task } from "@/types";

export interface WeeklyStats {
  studyMinutes: number;
  dsaSessions: number;
  hldSessions: number;
  lldSessions: number;
  golangMinutes: number;
  gymCompleted: number;
  gymTotal: number;
  routineCompletionPct: number;
  missedCount: number;
  plannedMinutes: number;
}

export function computeWeeklyStats(tasks: Task[], weekDates: Date[]): WeeklyStats {
  const dates = new Set(weekDates.map(dateKey));
  const weekTasks = tasks.filter((t) => dates.has(t.date));
  const completed = weekTasks.filter((t) => t.status === "completed");

  const minutesFor = (category: Task["category"]) =>
    completed.filter((t) => t.category === category).reduce((sum, t) => sum + durationMinutes(t.startTime, t.endTime), 0);

  const gymTasks = weekTasks.filter((t) => t.category === "Gym");
  const requiring = weekTasks.filter((t) => t.completionRequired);
  const plannedMinutes = weekTasks.reduce((sum, t) => sum + durationMinutes(t.startTime, t.endTime), 0);

  return {
    studyMinutes: minutesFor("DSA") + minutesFor("HLD") + minutesFor("LLD") + minutesFor("Golang"),
    dsaSessions: completed.filter((t) => t.category === "DSA").length,
    hldSessions: completed.filter((t) => t.category === "HLD").length,
    lldSessions: completed.filter((t) => t.category === "LLD").length,
    golangMinutes: minutesFor("Golang"),
    gymCompleted: gymTasks.filter((t) => t.status === "completed").length,
    gymTotal: gymTasks.length,
    routineCompletionPct:
      requiring.length === 0 ? 0 : Math.round((requiring.filter((t) => t.status === "completed").length / requiring.length) * 100),
    missedCount: requiring.filter((t) => t.status === "pending").length,
    plannedMinutes,
  };
}
