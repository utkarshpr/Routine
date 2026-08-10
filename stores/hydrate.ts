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

let hydrationStarted = false;

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
