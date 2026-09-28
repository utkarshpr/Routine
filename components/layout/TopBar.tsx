"use client";

import { Command, Plus, Search, Sparkles } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUIStore } from "@/stores/uiStore";

export function TopBar() {
  const settings = useSettingsStore((state) => state.settings);
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-[-0.04em] md:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground"><Sparkles className="h-4 w-4" aria-hidden="true" /></span>
        <span className="max-w-24 truncate">{settings.userName || "Routine"}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={() => openCommandPalette("search")} className="hidden h-9 items-center gap-3 rounded-lg border border-border bg-surface px-3 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground lg:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search</span>
          <kbd className="ml-3 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">⌘ K</kbd>
        </button>
        <button type="button" onClick={() => openCommandPalette("search")} aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden">
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => openCommandPalette("add")} className="flex h-9 items-center gap-2 rounded-lg bg-accent px-3 text-sm font-semibold text-accent-foreground transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">New item</span>
        </button>
        <div className="ml-1 hidden items-center gap-2 border-l border-border pl-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold text-foreground">{(settings.userName.trim()[0] ?? "R").toUpperCase()}</div>
          <div className="hidden max-w-24 md:block">
            <p className="truncate text-xs font-semibold">{settings.userName || "Your space"}</p>
            <p className="mt-0.5 text-[10px] text-muted">local-first</p>
          </div>
          <Command className="hidden h-3.5 w-3.5 text-muted md:block" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
