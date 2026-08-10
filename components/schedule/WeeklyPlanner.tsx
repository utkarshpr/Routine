"use client";

import { useEffect, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, dateKey, weekDates } from "@/lib/dates";
import { DAY_LABELS_FULL } from "@/lib/constants";
import { DayColumn } from "@/components/schedule/DayColumn";
import { Button } from "@/components/ui/Button";
import { PillTabs } from "@/components/ui/PillTabs";
import { useRoutineStore } from "@/stores/routineStore";
import { useTaskStore, selectTasksForDate } from "@/stores/taskStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { format } from "date-fns";

export function WeeklyPlanner() {
  const [anchor, setAnchor] = useState(() => new Date());
  const [direction, setDirection] = useState(0);
  const weekStartsOn = useSettingsStore((s) => s.settings.weekStartsOn);
  const routines = useRoutineStore((s) => s.routines);
  const tasks = useTaskStore((s) => s.tasks);
  const ensureDate = useTaskStore((s) => s.ensureDate);
  const moveTaskToDate = useTaskStore((s) => s.moveTaskToDate);

  const days = weekDates(anchor, weekStartsOn);
  const dayLabels = days.map((d) => format(d, "EEE"));
  const [mobileDay, setMobileDay] = useState(() => format(new Date(), "EEE"));
  const selectedDay = days[dayLabels.indexOf(mobileDay)] ?? days[0];

  useEffect(() => {
    days.forEach((d) => ensureDate(dateKey(d), routines));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey(days[0]), routines]);

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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          {format(days[0], "MMM d")} – {format(days[6], "MMM d")}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setDirection(-1);
              setAnchor((a) => addDays(a, -7));
            }}
            aria-label="Previous week"
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
              setAnchor((a) => addDays(a, 7));
            }}
            aria-label="Next week"
            type="button"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
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
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(7, minmax(180px, 1fr))" }}
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
