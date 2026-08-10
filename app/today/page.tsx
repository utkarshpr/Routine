"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Greeting } from "@/components/dashboard/Greeting";
import { CurrentTaskCard } from "@/components/dashboard/CurrentTaskCard";
import { NextUpList } from "@/components/dashboard/NextUpList";
import { ProgressSection } from "@/components/dashboard/ProgressSection";
import { QuickActionsRow } from "@/components/dashboard/QuickActionsRow";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ExternalTools } from "@/components/dashboard/ExternalTools";
import { Timeline } from "@/components/timeline/Timeline";
import { useNow } from "@/hooks/useNow";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore, selectTasksForDate } from "@/stores/taskStore";
import { useHabitStore } from "@/stores/habitStore";
import { useFocusStore } from "@/stores/focusStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { computeDayStatus, findConflicts } from "@/lib/scheduler";
import { focusMinutesOn, weekStudyMinutes } from "@/lib/analytics";
import { currentStreak } from "@/features/habits/streaks";
import { todayKey } from "@/lib/dates";
import { toast } from "@/stores/toastStore";
import { cardVariants, listStagger } from "@/lib/motion";
import { celebrateBig } from "@/lib/confetti";

export default function TodayPage() {
  const now = useNow(30_000);
  const today = todayKey();

  const routines = useRoutineStore((s) => s.routines);
  const tasks = useTaskStore((s) => s.tasks);
  const ensureDate = useTaskStore((s) => s.ensureDate);
  const autoResolveDay = useTaskStore((s) => s.autoResolveDay);
  const habits = useHabitStore((s) => s.habits);
  const habitCompletions = useHabitStore((s) => s.completions);
  const focusSessions = useFocusStore((s) => s.sessions);
  const weekStartsOn = useSettingsStore((s) => s.settings.weekStartsOn);

  useEffect(() => {
    ensureDate(today, routines);
  }, [today, routines, ensureDate]);

  const todayTasks = useMemo(() => selectTasksForDate(tasks, today), [tasks, today]);
  const dayStatus = useMemo(() => computeDayStatus(todayTasks, now), [todayTasks, now]);
  const conflicts = useMemo(() => findConflicts(todayTasks), [todayTasks]);

  const celebratedRef = useRef(false);
  useEffect(() => {
    if (dayStatus.totalCount > 0 && dayStatus.progressPct === 100 && !celebratedRef.current) {
      celebratedRef.current = true;
      celebrateBig();
    } else if (dayStatus.progressPct < 100) {
      celebratedRef.current = false;
    }
  }, [dayStatus.progressPct, dayStatus.totalCount]);

  const currentId = dayStatus.current?.id;
  const nextUp = todayTasks
    .filter((t) => t.status === "pending" && t.id !== currentId && !dayStatus.overdueIds.includes(t.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const stats = useMemo(
    () => [
      { label: "Today", value: `${dayStatus.progressPct}%` },
      { label: "Study this week", value: `${Math.round((weekStudyMinutes(tasks, now, weekStartsOn) / 60) * 10) / 10}h` },
      { label: "Focus today", value: `${focusMinutesOn(focusSessions, today)} min` },
      {
        label: "Best streak",
        value: `${habits.reduce((max, h) => Math.max(max, currentStreak(h.id, habitCompletions, now)), 0)}d`,
      },
    ],
    [dayStatus.progressPct, tasks, now, weekStartsOn, focusSessions, today, habits, habitCompletions]
  );

  async function handleResolveConflicts() {
    await autoResolveDay(today);
    toast("Schedule conflicts resolved", "success");
  }

  return (
    <motion.div
      className="mx-auto max-w-[1480px] space-y-8 px-4 py-6 md:px-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={listStagger}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-6">
          <motion.section
            variants={cardVariants}
            className="overflow-hidden rounded-[36px] border border-border bg-surface px-6 py-6 shadow-[var(--shadow-card)] md:px-8 md:py-8"
          >
            <div className="flex flex-col gap-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                <div className="space-y-6">
                  <div className="max-w-3xl space-y-5">
                    <Greeting />
                    <p className="max-w-2xl text-base leading-8 text-muted md:text-[17px]">
                      A quieter, more focused view of your day. Track what matters, move with intention, and keep the schedule feeling calm.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-foreground/70" aria-hidden="true" />
                      {todayTasks.length} blocks today
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5">
                      {dayStatus.completedCount} completed
                    </span>
                    {dayStatus.current && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5">
                        Live now: {dayStatus.current.title}
                      </span>
                    )}
                  </div>
                </div>

                <motion.div variants={cardVariants} className="lg:justify-self-end">
                  <div className="rounded-[28px] border border-border bg-elevated p-3">
                    <QuickActionsRow hasConflicts={conflicts.length > 0} onResolveConflicts={handleResolveConflicts} />
                  </div>
                </motion.div>
              </div>

              <StatsRow stats={stats} className="md:grid-cols-4" />
            </div>
          </motion.section>

          <CurrentTaskCard current={dayStatus.current} next={dayStatus.next} />

          <motion.div variants={cardVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Agenda</p>
                  <CardTitle className="mt-2 text-2xl tracking-[-0.04em]">Today&rsquo;s Timeline</CardTitle>
                </div>
                <p className="text-sm text-muted">{todayTasks.length} scheduled blocks</p>
              </CardHeader>
              <CardContent>
                <Timeline tasks={todayTasks} dayStatus={dayStatus} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <motion.div variants={cardVariants}>
            <ProgressSection
              progressPct={dayStatus.progressPct}
              completedCount={dayStatus.completedCount}
              totalCount={dayStatus.totalCount}
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <NextUpList tasks={nextUp} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <ExternalTools />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
