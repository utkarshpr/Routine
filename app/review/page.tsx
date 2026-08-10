"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { format, getISOWeek } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Label, TextAreaField } from "@/components/ui/Field";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { addDays, dateKey, formatDurationLabel, parseDateKey, weekDates, weekKey, weekStart } from "@/lib/dates";
import { computeWeeklyStats } from "@/features/review/aggregate";
import { cardVariants, listStagger } from "@/lib/motion";
import { useTaskStore } from "@/stores/taskStore";
import { useRoutineStore } from "@/stores/routineStore";
import { useReviewStore } from "@/stores/reviewStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/stores/toastStore";

export default function ReviewPage() {
  const [anchor, setAnchor] = useState(() => new Date());
  const weekStartsOn = useSettingsStore((s) => s.settings.weekStartsOn);
  const tasks = useTaskStore((s) => s.tasks);
  const ensureDate = useTaskStore((s) => s.ensureDate);
  const routines = useRoutineStore((s) => s.routines);
  const reviews = useReviewStore((s) => s.reviews);
  const upsert = useReviewStore((s) => s.upsert);
  const removeReview = useReviewStore((s) => s.remove);

  const days = weekDates(anchor, weekStartsOn);
  const key = weekKey(anchor);
  const review = reviews.find((r) => r.id === key);
  const currentWeekStart = weekStart(anchor, weekStartsOn);
  const currentWeekEnd = addDays(currentWeekStart, 6);
  const savedReviews = [...reviews].sort((a, b) => b.weekStart.localeCompare(a.weekStart));

  useEffect(() => {
    days.forEach((d) => ensureDate(dateKey(d), routines));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey(days[0]), routines]);

  const stats = computeWeeklyStats(tasks, days);

  const [wentWell, setWentWell] = useState(review?.wentWell ?? "");
  const [needsImprovement, setNeedsImprovement] = useState(review?.needsImprovement ?? "");
  const [nextWeekFocus, setNextWeekFocus] = useState(review?.nextWeekFocus ?? "");
  const [lastKey, setLastKey] = useState(key);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (key !== lastKey) {
    setLastKey(key);
    setWentWell(review?.wentWell ?? "");
    setNeedsImprovement(review?.needsImprovement ?? "");
    setNextWeekFocus(review?.nextWeekFocus ?? "");
  }

  async function saveField(field: "wentWell" | "needsImprovement" | "nextWeekFocus", value: string) {
    await upsert(key, dateKey(weekStart(anchor, weekStartsOn)), { [field]: value });
  }

  const statCards = [
    { label: "Study time", value: formatDurationLabel(stats.studyMinutes) },
    { label: "DSA sessions", value: String(stats.dsaSessions) },
    { label: "HLD sessions", value: String(stats.hldSessions) },
    { label: "LLD sessions", value: String(stats.lldSessions) },
    { label: "Golang", value: formatDurationLabel(stats.golangMinutes) },
    { label: "Gym", value: `${stats.gymCompleted}/${stats.gymTotal}` },
    { label: "Routine completion", value: `${stats.routineCompletionPct}%` },
  ];

  return (
    <motion.div
      className="mx-auto max-w-5xl space-y-5 px-4 py-6 md:px-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={listStagger}
    >
      <motion.div variants={cardVariants} className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.h1
            key={key}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-semibold tracking-tight"
          >
            Week {getISOWeek(anchor)}
          </motion.h1>
        </AnimatePresence>
        <div className="flex gap-1">
          <Button variant="secondary" size="sm" onClick={() => setAnchor((a) => addDays(a, -7))} aria-label="Previous week" type="button">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setAnchor(new Date())} type="button">
            This week
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setAnchor((a) => addDays(a, 7))} aria-label="Next week" type="button">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="space-y-3 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Where It Saves</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                Week {getISOWeek(anchor)} · {format(currentWeekStart, "MMM d")} - {format(currentWeekEnd, "MMM d, yyyy")}
              </p>
              <p className="text-sm text-muted">
                {review
                  ? `Saved locally for this week on ${format(new Date(review.updatedAt), "MMM d, yyyy 'at' h:mm a")}.`
                  : "This week's review will appear here after you save it."}
              </p>
            </div>
            <span className="rounded-full border border-white/45 bg-white/55 px-3 py-1 text-sm font-medium text-muted dark:border-white/10 dark:bg-white/6">
              {key}
            </span>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <StatsRow stats={statCards} className="md:grid-cols-4" />
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <motion.div variants={cardVariants}>
          <Card className="space-y-4 p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="went-well">What went well?</Label>
                <TextAreaField
                  id="went-well"
                  rows={5}
                  value={wentWell}
                  onChange={(e) => setWentWell(e.target.value)}
                  onBlur={() => saveField("wentWell", wentWell)}
                />
              </div>
              <div>
                <Label htmlFor="needs-improvement">What needs improvement?</Label>
                <TextAreaField
                  id="needs-improvement"
                  rows={5}
                  value={needsImprovement}
                  onChange={(e) => setNeedsImprovement(e.target.value)}
                  onBlur={() => saveField("needsImprovement", needsImprovement)}
                />
              </div>
              <div>
                <Label htmlFor="next-focus">Next week&rsquo;s focus</Label>
                <TextAreaField
                  id="next-focus"
                  rows={5}
                  value={nextWeekFocus}
                  onChange={(e) => setNextWeekFocus(e.target.value)}
                  onBlur={() => saveField("nextWeekFocus", nextWeekFocus)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                type="button"
                onClick={async () => {
                  await Promise.all([
                    saveField("wentWell", wentWell),
                    saveField("needsImprovement", needsImprovement),
                    saveField("nextWeekFocus", nextWeekFocus),
                  ]);
                  toast("Review saved", "success");
                }}
              >
                Save review
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Saved Weeks</p>
            {savedReviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No weekly reviews saved yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {savedReviews.map((item) => {
                  const start = parseDateKey(item.weekStart);
                  const isActive = item.id === key;
                  return (
                    <div
                      key={item.id}
                      className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                        isActive
                          ? "border-accent bg-accent/10"
                          : "border-border bg-surface-2 hover:border-border-strong"
                      }`}
                    >
                      <p className="text-sm font-semibold tracking-tight">{item.id}</p>
                      <p className="mt-1 text-xs text-muted">
                        {format(start, "MMM d")} - {format(addDays(start, 6), "MMM d, yyyy")}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
                        {item.wentWell || item.needsImprovement || item.nextWeekFocus || "Saved weekly review"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Updated {format(new Date(item.updatedAt), "MMM d, yyyy")}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="secondary" size="sm" type="button" onClick={() => setAnchor(start)}>
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          Open
                        </Button>
                        <Button variant="ghost" size="sm" type="button" onClick={() => setDeleteTarget(item.id)}>
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await removeReview(deleteTarget);
          if (deleteTarget === key) {
            setWentWell("");
            setNeedsImprovement("");
            setNextWeekFocus("");
          }
          toast("Review deleted");
        }}
        title={`Delete review "${deleteTarget ?? ""}"?`}
        description="This saved weekly review will be removed from local storage."
      />
    </motion.div>
  );
}
