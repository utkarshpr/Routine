import { createId } from "@/lib/id";
import { addMinutesToTime, dayOfWeek, durationMinutes, minutesToTime, timeToMinutes } from "@/lib/dates";
import type { Routine, Task } from "@/types";

/** Build (but do not persist) the Task instances a set of routines should produce for a date. */
export function materializeTasksForDate(
  routines: Routine[],
  existingTasks: Task[],
  date: string
): Task[] {
  const dow = dayOfWeek(date);
  const existingRoutineIds = new Set(
    existingTasks.filter((t) => t.date === date && t.routineId).map((t) => t.routineId)
  );
  const now = new Date().toISOString();

  return routines
    .filter((r) => r.recurring && !r.paused && r.daysOfWeek.includes(dow))
    .filter((r) => !existingRoutineIds.has(r.id))
    .map((r) => ({
      id: createId(),
      routineId: r.id,
      date,
      title: r.title,
      category: r.category,
      startTime: r.startTime,
      endTime: r.endTime,
      priority: r.priority,
      icon: r.icon,
      color: r.color,
      notes: r.notes,
      type: r.type,
      status: "pending" as const,
      completionRequired: r.completionRequired,
      order: r.order,
      createdAt: now,
      updatedAt: now,
    }));
}

export function sortByStart(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

export interface DayStatus {
  current: Task | null;
  next: Task | null;
  overdueIds: string[];
  completedCount: number;
  totalCount: number;
  progressPct: number;
}

function nowMinutesOf(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

type Placement = "current" | "overdue" | "upcoming";

function placeTask(task: Task, nowMin: number): Placement {
  const start = timeToMinutes(task.startTime);
  let end = timeToMinutes(task.endTime);
  const spansMidnight = end <= start;
  if (spansMidnight) end += 1440;
  const effectiveNow = spansMidnight && nowMin < start ? nowMin + 1440 : nowMin;

  if (effectiveNow >= start && effectiveNow < end) return "current";
  if (effectiveNow >= end) return "overdue";
  return "upcoming";
}

export function computeDayStatus(tasks: Task[], now: Date = new Date()): DayStatus {
  const sorted = sortByStart(tasks);
  const nowMin = nowMinutesOf(now);

  let current: Task | null = null;
  let next: Task | null = null;
  const overdueIds: string[] = [];

  for (const task of sorted) {
    if (task.status !== "pending") continue;
    const placement = placeTask(task, nowMin);
    if (placement === "current") current = current ?? task;
    else if (placement === "overdue") overdueIds.push(task.id);
    else next = next ?? task;
  }

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.filter((t) => t.completionRequired).length || tasks.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return { current, next, overdueIds, completedCount, totalCount, progressPct };
}

export interface ConflictGroup {
  taskIds: string[];
}

export function findConflicts(tasks: Task[]): ConflictGroup[] {
  const sorted = sortByStart(tasks.filter((t) => t.status !== "skipped"));
  const groups: ConflictGroup[] = [];
  let currentGroup: Task[] = [];
  let groupEnd = -Infinity;

  for (const task of sorted) {
    const start = timeToMinutes(task.startTime);
    const end = timeToMinutes(task.endTime);
    if (currentGroup.length > 0 && start < groupEnd) {
      currentGroup.push(task);
      groupEnd = Math.max(groupEnd, end);
    } else {
      if (currentGroup.length > 1) groups.push({ taskIds: currentGroup.map((t) => t.id) });
      currentGroup = [task];
      groupEnd = end;
    }
  }
  if (currentGroup.length > 1) groups.push({ taskIds: currentGroup.map((t) => t.id) });
  return groups;
}

/**
 * Shift a task to a new start time, then cascade-shift subsequent FLEXIBLE
 * tasks forward just enough to avoid overlaps. FIXED tasks are never moved.
 */
export function rescheduleTask(
  dayTasks: Task[],
  taskId: string,
  newStartTime: string
): Task[] {
  const target = dayTasks.find((t) => t.id === taskId);
  if (!target) return dayTasks;

  const duration = durationMinutes(target.startTime, target.endTime);
  const updated = dayTasks.map((t) =>
    t.id === taskId
      ? { ...t, startTime: newStartTime, endTime: addMinutesToTime(newStartTime, duration) }
      : t
  );

  return cascadeForward(updated, taskId);
}

/** Push forward any FLEXIBLE tasks (in start-time order after `fromTaskId`) that now overlap a preceding task. */
export function cascadeForward(dayTasks: Task[], fromTaskId: string): Task[] {
  const sorted = sortByStart(dayTasks);
  const fromIndex = sorted.findIndex((t) => t.id === fromTaskId);
  if (fromIndex === -1) return dayTasks;

  const result = [...sorted];
  let cursor = timeToMinutes(result[fromIndex].endTime);

  for (let i = fromIndex + 1; i < result.length; i++) {
    const task = result[i];
    const start = timeToMinutes(task.startTime);
    const end = timeToMinutes(task.endTime);
    const duration = end - start;

    if (start < cursor) {
      if (task.type === "FIXED") {
        // Can't move it; leave a potential conflict, but don't push past it silently.
        cursor = Math.max(cursor, end);
        continue;
      }
      const newStart = cursor;
      result[i] = { ...task, startTime: minutesToTime(newStart), endTime: minutesToTime(newStart + duration) };
      cursor = newStart + duration;
    } else {
      cursor = Math.max(cursor, end);
    }
  }

  return result;
}

export function autoResolveConflicts(dayTasks: Task[]): Task[] {
  const sorted = sortByStart(dayTasks);
  let result = sorted;
  for (const group of findConflicts(sorted)) {
    const anchor = sortByStart(result.filter((t) => group.taskIds.includes(t.id)))[0];
    result = cascadeForward(result, anchor.id);
  }
  return result;
}

const QUICK_MOVE_OPTIONS = [15, 30, 60] as const;
export function quickMoveOffsets(): readonly number[] {
  return QUICK_MOVE_OPTIONS;
}
