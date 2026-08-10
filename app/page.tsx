"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Flag, ListChecks, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimatedGradientText } from "@/components/ui/effects/AnimatedGradientText";
import { copy } from "@/lib/copy";
import { cardVariants, listStagger } from "@/lib/motion";

const FEATURES = [
  { icon: Calendar, title: "Weekly schedule", body: "Drag tasks across days and auto-resolve time conflicts." },
  { icon: Target, title: "Focus sessions", body: "Timed deep-work blocks that track your minutes." },
  { icon: ListChecks, title: "Habits", body: "Daily habits with streaks that keep you honest." },
  { icon: Flag, title: "Goals", body: "Longer-term goals tied back to your daily routine." },
];

export default function HomePage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-[-4rem] h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, -20, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[var(--shadow-pop)]"
        >
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </motion.div>

        <h1 className="relative z-10 mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
          <AnimatedGradientText>{copy.tagline}</AnimatedGradientText>
        </h1>
        <p className="relative z-10 mx-auto mt-3 max-w-md text-base text-muted">{copy.subtitle}</p>

        <Button size="lg" className="relative z-10 mt-8" onClick={() => router.push("/today")} type="button">
          Go to Today
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <motion.div
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        initial="initial"
        animate="animate"
        variants={listStagger}
      >
        {FEATURES.map((f) => (
          <motion.div key={f.title} variants={cardVariants}>
            <Card className="flex items-start gap-3 p-4 text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <f.icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="mt-0.5 text-sm text-muted">{f.body}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
