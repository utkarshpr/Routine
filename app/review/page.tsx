"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { format, getISOWeek } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Label, TextAreaField } from "@/components/ui/Field";
import { addDays, dateKey, formatDurationLabel, parseDateKey, weekDates, weekKey, weekStart } from "@/lib/dates";
import { computeWeeklyStats } from "@/features/review/aggregate";
import { cardVariants, listStagger } from "@/lib/motion";
import { useTaskStore } from "@/stores/taskStore";
import { useRoutineStore } from "@/stores/routineStore";
import { useReviewStore } from "@/stores/reviewStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/stores/toastStore";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const [anchor, setAnchor] = useState(() => new Date());
  const initialWeek = searchParams.get("week");
  const weekStartsOn = useSettingsStore((s) => s.settings.weekStartsOn);
  const tasks = useTaskStore((s) => s.tasks); const ensureDate = useTaskStore((s) => s.ensureDate);
  const routines = useRoutineStore((s) => s.routines); const reviews = useReviewStore((s) => s.reviews); const upsert = useReviewStore((s) => s.upsert); const removeReview = useReviewStore((s) => s.remove);
  const days = weekDates(anchor, weekStartsOn); const key = weekKey(anchor); const currentWeekStart = weekStart(anchor, weekStartsOn); const currentWeekEnd = addDays(currentWeekStart, 6); const review = reviews.find((r) => r.id === key); const savedReviews = [...reviews].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  const [wentWell, setWentWell] = useState(""); const [needsImprovement, setNeedsImprovement] = useState(""); const [nextWeekFocus, setNextWeekFocus] = useState(""); const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  // URL-selected weeks are synchronized once the review data is available.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (initialWeek) { const target = reviews.find((item) => item.id === initialWeek); if (target) setAnchor(parseDateKey(target.weekStart)); } }, [initialWeek, reviews]);
  useEffect(() => { days.forEach((d) => ensureDate(dateKey(d), routines)); }, [days, ensureDate, routines]);
  // Reset the three draft fields when moving between review weeks.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setWentWell(review?.wentWell ?? ""); setNeedsImprovement(review?.needsImprovement ?? ""); setNextWeekFocus(review?.nextWeekFocus ?? ""); }, [key, review?.wentWell, review?.needsImprovement, review?.nextWeekFocus]);
  const stats = computeWeeklyStats(tasks, days); const statCards = [{ label: "Focus time", value: formatDurationLabel(stats.studyMinutes) }, { label: "Planned", value: formatDurationLabel(stats.plannedMinutes) }, { label: "Missed", value: String(stats.missedCount) }, { label: "Completion", value: `${stats.routineCompletionPct}%` }];
  async function save() { await upsert(key, dateKey(currentWeekStart), { wentWell, needsImprovement, nextWeekFocus }); toast("Review saved", "success"); }
  return <motion.main className="mx-auto max-w-6xl space-y-6 px-4 py-5 sm:px-6 md:px-8 md:py-7" initial="initial" animate="animate" variants={listStagger}>
    <motion.header variants={cardVariants} className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="cred-label text-muted">A short pause to learn</p><p className="mt-1 text-sm text-muted">Notice what moved. Decide what deserves the next seven days.</p></div><div className="flex items-center gap-1"><Button variant="ghost" size="sm" onClick={() => setAnchor((a) => addDays(a, -7))} aria-label="Previous week" type="button"><ChevronLeft className="h-4 w-4" /></Button><Button variant="secondary" size="sm" onClick={() => setAnchor(new Date())} type="button">This week</Button><Button variant="ghost" size="sm" onClick={() => setAnchor((a) => addDays(a, 7))} aria-label="Next week" type="button"><ChevronRight className="h-4 w-4" /></Button></div></motion.header>
    <motion.section variants={cardVariants} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-5"><div><p className="text-sm font-semibold">Week {getISOWeek(anchor)}</p><p className="mt-1 text-xs text-muted">{format(currentWeekStart, "MMM d")} – {format(currentWeekEnd, "MMM d, yyyy")}</p></div><p className="text-xs text-muted">{review ? `Saved ${format(new Date(review.updatedAt), "MMM d, yyyy")}` : "Not saved yet"}</p></motion.section>
    <motion.section variants={cardVariants} aria-label="Week signals" className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border sm:grid-cols-4 sm:divide-y-0 lg:grid-cols-7">{statCards.map((stat) => <div key={stat.label} className="px-3 py-3 first:pl-0"><p className="text-lg font-semibold tracking-tight">{stat.value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted">{stat.label}</p></div>)}</motion.section>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><motion.section variants={cardVariants}><Card className="p-4 sm:p-5"><div className="flex items-baseline justify-between"><div><h2 className="text-sm font-semibold">Write it down</h2><p className="mt-1 text-xs text-muted">Three prompts. No performance required.</p></div><Button size="sm" onClick={save} type="button">Save review</Button></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><div><Label htmlFor="went-well">What worked</Label><TextAreaField id="went-well" rows={6} value={wentWell} onChange={(e) => setWentWell(e.target.value)} /></div><div><Label htmlFor="needs-improvement">What to adjust</Label><TextAreaField id="needs-improvement" rows={6} value={needsImprovement} onChange={(e) => setNeedsImprovement(e.target.value)} /></div><div><Label htmlFor="next-focus">Next focus</Label><TextAreaField id="next-focus" rows={6} value={nextWeekFocus} onChange={(e) => setNextWeekFocus(e.target.value)} /></div></div></Card></motion.section>
      <motion.aside variants={cardVariants}><Card className="p-4"><h2 className="text-sm font-semibold">Past reviews</h2>{savedReviews.length === 0 ? <p className="mt-3 text-sm text-muted">Your saved reflections will collect here.</p> : <div className="mt-3 space-y-1">{savedReviews.map((item) => { const start = parseDateKey(item.weekStart); return <div key={item.id} className={`rounded-lg px-3 py-2.5 ${item.id === key ? "bg-accent/10" : "hover:bg-surface-2"}`}><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-semibold">{item.id}</p><p className="mt-0.5 text-[11px] text-muted">{format(start, "MMM d")} – {format(addDays(start, 6), "MMM d")}</p></div><div className="flex"><button type="button" onClick={() => setAnchor(start)} aria-label={`Open ${item.id}`} className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-surface-2"><Eye className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setDeleteTarget(item.id)} aria-label={`Delete ${item.id}`} className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-danger/10 hover:text-danger"><Trash2 className="h-3.5 w-3.5" /></button></div></div><p className="mt-2 line-clamp-2 text-xs text-muted">{item.wentWell || item.needsImprovement || item.nextWeekFocus || "Saved weekly review"}</p></div>; })}</div>}</Card></motion.aside></div>
    <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={async () => { if (deleteTarget) { await removeReview(deleteTarget); if (deleteTarget === key) { setWentWell(""); setNeedsImprovement(""); setNextWeekFocus(""); } setDeleteTarget(null); toast("Review deleted"); } }} title={`Delete review "${deleteTarget ?? ""}"?`} description="This saved weekly review will be removed." />
  </motion.main>;
}
