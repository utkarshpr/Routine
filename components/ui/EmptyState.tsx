"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { fadeIn } from "@/lib/motion";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className={cn("flex flex-col items-center justify-center gap-2 py-12 text-center", className)}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2"
        >
          <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
        </motion.div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
      {action}
    </motion.div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-surface-2", className)}>
      <div className="animate-shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
}
