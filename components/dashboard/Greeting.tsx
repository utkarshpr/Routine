"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { greetingForNow } from "@/lib/dates";
import { useNow } from "@/hooks/useNow";
import { useSettingsStore } from "@/stores/settingsStore";

export function Greeting() {
  const now = useNow(60_000);
  const userName = useSettingsStore((s) => s.settings.userName);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-foreground/70"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {greetingForNow(now)}, {userName}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground md:text-6xl md:leading-[0.94]">
        {format(now, "EEEE, MMMM d")}
      </h1>
    </motion.div>
  );
}
