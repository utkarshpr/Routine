import { create } from "zustand";

interface UIState {
  commandPaletteOpen: boolean;
  commandPaletteMode: "search" | "add";
  commandPaletteAddDate: string | null;
  shortcutsHelpOpen: boolean;
  openCommandPalette: (mode: "search" | "add", date?: string) => void;
  closeCommandPalette: () => void;
  openShortcutsHelp: () => void;
  closeShortcutsHelp: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  commandPaletteMode: "search",
  commandPaletteAddDate: null,
  shortcutsHelpOpen: false,
  openCommandPalette: (mode, date) =>
    set({ commandPaletteOpen: true, commandPaletteMode: mode, commandPaletteAddDate: date ?? null }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  openShortcutsHelp: () => set({ shortcutsHelpOpen: true }),
  closeShortcutsHelp: () => set({ shortcutsHelpOpen: false }),
}));
