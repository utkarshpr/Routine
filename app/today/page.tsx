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
      className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={listStagger}
    >
      <Greeting />

      <motion.div variants={cardVariants}>
        <QuickActionsRow hasConflicts={conflicts.length > 0} onResolveConflicts={handleResolveConflicts} />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CurrentTaskCard current={dayStatus.current} next={dayStatus.next} />
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Today&rsquo;s Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline tasks={todayTasks} dayStatus={dayStatus} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
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
            <StatsRow stats={stats} />
          </motion.div>
        </div>
      </div>

      <motion.div variants={cardVariants}>
        <ExternalTools />
      </motion.div>
    </motion.div>
  );
}
