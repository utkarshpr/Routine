"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Square, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { BorderTrail } from "@/components/ui/effects/BorderTrail";
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

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 py-12">
      <BackgroundGlow />

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-border-strong bg-surface/90 p-8 text-center backdrop-blur-xl">
        {isRunning && <BorderTrail />}
        <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: meta.color }}>
          <CategoryIcon category={session.category} className="h-4 w-4" />
          {session.category}
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{session.title}</h1>

        <div className="relative mt-8 flex items-center justify-center">
          <motion.div
            animate={isRunning ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 3, repeat: isRunning ? Infinity : 0, ease: "easeInOut" }}
            className={isRunning ? "" : "opacity-60 grayscale"}
          >
            <ProgressRing value={progressPct} size={220} strokeWidth={8} label=" " />
          </motion.div>
          <motion.p
            key={displaySeconds}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="absolute text-5xl font-semibold tabular-nums tracking-tight"
          >
            {formatClock(displaySeconds)}
          </motion.p>
        </div>

        <div className="mt-8 flex w-full gap-2">
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
          className="mt-4 flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Exit
        </button>
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
