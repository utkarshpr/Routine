"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { AnimatedGradientText } from "@/components/ui/effects/AnimatedGradientText";
import { greetingForNow } from "@/lib/dates";
import { useNow } from "@/hooks/useNow";
import { useSettingsStore } from "@/stores/settingsStore";

export function Greeting() {
  const now = useNow(60_000);
  const userName = useSettingsStore((s) => s.settings.userName);

  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {greetingForNow(now)}, {userName}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        <AnimatedGradientText>{format(now, "EEEE, MMMM d")}</AnimatedGradientText>
      </h1>
    </motion.div>
  );
}
