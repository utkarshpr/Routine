import { create } from "zustand";
import { db } from "@/lib/db";
import type { Settings } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  id: "settings",
  userName: "",
  hasOnboarded: false,
  appearance: "system",
  accentColor: "#2563eb",
  startOfDay: "06:00",
  defaultWorkStart: "10:00",
  defaultWorkEnd: "18:00",
  defaultFocusDurationMin: 25,
  defaultBreakDurationMin: 5,
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  notificationsEnabled: true,
  soundEnabled: true,
  weekStartsOn: 1,
};

interface SettingsState {
  settings: Settings;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  update: (partial: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,
  hydrate: async () => {
    const all = await db.getAll("settings");
    const existing = all[0];
    if (existing) {
      set({ settings: existing, hydrated: true });
    } else {
      await db.put("settings", DEFAULT_SETTINGS);
      set({ settings: DEFAULT_SETTINGS, hydrated: true });
    }
  },
  update: async (partial) => {
    let next: Settings = get().settings;
    set((state) => {
      next = { ...state.settings, ...partial };
      return { settings: next };
    });
    await db.put("settings", next);
  },
}));
