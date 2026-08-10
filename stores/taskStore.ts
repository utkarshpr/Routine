import { create } from "zustand";
import { db } from "@/lib/db";
import { createId } from "@/lib/id";
import { dayOfWeek } from "@/lib/dates";
import { autoResolveConflicts, materializeTasksForDate, rescheduleTask } from "@/lib/scheduler";
import type { Routine, Task } from "@/types";

interface TaskState {
  tasks: Task[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  ensureDate: (date: string, routines: Routine[]) => Promise<void>;
  addManualTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "order">) => Promise<Task>;
  updateTask: (id: string, partial: Partial<Task>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  skipTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  removeFutureByRoutineId: (routineId: string, fromDate: string) => Promise<void>;
  removeFutureByRoutineIds: (routineIds: string[], fromDate: string) => Promise<void>;
  syncFutureWithRoutine: (routine: Routine, fromDate: string) => Promise<void>;
  moveTask: (id: string, newStartTime: string) => Promise<void>;
  moveTaskToDate: (id: string, newDate: string, newStartTime?: string) => Promise<void>;
  autoResolveDay: (date: string) => Promise<void>;
}

async function persistMany(tasks: Task[]) {
  await Promise.all(tasks.map((t) => db.put("tasks", t)));
}

// Guards against overlapping ensureDate(date) calls for the same date (e.g.
// React StrictMode's double-invoked effects, or two components viewing the
// same date at once) racing to read stale state and both generating the
// same routine's task twice.
const ensureDateLocks = new Map<string, Promise<void>>();

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  hydrated: false,
  hydrate: async () => {
    const tasks = await db.getAll("tasks");
    set({ tasks, hydrated: true });
  },
  ensureDate: async (date, routines) => {
    const inFlight = ensureDateLocks.get(date);
    if (inFlight) return inFlight;

    const run = (async () => {
      const generated = materializeTasksForDate(routines, get().tasks, date);
      if (generated.length > 0) {
        await persistMany(generated);
        set((state) => ({ tasks: [...state.tasks, ...generated] }));
      }
    })();

    ensureDateLocks.set(date, run);
    try {
      await run;
    } finally {
      ensureDateLocks.delete(date);
    }
  },
  addManualTask: async (partial) => {
    const now = new Date().toISOString();
    const dayTasks = get().tasks.filter((t) => t.date === partial.date);
    const task: Task = { ...partial, id: createId(), order: dayTasks.length, createdAt: now, updatedAt: now };
    await db.put("tasks", task);
    set((state) => ({ tasks: [...state.tasks, task] }));
    return task;
  },
  updateTask: async (id, partial) => {
    const existing = get().tasks.find((t) => t.id === id);
    if (!existing) return;
    const updated = { ...existing, ...partial, updatedAt: new Date().toISOString() };
    await db.put("tasks", updated);
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? updated : t)) }));
  },
  completeTask: async (id) => {
    await get().updateTask(id, { status: "completed" });
  },
  uncompleteTask: async (id) => {
    await get().updateTask(id, { status: "pending" });
  },
  skipTask: async (id) => {
    await get().updateTask(id, { status: "skipped" });
  },
  removeTask: async (id) => {
    await db.remove("tasks", id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
  removeFutureByRoutineId: async (routineId, fromDate) => {
    const toRemove = get().tasks.filter(
      (t) => t.routineId === routineId && t.date >= fromDate && t.status === "pending"
    );
    await Promise.all(toRemove.map((t) => db.remove("tasks", t.id)));
    const removedIds = new Set(toRemove.map((t) => t.id));
    set((state) => ({ tasks: state.tasks.filter((t) => !removedIds.has(t.id)) }));
  },
  removeFutureByRoutineIds: async (routineIds, fromDate) => {
    if (routineIds.length === 0) return;
    const routineIdSet = new Set(routineIds);
    const toRemove = get().tasks.filter(
      (task) =>
        task.routineId !== null &&
        routineIdSet.has(task.routineId) &&
        task.date >= fromDate &&
        task.status === "pending"
    );
    await Promise.all(toRemove.map((task) => db.remove("tasks", task.id)));
    const removedIds = new Set(toRemove.map((task) => task.id));
    set((state) => ({ tasks: state.tasks.filter((task) => !removedIds.has(task.id)) }));
  },
  syncFutureWithRoutine: async (routine, fromDate) => {
    const affected = get().tasks.filter(
      (task) => task.routineId === routine.id && task.date >= fromDate && task.status === "pending"
    );
    if (affected.length === 0) return;

    const now = new Date().toISOString();
    const toRemove = affected.filter((task) => {
      if (routine.paused) return true;
      if (routine.recurring) return !routine.daysOfWeek.includes(dayOfWeek(task.date));
      return false;
    });
    const toUpdate = affected
      .filter((task) => !toRemove.some((removed) => removed.id === task.id))
      .map((task) => ({
        ...task,
        title: routine.title,
        category: routine.category,
        startTime: routine.startTime,
        endTime: routine.endTime,
        priority: routine.priority,
        icon: routine.icon,
        color: routine.color,
        notes: routine.notes,
        type: routine.type,
        completionRequired: routine.completionRequired,
        updatedAt: now,
      }));

    await Promise.all([
      ...toRemove.map((task) => db.remove("tasks", task.id)),
      ...toUpdate.map((task) => db.put("tasks", task)),
    ]);

    const removedIds = new Set(toRemove.map((task) => task.id));
    const updatedById = new Map(toUpdate.map((task) => [task.id, task]));
    set((state) => ({
      tasks: state.tasks
        .filter((task) => !removedIds.has(task.id))
        .map((task) => updatedById.get(task.id) ?? task),
    }));
  },
  moveTask: async (id, newStartTime) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const dayTasks = get().tasks.filter((t) => t.date === task.date);
    const updatedDay = rescheduleTask(dayTasks, id, newStartTime);
    await persistMany(updatedDay);
    const byId = new Map(updatedDay.map((t) => [t.id, t]));
    set((state) => ({ tasks: state.tasks.map((t) => byId.get(t.id) ?? t) }));
  },
  moveTaskToDate: async (id, newDate, newStartTime) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    await get().updateTask(id, {
      date: newDate,
      startTime: newStartTime ?? task.startTime,
      endTime: newStartTime
        ? task.endTime // caller can follow up with moveTask for duration-adjusted end time
        : task.endTime,
    });
  },
  autoResolveDay: async (date) => {
    const dayTasks = get().tasks.filter((t) => t.date === date);
    const resolved = autoResolveConflicts(dayTasks);
    await persistMany(resolved);
    const byId = new Map(resolved.map((t) => [t.id, t]));
    set((state) => ({ tasks: state.tasks.map((t) => byId.get(t.id) ?? t) }));
  },
}));

export function selectTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => t.date === date);
}
