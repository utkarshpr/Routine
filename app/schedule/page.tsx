"use client";

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
  const focusedDate = searchParams.get("date") ?? undefined;
  const tab = activeTabFromUrl;

  function handleTabChange(nextTab: (typeof TABS)[number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "Routines") params.set("tab", "routines");
    else params.delete("tab");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-4 md:px-8 md:py-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="cred-label text-muted">Time architecture</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">Arrange the week.</h1>
        </div>
        <PillTabs tabs={TABS} value={tab} onChange={handleTabChange} />
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial="initial" animate="animate" exit="exit" variants={fadeIn}>
          {tab === "Week" ? <WeeklyPlanner initialDate={focusedDate} /> : <RoutineManager />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
