"use client";

import { useEffect, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, dateKey, visibleDates, type ScheduleViewMode } from "@/lib/dates";
import { DAY_LABELS_FULL } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { DayColumn } from "@/components/schedule/DayColumn";
import { Button } from "@/components/ui/Button";
import { PillTabs } from "@/components/ui/PillTabs";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore, selectTasksForDate } from "@/stores/taskStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { format } from "date-fns";

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

  const days = visibleDates(anchor, viewMode, weekStartsOn);
  const stepDays = { day: 1, "3day": 3, week: 7 }[viewMode];
  const dayLabels = days.map((d) => format(d, "EEE"));
  const [mobileDay, setMobileDay] = useState(() => format(new Date(), "EEE"));
  const selectedDay = days[dayLabels.indexOf(mobileDay)] ?? days[0];

  useEffect(() => {
    if (!initialDate) return;
    setAnchor(new Date(initialDate));
  }, [initialDate]);

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
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {days.length === 1
            ? format(days[0], "EEEE, MMM d")
            : `${format(days[0], "MMM d")} – ${format(days.at(-1)!, "MMM d")}`}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <PillTabs
            tabs={VIEW_MODE_TABS}
            value={TAB_BY_VIEW_MODE[viewMode]}
            onChange={(tab) => setViewMode(VIEW_MODE_BY_TAB[tab])}
          />
          <div className="flex gap-1">
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
              className={cn("grid gap-3", viewMode !== "week" && "justify-center")}
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
          <div className="mb-3 overflow-x-auto">
            <PillTabs tabs={dayLabels} value={mobileDay} onChange={setMobileDay} />
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
