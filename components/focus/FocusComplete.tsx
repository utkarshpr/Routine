"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { copy } from "@/lib/copy";
import { formatClock } from "@/features/focus/durations";
import type { FocusSession } from "@/types";

const BURST_ANGLES = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);

export function FocusComplete({ session, onDone }: { session: FocusSession; onDone: () => void }) {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <BackgroundGlow />

      <Card className="relative z-10 w-full max-w-md border-border-strong bg-surface/90 p-6 text-center backdrop-blur-xl sm:p-8">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          {BURST_ANGLES.map((angle) => (
            <motion.span
              key={angle}
              className="absolute h-1.5 w-1.5 rounded-full bg-success"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 46,
                y: Math.sin((angle * Math.PI) / 180) * 46,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success shadow-[var(--shadow-pop)]"
          >
            <Check className="h-8 w-8" aria-hidden="true" />
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {copy.focusComplete}
        </motion.h1>
        <p className="mt-1 text-sm text-muted">
          {session.title} · {formatClock(session.elapsedSeconds)}
        </p>
        <Button size="lg" className="mt-8 w-full" onClick={onDone} type="button">
          Done
        </Button>
      </Card>
    </div>
  );
}
