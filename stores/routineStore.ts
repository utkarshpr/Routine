import { create } from "zustand";
import { db } from "@/lib/db";
import { createId } from "@/lib/id";
import type { Routine } from "@/types";

interface RoutineState {
  routines: Routine[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  seed: (routines: Routine[]) => Promise<void>;
  add: (routine: Omit<Routine, "id" | "createdAt" | "updatedAt" | "order">) => Promise<Routine>;
  update: (id: string, partial: Partial<Routine>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<void>;
  togglePause: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
  routines: [],
  hydrated: false,
  hydrate: async () => {
    const routines = await db.getAll("routines");
    set({ routines: routines.sort((a, b) => a.order - b.order), hydrated: true });
  },
  seed: async (routines) => {
    await Promise.all(routines.map((r) => db.put("routines", r)));
    set((state) => ({ routines: [...state.routines, ...routines].sort((a, b) => a.order - b.order) }));
  },
  add: async (partial) => {
    const now = new Date().toISOString();
    const routine: Routine = {
      ...partial,
      id: createId(),
      order: get().routines.length,
      createdAt: now,
      updatedAt: now,
    };
    await db.put("routines", routine);
    set((state) => ({ routines: [...state.routines, routine] }));
    return routine;
  },
  update: async (id, partial) => {
    const existing = get().routines.find((r) => r.id === id);
    if (!existing) return;
    const updated = { ...existing, ...partial, updatedAt: new Date().toISOString() };
    await db.put("routines", updated);
    set((state) => ({ routines: state.routines.map((r) => (r.id === id ? updated : r)) }));
  },
  remove: async (id) => {
    await db.remove("routines", id);
    set((state) => ({ routines: state.routines.filter((r) => r.id !== id) }));
  },
  duplicate: async (id) => {
    const existing = get().routines.find((r) => r.id === id);
    if (!existing) return;
    const now = new Date().toISOString();
    const copy: Routine = {
      ...existing,
      id: createId(),
      title: `${existing.title} copy`,
      order: get().routines.length,
      createdAt: now,
      updatedAt: now,
    };
    await db.put("routines", copy);
    set((state) => ({ routines: [...state.routines, copy] }));
  },
  togglePause: async (id) => {
    const existing = get().routines.find((r) => r.id === id);
    if (!existing) return;
    await get().update(id, { paused: !existing.paused });
  },
  reorder: async (orderedIds) => {
    const byId = new Map(get().routines.map((r) => [r.id, r]));
    const updated: Routine[] = orderedIds
      .map((id, index) => {
        const routine = byId.get(id);
        return routine ? { ...routine, order: index } : null;
      })
      .filter((r): r is Routine => r !== null);
    await Promise.all(updated.map((r) => db.put("routines", r)));
    const updatedById = new Map(updated.map((r) => [r.id, r]));
    set((state) => ({ routines: state.routines.map((r) => updatedById.get(r.id) ?? r) }));
  },
}));
