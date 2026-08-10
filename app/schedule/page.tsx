"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WeeklyPlanner } from "@/components/schedule/WeeklyPlanner";
import { RoutineManager } from "@/components/routine/RoutineManager";
import { PillTabs } from "@/components/ui/PillTabs";
import { fadeIn } from "@/lib/motion";

const TABS = ["Week", "Routines"] as const;

export default function SchedulePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Week");

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 md:px-8 md:py-10">
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial="initial" animate="animate" exit="exit" variants={fadeIn}>
          {tab === "Week" ? <WeeklyPlanner /> : <RoutineManager />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
