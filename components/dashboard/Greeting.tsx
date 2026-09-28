"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { greetingForNow } from "@/lib/dates";
import { useNow } from "@/hooks/useNow";
import { useSettingsStore } from "@/stores/settingsStore";

export function Greeting() {
  const now = useNow(60_000);
  const userName = useSettingsStore((s) => s.settings.userName);
  const greetingLine = userName ? `${greetingForNow(now)}, ${userName}` : greetingForNow(now);

  return (
    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <p className="flex items-center gap-2 text-xs font-medium text-muted"><span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />{greetingLine}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-3xl">{format(now, "EEEE, MMMM d")}</h1>
    </motion.div>
  );
}
