"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Slow-drifting blurred color blobs used behind calm, low-density screens (onboarding, focus). */
export function BackgroundGlow() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 25, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
