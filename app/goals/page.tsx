"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalFormModal } from "@/components/goals/GoalFormModal";
import { useGoalStore } from "@/stores/goalStore";
import { toast } from "@/stores/toastStore";
import { copy } from "@/lib/copy";
import { cardVariants, listStagger } from "@/lib/motion";
import type { Goal } from "@/types";

export default function GoalsPage() {
  const goals = useGoalStore((s) => s.goals);
  const remove = useGoalStore((s) => s.remove);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);
  const average = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0;
  return (
    <motion.main className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6 md:px-8 md:py-7" initial="initial" animate="animate" variants={listStagger}>
      <motion.header variants={cardVariants} className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="cred-label text-muted">Direction, made actionable</p><p className="mt-1 max-w-md text-sm text-muted">Keep the horizon visible. Let the next milestone stay close.</p></div><Button size="sm" onClick={() => { setEditing(undefined); setFormOpen(true); }} type="button"><Plus className="h-4 w-4" aria-hidden="true" />New goal</Button></motion.header>
      <motion.section variants={cardVariants} className="grid grid-cols-2 divide-x divide-border border-b border-border pb-5 sm:grid-cols-3"><div className="pr-3"><p className="text-2xl font-semibold">{goals.length}</p><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">In motion</p></div><div className="px-3"><p className="text-2xl font-semibold text-accent">{average}%</p><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Average progress</p></div><div className="hidden pl-3 sm:block"><p className="flex items-center gap-1 text-2xl font-semibold"><ArrowUpRight className="h-5 w-5 text-success" aria-hidden="true" />{goals.filter((g) => g.progress >= 100).length}</p><p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Complete</p></div></motion.section>
      {goals.length === 0 ? <EmptyState title={copy.emptyGoals} /> : <motion.section variants={cardVariants} aria-labelledby="goals-heading"><div className="mb-3 flex items-center justify-between"><h2 id="goals-heading" className="text-sm font-semibold">Active directions</h2><span className="text-xs text-muted">{goals.length} {goals.length === 1 ? "goal" : "goals"}</span></div><div className="grid gap-3 lg:grid-cols-2"><AnimatePresence mode="popLayout">{goals.map((goal) => <motion.div key={goal.id} variants={cardVariants} layout><GoalCard goal={goal} onEdit={() => { setEditing(goal); setFormOpen(true); }} onDelete={() => setDeleteTarget(goal)} /></motion.div>)}</AnimatePresence></div></motion.section>}
      <GoalFormModal open={formOpen} onClose={() => setFormOpen(false)} goal={editing} />
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) { remove(deleteTarget.id); toast("Goal deleted"); setDeleteTarget(null); } }} title={`Delete "${deleteTarget?.title}"?`} description="This will remove the goal and its milestones." />
    </motion.main>
  );
}
