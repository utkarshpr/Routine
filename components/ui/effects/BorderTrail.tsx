"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function BorderTrail({ className, size = 80 }: { className?: string; size?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <motion.div
        className={cn("absolute aspect-square bg-white/55", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          filter: "blur(10px)",
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
