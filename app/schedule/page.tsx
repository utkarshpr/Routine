"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { WeeklyPlanner } from "@/components/schedule/WeeklyPlanner";
import { RoutineManager } from "@/components/routine/RoutineManager";
import { PillTabs } from "@/components/ui/PillTabs";
import { fadeIn } from "@/lib/motion";

const TABS = ["Week", "Routines"] as const;

export default function SchedulePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") === "routines" ? "Routines" : "Week";
  const initialTab = activeTabFromUrl;
  const [tab, setTab] = useState<(typeof TABS)[number]>(initialTab);

  useEffect(() => {
    setTab(activeTabFromUrl);
  }, [activeTabFromUrl]);

  function handleTabChange(nextTab: (typeof TABS)[number]) {
    setTab(nextTab);
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "Routines") params.set("tab", "routines");
    else params.delete("tab");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 md:px-8 md:py-10">
      <PillTabs tabs={TABS} value={tab} onChange={handleTabChange} />

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial="initial" animate="animate" exit="exit" variants={fadeIn}>
          {tab === "Week" ? <WeeklyPlanner /> : <RoutineManager />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
