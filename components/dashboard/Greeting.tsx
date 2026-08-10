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
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {greetingForNow(now)}, {userName}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
        <AnimatedGradientText>{format(now, "EEEE, MMMM d")}</AnimatedGradientText>
      </h1>
    </motion.div>
  );
}
