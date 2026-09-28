"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { applyTheme } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const appearance = useSettingsStore((s) => s.settings.appearance);

  useEffect(() => {
    applyTheme(appearance);
    if (appearance !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [appearance]);

  return <>{children}</>;
}
