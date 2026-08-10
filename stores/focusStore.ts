import { create } from "zustand";
import { db } from "@/lib/db";
import { createId } from "@/lib/id";
import type { Category, FocusMode, FocusSession } from "@/types";

interface StartParams {
  taskId: string | null;
  title: string;
  category: Category;
  mode: FocusMode;
  plannedSeconds: number;
}

interface FocusState {
  sessions: FocusSession[];
  activeSessionId: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  start: (params: StartParams) => Promise<FocusSession>;
  pause: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
  reset: (id: string) => Promise<void>;
  complete: (id: string) => Promise<void>;
  abandon: (id: string) => Promise<void>;
}

function finalizeElapsed(session: FocusSession): number {
  if (session.status !== "running" || !session.lastResumedAt) return session.elapsedSeconds;
  const delta = (Date.now() - new Date(session.lastResumedAt).getTime()) / 1000;
  return session.elapsedSeconds + Math.max(0, delta);
}

export const useFocusStore = create<FocusState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  hydrated: false,
  hydrate: async () => {
    const sessions = await db.getAll("focusSessions");
    const active = sessions.find((s) => s.status === "running" || s.status === "paused");
    set({ sessions, activeSessionId: active?.id ?? null, hydrated: true });
  },
  start: async (params) => {
    const now = new Date().toISOString();
    const session: FocusSession = {
      id: createId(),
      taskId: params.taskId,
      title: params.title,
      category: params.category,
      mode: params.mode,
      plannedSeconds: params.plannedSeconds,
      elapsedSeconds: 0,
      startedAt: now,
      lastResumedAt: now,
      completedAt: null,
      status: "running",
    };
    await db.put("focusSessions", session);
    set((state) => ({ sessions: [...state.sessions, session], activeSessionId: session.id }));
    return session;
  },
  pause: async (id) => {
    const session = get().sessions.find((s) => s.id === id);
    if (!session) return;
    const updated: FocusSession = {
      ...session,
      elapsedSeconds: finalizeElapsed(session),
      lastResumedAt: null,
      status: "paused",
    };
    await db.put("focusSessions", updated);
    set((state) => ({ sessions: state.sessions.map((s) => (s.id === id ? updated : s)) }));
  },
  resume: async (id) => {
    const session = get().sessions.find((s) => s.id === id);
    if (!session) return;
    const updated: FocusSession = { ...session, status: "running", lastResumedAt: new Date().toISOString() };
    await db.put("focusSessions", updated);
    set((state) => ({ sessions: state.sessions.map((s) => (s.id === id ? updated : s)), activeSessionId: id }));
  },
  reset: async (id) => {
    const session = get().sessions.find((s) => s.id === id);
    if (!session) return;
    const updated: FocusSession = {
      ...session,
      elapsedSeconds: 0,
      lastResumedAt: session.status === "running" ? new Date().toISOString() : null,
    };
    await db.put("focusSessions", updated);
    set((state) => ({ sessions: state.sessions.map((s) => (s.id === id ? updated : s)) }));
  },
  complete: async (id) => {
    const session = get().sessions.find((s) => s.id === id);
    if (!session) return;
    const updated: FocusSession = {
      ...session,
      elapsedSeconds: finalizeElapsed(session),
      lastResumedAt: null,
      status: "completed",
      completedAt: new Date().toISOString(),
    };
    await db.put("focusSessions", updated);
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    }));
  },
  abandon: async (id) => {
    const session = get().sessions.find((s) => s.id === id);
    if (!session) return;
    const updated: FocusSession = {
      ...session,
      elapsedSeconds: finalizeElapsed(session),
      lastResumedAt: null,
      status: "abandoned",
    };
    await db.put("focusSessions", updated);
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    }));
  },
}));

export function liveElapsedSeconds(session: FocusSession, nowMs: number): number {
  if (session.status !== "running" || !session.lastResumedAt) return session.elapsedSeconds;
  const delta = (nowMs - new Date(session.lastResumedAt).getTime()) / 1000;
  return session.elapsedSeconds + Math.max(0, delta);
}
