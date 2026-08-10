import type { FocusMode } from "@/types";

export const FIXED_MODE_SECONDS: Partial<Record<FocusMode, number>> = {
  pomodoro: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

export const FOCUS_MODE_LABELS: Record<FocusMode, string> = {
  pomodoro: "Pomodoro",
  custom: "Custom",
  "short-break": "Short break",
  "long-break": "Long break",
};

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
