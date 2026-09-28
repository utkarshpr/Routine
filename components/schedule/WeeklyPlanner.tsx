"use client";

import { useEffect, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Plus } from "lucide-react";
import { addDays, dateKey, visibleDates, type ScheduleViewMode } from "@/lib/dates";
import { DAY_LABELS_FULL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { DayColumn } from "@/components/schedule/DayColumn";
import { Button } from "@/components/ui/Button";
import { PillTabs } from "@/components/ui/PillTabs";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore, selectTasksForDate } from "@/stores/taskStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUIStore } from "@/stores/uiStore";
import { format } from "date-fns";
import { durationMinutes } from "@/lib/dates";

const VIEW_MODE_TABS = ["Day", "3 Day", "Week"] as const;
const VIEW_MODE_BY_TAB: Record<(typeof VIEW_MODE_TABS)[number], ScheduleViewMode> = {
  Day: "day",
  "3 Day": "3day",
  Week: "week",
};
const TAB_BY_VIEW_MODE: Record<ScheduleViewMode, (typeof VIEW_MODE_TABS)[number]> = {
  day: "Day",
  "3day": "3 Day",
  week: "Week",
};

export function WeeklyPlanner({ initialDate }: { initialDate?: string }) {
  const [anchor, setAnchor] = useState(() => (initialDate ? new Date(initialDate) : new Date()));
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("day");
  const weekStartsOn = useSettingsStore((s) => s.settings.weekStartsOn);
  const routines = useRoutineStore((s) => s.routines);
  const tasks = useTaskStore((s) => s.tasks);
  const ensureDate = useTaskStore((s) => s.ensureDate);
  const moveTaskToDate = useTaskStore((s) => s.moveTaskToDate);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);

  const days = visibleDates(anchor, viewMode, weekStartsOn);
  const stepDays = { day: 1, "3day": 3, week: 7 }[viewMode];
  const dayLabels = days.map((d) => format(d, "EEE"));
  const [mobileDay, setMobileDay] = useState(() => format(new Date(), "EEE"));
  const selectedDay = days[dayLabels.indexOf(mobileDay)] ?? days[0];
  const visibleTasks = days.flatMap((day) => selectTasksForDate(tasks, dateKey(day)));
  const completed = visibleTasks.filter((task) => task.status === "completed").length;
  const plannedMinutes = visibleTasks.reduce((total, task) => total + durationMinutes(task.startTime, task.endTime), 0);

  useEffect(() => {
    days.forEach((d) => ensureDate(dateKey(d), routines));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey(days[0]), dateKey(days.at(-1)!), routines]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((t) => t.id === active.id);
    if (!task || task.date === over.id) return;
    moveTaskToDate(task.id, String(over.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex min-w-0 flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {days.length === 1 ? "Daily view" : days.length === 3 ? "Three day view" : "Weekly view"}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.045em]">
            {days.length === 1
              ? format(days[0], "EEEE, MMM d")
              : `${format(days[0], "MMM d")} – ${format(days.at(-1)!, "MMM d")}`}
          </h2>
        </div>
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto sm:justify-end">
          <PillTabs
            tabs={VIEW_MODE_TABS}
            value={TAB_BY_VIEW_MODE[viewMode]}
            onChange={(tab) => setViewMode(VIEW_MODE_BY_TAB[tab])}
          />
          <div className="flex shrink-0 gap-1" aria-label="Change date">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDirection(-1);
                setAnchor((a) => addDays(a, -stepDays));
              }}
              aria-label="Previous"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setAnchor(new Date())} type="button">
              Today
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDirection(1);
                setAnchor((a) => addDays(a, stepDays));
              }}
              aria-label="Next"
              type="button"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-b border-border py-2.5 text-[11px] sm:max-w-xl">
        <div className="flex items-center gap-2 px-2 first:pl-0">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          <span><strong className="text-foreground">{completed}</strong> <span className="text-muted">done</span></span>
        </div>
        <div className="flex items-center gap-2 px-3">
          <Clock3 className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          <span><strong className="text-foreground">{plannedMinutes}m</strong> <span className="text-muted">planned</span></span>
        </div>
        <div className="flex items-center gap-2 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span><strong className="text-foreground">{visibleTasks.length}</strong> <span className="text-muted">blocks</span></span>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="hidden overflow-x-auto pb-2 md:block">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={dateKey(days[0])}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -24 : 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn("grid gap-2.5", viewMode !== "week" && "justify-center")}
              style={{
                gridTemplateColumns:
                  viewMode === "week"
                    ? `repeat(${days.length}, minmax(180px, 1fr))`
                    : `repeat(${days.length}, minmax(280px, 420px))`,
              }}
            >
              {days.map((day) => (
                <DayColumn
                  key={dateKey(day)}
                  date={day}
                  label={DAY_LABELS_FULL[day.getDay()].slice(0, 3)}
                  tasks={selectTasksForDate(tasks, dateKey(day))}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md:hidden">
          <div className="mb-2 -mx-1 overflow-x-auto px-1 pb-1">
            <PillTabs className="!w-full !justify-between !rounded-none !border-0 !bg-transparent !p-0" tabs={dayLabels} value={mobileDay} onChange={setMobileDay} />
          </div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>{format(selectedDay, "EEEE, MMM d")}</span>
            <button type="button" onClick={() => openCommandPalette("add", dateKey(selectedDay))} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-foreground hover:bg-surface-2">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add block
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={dateKey(selectedDay)}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <DayColumn
                date={selectedDay}
                label={DAY_LABELS_FULL[selectedDay.getDay()].slice(0, 3)}
                tasks={selectTasksForDate(tasks, dateKey(selectedDay))}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </DndContext>
    </div>
  );
}
