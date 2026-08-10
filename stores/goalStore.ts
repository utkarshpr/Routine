import { create } from "zustand";
import { db } from "@/lib/db";
import { createId } from "@/lib/id";
import type { Goal, Milestone } from "@/types";

interface GoalState {
  goals: Goal[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  seed: (goals: Goal[]) => Promise<void>;
  add: (goal: Omit<Goal, "id" | "createdAt">) => Promise<Goal>;
  update: (id: string, partial: Partial<Goal>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  addMilestone: (goalId: string, title: string) => Promise<void>;
}

function progressFromMilestones(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  const done = milestones.filter((m) => m.done).length;
  return Math.round((done / milestones.length) * 100);
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  hydrated: false,
  hydrate: async () => {
    const goals = await db.getAll("goals");
    set({ goals, hydrated: true });
  },
  seed: async (goals) => {
    await Promise.all(goals.map((g) => db.put("goals", g)));
    set((state) => {
      const byId = new Map(state.goals.map((goal) => [goal.id, goal]));
      goals.forEach((goal) => byId.set(goal.id, goal));
      return { goals: Array.from(byId.values()) };
    });
  },
  add: async (partial) => {
    const goal: Goal = { ...partial, id: createId(), createdAt: new Date().toISOString() };
    await db.put("goals", goal);
    set((state) => ({ goals: [...state.goals, goal] }));
    return goal;
  },
  update: async (id, partial) => {
    const existing = get().goals.find((g) => g.id === id);
    if (!existing) return;
    const updated = { ...existing, ...partial };
    await db.put("goals", updated);
    set((state) => ({ goals: state.goals.map((g) => (g.id === id ? updated : g)) }));
  },
  remove: async (id) => {
    await db.remove("goals", id);
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
  },
  toggleMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    const milestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    await get().update(goalId, { milestones, progress: progressFromMilestones(milestones) });
  },
  addMilestone: async (goalId, title) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    const milestones = [...goal.milestones, { id: createId(), title, done: false }];
    await get().update(goalId, { milestones, progress: progressFromMilestones(milestones) });
  },
}));
