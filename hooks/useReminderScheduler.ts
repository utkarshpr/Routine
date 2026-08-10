"use client";

import { useEffect } from "react";
import { cancelAllForegroundReminders, scheduleForegroundReminder } from "@/lib/notifications";
import { addMinutesToTime, todayKey } from "@/lib/dates";
import { toast } from "@/stores/toastStore";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore, selectTasksForDate } from "@/stores/taskStore";
import { useSettingsStore } from "@/stores/settingsStore";

/** Schedules in-app/browser reminders for today's pending tasks whose source routine has reminders enabled. */
export function useReminderScheduler() {
  const routines = useRoutineStore((s) => s.routines);
  const tasks = useTaskStore((s) => s.tasks);
  const notificationsEnabled = useSettingsStore((s) => s.settings.notificationsEnabled);

  useEffect(() => {
    cancelAllForegroundReminders();
    if (!notificationsEnabled) return;

    const today = todayKey();
    const routineById = new Map(routines.map((r) => [r.id, r]));
    const todayTasks = selectTasksForDate(tasks, today).filter((t) => t.status === "pending");

    for (const task of todayTasks) {
      const routine = task.routineId ? routineById.get(task.routineId) : undefined;
      if (!routine?.reminder.enabled) continue;

      const fireTime = addMinutesToTime(task.startTime, -routine.reminder.offsetMinutes);
      const [h, m] = fireTime.split(":").map(Number);
      const fireAt = new Date();
      fireAt.setHours(h, m, 0, 0);
      if (fireAt.getTime() <= Date.now()) continue;

      const body =
        routine.reminder.offsetMinutes === 0
          ? `${task.title} starts now`
          : `${task.title} starts in ${routine.reminder.offsetMinutes} minutes`;

      scheduleForegroundReminder(task.id, fireAt, "Daily OS", body, (title, message) => toast(message));
    }

    return () => cancelAllForegroundReminders();
  }, [routines, tasks, notificationsEnabled]);
}
