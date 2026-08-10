"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

interface ShortcutHandlers {
  onNewTask: () => void;
  onOpenPalette: () => void;
  onShowHelp: () => void;
}

const ROUTES: Record<string, string> = {
  t: "/",
  w: "/schedule",
  f: "/focus",
  h: "/habits",
  g: "/goals",
};

export function useKeyboardShortcuts({ onNewTask, onOpenPalette, onShowHelp }: ShortcutHandlers) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        onOpenPalette();
        return;
      }

      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === "n") {
        e.preventDefault();
        onNewTask();
      } else if (key === "?") {
        e.preventDefault();
        onShowHelp();
      } else if (ROUTES[key]) {
        e.preventDefault();
        router.push(ROUTES[key]);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, onNewTask, onOpenPalette, onShowHelp]);
}
