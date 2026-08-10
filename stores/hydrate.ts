"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore } from "@/stores/taskStore";
import { useHabitStore } from "@/stores/habitStore";
import { useGoalStore } from "@/stores/goalStore";
import { useFocusStore } from "@/stores/focusStore";
import { useReviewStore } from "@/stores/reviewStore";
import { defaultSeedGoals, defaultSeedHabits, defaultSeedRoutines } from "@/lib/seed";
import type { Goal, Habit } from "@/types";

let hydrationStarted = false;

function habitSignature(habit: Habit): string {
  return [
    habit.title.trim().toLowerCase(),
    habit.icon,
    habit.color.toLowerCase(),
    [...habit.targetDaysOfWeek].sort((a, b) => a - b).join(","),
  ].join("|");
}

function goalSignature(goal: Goal): string {
  return [
    goal.title.trim().toLowerCase(),
    goal.targetDate,
    goal.areas.join("|"),
    goal.milestones.map((milestone) => milestone.title.trim().toLowerCase()).join("|"),
  ].join("|");
}

async function removeDuplicateDefaults() {
  const defaultHabitKeys = new Set(defaultSeedHabits().map(habitSignature));
  const defaultGoalKeys = new Set(defaultSeedGoals().map(goalSignature));

  const habits = useHabitStore.getState().habits;
  const goals = useGoalStore.getState().goals;

  const seenHabitKeys = new Set<string>();
  for (const habit of habits) {
    const key = habitSignature(habit);
    if (!defaultHabitKeys.has(key)) continue;
    if (seenHabitKeys.has(key)) {
      await useHabitStore.getState().remove(habit.id);
      continue;
    }
    seenHabitKeys.add(key);
  }

  const seenGoalKeys = new Set<string>();
  for (const goal of goals) {
    const key = goalSignature(goal);
    if (!defaultGoalKeys.has(key)) continue;
    if (seenGoalKeys.has(key)) {
      await useGoalStore.getState().remove(goal.id);
      continue;
    }
    seenGoalKeys.add(key);
  }
}

export function useHydrateApp(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hydrationStarted) return;
    hydrationStarted = true;

    (async () => {
      await Promise.all([
        useSettingsStore.getState().hydrate(),
        useRoutineStore.getState().hydrate(),
        useTaskStore.getState().hydrate(),
        useHabitStore.getState().hydrate(),
        useGoalStore.getState().hydrate(),
        useFocusStore.getState().hydrate(),
        useReviewStore.getState().hydrate(),
      ]);

      await removeDuplicateDefaults();

      const isFreshInstall =
        useRoutineStore.getState().routines.length === 0 &&
        useHabitStore.getState().habits.length === 0 &&
        useGoalStore.getState().goals.length === 0 &&
        useTaskStore.getState().tasks.length === 0 &&
        useFocusStore.getState().sessions.length === 0 &&
        useReviewStore.getState().reviews.length === 0;
      if (isFreshInstall) {
        await Promise.all([
          useRoutineStore.getState().seed(defaultSeedRoutines()),
          useHabitStore.getState().seed(defaultSeedHabits()),
          useGoalStore.getState().seed(defaultSeedGoals()),
        ]);
      }

      setReady(true);
    })();
  }, []);

  return ready;
}
