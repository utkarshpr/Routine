"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock3,
  Flag,
  ListChecks,
  Sparkles,
  SunMedium,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useNow } from "@/hooks/useNow";
import { cardVariants, listStagger } from "@/lib/motion";

const PRIMARY_ACTIONS = [
  {
    icon: SunMedium,
    title: "Open today",
    body: "See what needs your attention right now.",
    href: "/today",
  },
  {
    icon: Calendar,
    title: "Plan the week",
    body: "Adjust blocks, drag tasks, and shape the week ahead.",
    href: "/schedule",
  },
  {
    icon: Target,
    title: "Start focus",
    body: "Enter a clean timer and work on one thing at a time.",
    href: "/focus",
  },
];

const SECONDARY_ACTIONS = [
  {
    icon: ListChecks,
    title: "Habits",
    body: "Track your daily consistency and streaks.",
    href: "/habits",
  },
  {
    icon: Flag,
    title: "Goals",
    body: "Keep longer-term milestones tied to daily work.",
    href: "/goals",
  },
  {
    icon: Sparkles,
    title: "Weekly review",
    body: "Reflect on progress and reset the next week.",
    href: "/review",
  },
];

export default function HomePage() {
  const router = useRouter();
  const now = useNow(1000);
  const dayLabel = format(now, "EEEE");
  const dateLabel = format(now, "MMMM d, yyyy");
  const timeLabel = format(now, "h:mm");
  const meridiem = format(now, "a");

  return (
    <motion.div
      className="mx-auto max-w-[1360px] px-4 py-8 md:px-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={listStagger}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <motion.section variants={cardVariants}>
          <Card className="overflow-hidden p-7 md:p-9">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[var(--shadow-card)]">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">Daily OS</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Calm planning for real work</p>
                </div>
              </div>

              <div className="max-w-3xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Home</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                  Build your day with
                  <span className="block">clarity, not clutter.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
                  Keep your schedule, focus sessions, habits, and weekly review in one place. The work should stay central,
                  and the interface should stay out of the way.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => router.push("/today")} type="button">
                  Go to today
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => router.push("/schedule")} type="button">
                  Open schedule
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>

        <motion.aside variants={cardVariants}>
          <Card className="h-full p-7 md:p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Clock</p>
                <p className="mt-3 text-5xl font-semibold tracking-[-0.06em] md:text-6xl">
                  {timeLabel}
                  <span className="ml-2 text-2xl text-muted md:text-3xl">{meridiem}</span>
                </p>
                <p className="mt-3 text-lg font-medium tracking-[-0.02em]">{dayLabel}</p>
                <p className="mt-1 text-sm text-muted">{dateLabel}</p>
              </div>

              <div className="mt-10 rounded-[22px] border border-border bg-surface-2 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock3 className="h-4 w-4 text-muted" aria-hidden="true" />
                  Ready when you are
                </div>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Start with planning, move into focus, and come back to review without bouncing across tools.
                </p>
              </div>
            </div>
          </Card>
        </motion.aside>
      </div>

      <motion.section variants={cardVariants} className="mt-5">
        <div className="grid gap-4 lg:grid-cols-3">
          {PRIMARY_ACTIONS.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer p-5 transition-transform hover:-translate-y-0.5"
              onClick={() => router.push(action.href)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-foreground">
                <action.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xl font-semibold tracking-[-0.03em]">{action.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{action.body}</p>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section variants={cardVariants} className="mt-5">
        <div className="grid gap-4 md:grid-cols-3">
          {SECONDARY_ACTIONS.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer p-5 transition-transform hover:-translate-y-0.5"
              onClick={() => router.push(action.href)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-foreground">
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-muted" aria-hidden="true" />
              </div>
              <p className="mt-5 text-lg font-semibold tracking-[-0.03em]">{action.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{action.body}</p>
            </Card>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
