"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Square, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { CATEGORY_META } from "@/lib/constants";
import { formatClock } from "@/features/focus/durations";
import { liveElapsedSeconds } from "@/stores/focusStore";
import { useNow } from "@/hooks/useNow";
import type { FocusSession } from "@/types";

export function FocusTimer({
  session,
  onPause,
  onResume,
  onComplete,
  onExit,
}: {
  session: FocusSession;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const now = useNow(1000);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const autoCompletedRef = useRef(false);

  const elapsed = liveElapsedSeconds(session, now.getTime());
  const remaining = session.plannedSeconds - elapsed;
  const isBreakOrTimed = session.plannedSeconds > 0;
  const progressPct = isBreakOrTimed ? Math.min(100, (elapsed / session.plannedSeconds) * 100) : 0;
  const isRunning = session.status === "running";

  useEffect(() => {
    if (isBreakOrTimed && remaining <= 0 && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      onComplete();
    }
  }, [remaining, isBreakOrTimed, onComplete]);

  const meta = CATEGORY_META[session.category];
  const displaySeconds = isBreakOrTimed ? Math.max(0, remaining) : elapsed;
  const progressValue = Math.max(0, Math.min(1, progressPct / 100));
  const ringSize = 240;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressValue * circumference;
  const minutesRemaining = Math.max(0, Math.ceil(displaySeconds / 60));

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-3 py-5 sm:px-6 sm:py-10">
      <BackgroundGlow />

      <Card className="relative z-10 w-full max-w-[560px] overflow-hidden bg-[#111212] p-5 text-center sm:p-8 md:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70"
          style={{
            background: `linear-gradient(180deg, ${meta.color}10, transparent)`,
          }}
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-4 text-left">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-muted"
              >
                <CategoryIcon category={session.category} className="h-4 w-4" style={{ color: meta.color }} />
                {session.category}
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.055em] sm:text-4xl">{session.title}</h1>
              <p className="mt-2 text-sm text-muted">
                {isRunning ? "Stay with this one thing." : "Paused. Resume when you're ready."}
              </p>
            </div>

            <div className="hidden rounded-2xl border border-border bg-surface-2 px-4 py-3 text-right md:block">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Remaining</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{minutesRemaining}m</p>
            </div>
          </div>

          <div className="relative mt-7 flex items-center justify-center sm:mt-10">
            <div className="relative">
              <svg width={ringSize} height={ringSize} className="-rotate-90">
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  className="text-surface-2"
                  fill="none"
                />
                <motion.circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  fill="none"
                  stroke={meta.color}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />
              </svg>

              {isRunning && (
                <motion.div
                  className="absolute left-1/2 top-1/2 h-3.5 w-3.5 rounded-full shadow-[0_0_0_6px_rgba(255,255,255,0.04)]"
                  style={{
                    backgroundColor: meta.color,
                    transformOrigin: `0 -${radius}px`,
                  }}
                  animate={{ rotate: progressValue * 360 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              )}
            </div>

            <div className="absolute flex flex-col items-center">
              <motion.p
                key={displaySeconds}
                initial={{ opacity: 0.82 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="cred-display text-6xl tabular-nums md:text-7xl"
              >
                {formatClock(displaySeconds)}
              </motion.p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted">
                {Math.round(progressPct)}% complete
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl border border-border bg-surface-2 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Mode</p>
              <p className="mt-2 text-lg font-semibold capitalize tracking-[-0.03em]">
                {session.mode.replace("-", " ")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Elapsed</p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">{formatClock(elapsed)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Status</p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                {isRunning ? "Running" : "Paused"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex w-full gap-3">
            {isRunning ? (
              <Button variant="secondary" className="flex-1" onClick={onPause} type="button">
                <Pause className="h-4 w-4" aria-hidden="true" />
                Pause
              </Button>
            ) : (
              <Button variant="secondary" className="flex-1" onClick={onResume} type="button">
                <Play className="h-4 w-4" aria-hidden="true" />
                Resume
              </Button>
            )}
            <Button className="flex-1" onClick={onComplete} type="button">
              <Square className="h-4 w-4" aria-hidden="true" />
              Complete
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setExitConfirmOpen(true)}
            className="mt-5 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Exit session
          </button>
        </div>
      </Card>

      <ConfirmDialog
        open={exitConfirmOpen}
        onClose={() => setExitConfirmOpen(false)}
        onConfirm={onExit}
        title="Exit this session?"
        description="Your progress won't be counted as complete."
        confirmLabel="Exit"
      />
    </div>
  );
}
