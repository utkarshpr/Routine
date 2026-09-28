"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
  className?: string;
}) {
  const layoutId = useId();

  return (
    <div className={cn("flex w-fit gap-1 rounded-lg border border-border bg-surface-2 p-1", className)}>
      {tabs.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "relative rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
              active ? "text-foreground" : "text-muted"
            )}
          >
            {active && (
              <motion.span
                layoutId={`pill-tabs-${layoutId}`}
                className="absolute inset-0 rounded-md bg-surface shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
