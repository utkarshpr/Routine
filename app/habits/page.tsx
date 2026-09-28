"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { useHabitStore } from "@/stores/habitStore";
import { toast } from "@/stores/toastStore";
import { copy } from "@/lib/copy";
import { cardVariants, listStagger } from "@/lib/motion";
import type { Habit } from "@/types";

export default function HabitsPage() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const remove = useHabitStore((s) => s.remove);
  const clearAll = useHabitStore((s) => s.clearAll);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = habits.filter((h) => completions.some((c) => c.habitId === h.id && c.date === today && c.completed)).length;

  return (
    <motion.main className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6 md:px-8 md:py-7" initial="initial" animate="animate" variants={listStagger}>
      <motion.header variants={cardVariants} className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="cred-label text-muted">Consistency, made visible</p><p className="mt-1 max-w-md text-sm text-muted">Small actions, repeated often enough to become part of you.</p></div>
        <div className="flex gap-2">{habits.length > 0 && <Button variant="ghost" size="sm" onClick={() => setClearAllOpen(true)} type="button"><Trash2 className="h-4 w-4" aria-hidden="true" />Clear all</Button>}<Button size="sm" onClick={() => { setEditing(undefined); setFormOpen(true); }} type="button"><Plus className="h-4 w-4" aria-hidden="true" />New habit</Button></div>
      </motion.header>
      <motion.section variants={cardVariants} aria-label="Habit summary" className="grid grid-cols-3 divide-x divide-border border-b border-border pb-5">
        <div className="pr-3"><p className="text-2xl font-semibold tracking-tight">{habits.length}</p><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Active habits</p></div>
        <div className="px-3"><p className="text-2xl font-semibold tracking-tight text-accent">{completedToday}</p><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Done today</p></div>
        <div className="pl-3"><p className="flex items-center gap-1 text-2xl font-semibold tracking-tight"><Check className="h-5 w-5 text-success" aria-hidden="true" />{habits.length ? Math.round((completedToday / habits.length) * 100) : 0}%</p><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Daily signal</p></div>
      </motion.section>
      {habits.length === 0 ? <EmptyState title={copy.emptyHabits} /> : <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px] md:items-start"><motion.section variants={cardVariants} aria-labelledby="rhythm-heading"><div className="mb-3 flex items-center justify-between"><h2 id="rhythm-heading" className="text-sm font-semibold">Your rhythm</h2><span className="text-xs text-muted">{habits.length} {habits.length === 1 ? "habit" : "habits"}</span></div><div className="space-y-2"><AnimatePresence mode="popLayout">{habits.map((habit) => <HabitCard key={habit.id} habit={habit} onEdit={() => { setEditing(habit); setFormOpen(true); }} onDelete={() => setDeleteTarget(habit)} />)}</AnimatePresence></div></motion.section><motion.aside variants={cardVariants} className="border-l border-border pl-0 md:pl-5"><p className="cred-label text-muted">A useful rule</p><p className="mt-3 text-lg font-medium leading-7 tracking-tight">Make the next repetition easier than the last.</p><p className="mt-3 text-sm leading-6 text-muted">Set a cadence you can keep on an ordinary day. Your streak is a signal, not a score.</p></motion.aside></div>}
      <HabitFormModal open={formOpen} onClose={() => setFormOpen(false)} habit={editing} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.id); toast("Habit deleted"); setDeleteTarget(null); } }} title={`Delete "${deleteTarget?.title}"?`} description="Its history will be removed too." />
      <ConfirmDialog open={clearAllOpen} onClose={() => setClearAllOpen(false)} onConfirm={() => { clearAll(); setClearAllOpen(false); toast("All habits cleared"); }} title="Delete all habits?" description="This will remove every habit and saved completion history." />
    </motion.main>
  );
}
