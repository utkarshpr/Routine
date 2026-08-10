import { create } from "zustand";
import { db } from "@/lib/db";
import { createId } from "@/lib/id";
import type { Habit, HabitCompletion } from "@/types";

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  seed: (habits: Habit[]) => Promise<void>;
  add: (habit: Omit<Habit, "id" | "createdAt" | "archived">) => Promise<Habit>;
  update: (id: string, partial: Partial<Habit>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: [],
  hydrated: false,
  hydrate: async () => {
    const [habits, completions] = await Promise.all([
      db.getAll("habits"),
      db.getAll("habitCompletions"),
    ]);
    set({ habits, completions, hydrated: true });
  },
  seed: async (habits) => {
    await Promise.all(habits.map((h) => db.put("habits", h)));
    set((state) => ({ habits: [...state.habits, ...habits] }));
  },
  add: async (partial) => {
    const habit: Habit = { ...partial, id: createId(), createdAt: new Date().toISOString(), archived: false };
    await db.put("habits", habit);
    set((state) => ({ habits: [...state.habits, habit] }));
    return habit;
  },
  update: async (id, partial) => {
    const existing = get().habits.find((h) => h.id === id);
    if (!existing) return;
    const updated = { ...existing, ...partial };
    await db.put("habits", updated);
    set((state) => ({ habits: state.habits.map((h) => (h.id === id ? updated : h)) }));
  },
  remove: async (id) => {
    await db.remove("habits", id);
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
  },
  toggleCompletion: async (habitId, date) => {
    const existing = get().completions.find((c) => c.habitId === habitId && c.date === date);
    if (existing) {
      const updated = { ...existing, completed: !existing.completed };
      await db.put("habitCompletions", updated);
      set((state) => ({ completions: state.completions.map((c) => (c.id === existing.id ? updated : c)) }));
    } else {
      const created: HabitCompletion = { id: createId(), habitId, date, completed: true };
      await db.put("habitCompletions", created);
      set((state) => ({ completions: [...state.completions, created] }));
    }
  },
}));
