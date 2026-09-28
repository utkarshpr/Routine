"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label, SelectField } from "@/components/ui/Field";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { CATEGORY_META } from "@/lib/constants";
import { FOCUS_MODE_LABELS } from "@/features/focus/durations";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { CATEGORIES, type Category, type FocusMode, type Task } from "@/types";

const MODES: FocusMode[] = ["pomodoro", "custom", "short-break", "long-break"];

export function FocusSetup({
  task,
  defaultFocusMinutes,
  defaultBreakMinutes,
  onStart,
}: {
  task: Task | null;
  defaultFocusMinutes: number;
  defaultBreakMinutes: number;
  onStart: (params: { title: string; category: Category; mode: FocusMode; plannedSeconds: number }) => void;
}) {
  const [mode, setMode] = useState<FocusMode>("pomodoro");
  const [customMinutes, setCustomMinutes] = useState(defaultFocusMinutes);
  const [category, setCategory] = useState<Category>(task?.category ?? "Other");

  const title = task?.title ?? "Focus Session";
  const durationMinutes =
    mode === "pomodoro" ? 25 : mode === "short-break" ? defaultBreakMinutes : mode === "long-break" ? 15 : customMinutes;
  const meta = CATEGORY_META[category];

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-start justify-center overflow-hidden px-4 py-5 sm:items-center sm:px-6 sm:py-10">
      <BackgroundGlow />

      <Card className="relative z-10 w-full max-w-2xl border-border-strong bg-[#111212] p-5 backdrop-blur-xl sm:p-7">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)] sm:items-center sm:gap-8">
        <div className="text-center sm:text-left">
        <motion.div
          key={category}
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl shadow-[var(--shadow-pop)] sm:mx-0"
          style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
        >
          <CategoryIcon category={category} className="h-6 w-6" />
        </motion.div>
        <p className="cred-label mt-4 text-muted">Focus mode</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.055em] sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{copy.focusStart}</p>

        {!task && (
          <div className="mt-5 text-left">
            <Label htmlFor="focus-category">Category</Label>
            <SelectField id="focus-category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
          </div>
        )}

        </div>

        <div className="sm:border-l sm:border-border sm:pl-7">
        <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-black/20 p-1.5">
          {MODES.map((m) => (
            <motion.button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:text-sm",
                mode === m ? "bg-accent text-accent-foreground shadow-[var(--shadow-card)]" : "text-foreground hover:bg-border/40"
              )}
            >
              {FOCUS_MODE_LABELS[m]}
            </motion.button>
          ))}
        </div>

        {mode === "custom" && (
          <div className="mt-3 text-left">
            <Label htmlFor="focus-duration">Duration (minutes)</Label>
            <SelectField
              id="focus-duration"
              value={String(customMinutes)}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
            >
              {[10, 15, 20, 25, 30, 45, 60, 90].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </SelectField>
          </div>
        )}

        <Button
          size="lg"
          className="mt-5 w-full"
          onClick={() => onStart({ title, category, mode, plannedSeconds: durationMinutes * 60 })}
          type="button"
        >
          Start Session
        </Button>
        </div>
        </div>
      </Card>
    </div>
  );
}
