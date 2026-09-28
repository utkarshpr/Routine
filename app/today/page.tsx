"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarClock, ChevronRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
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
import { dateKey, todayKey } from "@/lib/dates";
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

  useEffect(() => { ensureDate(today, routines); }, [today, routines, ensureDate]);
  const todayTasks = useMemo(() => selectTasksForDate(tasks, today), [tasks, today]);
  const dayStatus = useMemo(() => computeDayStatus(todayTasks, now), [todayTasks, now]);
  const conflicts = useMemo(() => findConflicts(todayTasks), [todayTasks]);
  const celebratedRef = useRef(false);
  useEffect(() => {
    if (dayStatus.totalCount > 0 && dayStatus.progressPct === 100 && !celebratedRef.current) {
      celebratedRef.current = true; celebrateBig();
    } else if (dayStatus.progressPct < 100) celebratedRef.current = false;
  }, [dayStatus.progressPct, dayStatus.totalCount]);

  const currentId = dayStatus.current?.id;
  const nextUp = todayTasks
    .filter((task) => task.status === "pending" && task.id !== currentId && !dayStatus.overdueIds.includes(task.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime)).slice(0, 4);
  const stats = useMemo(() => [
    { label: "Completed", value: `${dayStatus.completedCount}/${dayStatus.totalCount}` },
    { label: "Study / week", value: `${Math.round((weekStudyMinutes(tasks, now, weekStartsOn) / 60) * 10) / 10}h` },
    { label: "Focus today", value: `${focusMinutesOn(focusSessions, today)}m` },
    { label: "Best streak", value: `${habits.reduce((max, habit) => Math.max(max, currentStreak(habit.id, habitCompletions, now)), 0)}d` },
  ], [dayStatus.completedCount, dayStatus.totalCount, tasks, now, weekStartsOn, focusSessions, today, habits, habitCompletions]);

  async function handleResolveConflicts() {
    await autoResolveDay(today); toast("Schedule conflicts resolved", "success");
  }

  async function handleMoveOverdue() {
    const tomorrow = new Date(`${today}T12:00:00`);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await Promise.all(dayStatus.overdueIds.map((id) => useTaskStore.getState().moveTaskToDate(id, dateKey(tomorrow))));
    toast(`${dayStatus.overdueIds.length} overdue block${dayStatus.overdueIds.length === 1 ? "" : "s"} moved to tomorrow`, "success");
  }

  return (
    <motion.div className="mx-auto w-full max-w-[1440px] space-y-4 px-3 py-4 sm:px-4 md:space-y-5 md:px-8 md:py-7" initial="initial" animate="animate" variants={listStagger}>
      <motion.header variants={cardVariants} className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-end md:justify-between md:gap-5 md:pb-5">
        <div className="min-w-0">
          <p className="cred-label text-muted">Today / command center</p>
          <div className="mt-2"><Greeting /></div>
          <p className="mt-2 hidden max-w-xl text-sm text-muted sm:block">One clear view of what is happening, what is next, and what still needs your attention.</p>
        </div>
        <QuickActionsRow hasConflicts={conflicts.length > 0} onResolveConflicts={handleResolveConflicts} />
      </motion.header>

      <div className="grid gap-4 md:gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4 md:space-y-5">
          <CurrentTaskCard current={dayStatus.current} next={dayStatus.next} overdueCount={dayStatus.overdueIds.length} onMoveOverdue={handleMoveOverdue} dayProgressPct={dayStatus.progressPct} />
          <motion.section variants={cardVariants} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 md:px-5 md:py-4">
              <div className="flex items-center gap-3"><CalendarClock className="h-4 w-4 text-muted" aria-hidden="true" /><div><h2 className="text-sm font-semibold tracking-tight">Today&rsquo;s timeline</h2><p className="mt-0.5 text-xs text-muted">{todayTasks.length} blocks · updates automatically</p></div></div>
              <Link href="/schedule" className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-foreground">Edit schedule <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
            </div>
            <div className="px-2 py-1.5 md:px-4 md:py-2"><Timeline tasks={todayTasks} dayStatus={dayStatus} /></div>
          </motion.section>
        </div>

        <aside className="overflow-hidden rounded-[18px] border border-border bg-surface xl:sticky xl:top-5 xl:self-start">
          <motion.div variants={cardVariants} className="border-b border-border"><ProgressSection progressPct={dayStatus.progressPct} completedCount={dayStatus.completedCount} totalCount={dayStatus.totalCount} /></motion.div>
          <motion.div variants={cardVariants} className="border-b border-border"><StatsRow stats={stats} /></motion.div>
          <motion.div variants={cardVariants} className="border-b border-border"><NextUpList tasks={nextUp} /></motion.div>
          {conflicts.length > 0 && <motion.div variants={cardVariants} className="flex items-start gap-3 border-b border-danger/30 bg-danger/[0.06] px-4 py-3 text-sm"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" /><div><p className="font-medium">Schedule needs attention</p><p className="mt-1 text-xs text-muted">{conflicts.length} overlapping block{conflicts.length === 1 ? "" : "s"} detected.</p></div></motion.div>}
          <motion.div variants={cardVariants}><ExternalTools /></motion.div>
        </aside>
      </div>
    </motion.div>
  );
}
