import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-white/40 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_88%,white),var(--accent))] text-accent-foreground shadow-[var(--shadow-card)] hover:brightness-105 dark:border-white/12",
  secondary:
    "border border-white/40 bg-surface/92 text-foreground shadow-[0_12px_24px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl hover:border-white/70 hover:bg-white/70 dark:border-white/10 dark:hover:border-white/16 dark:hover:bg-white/8",
  ghost: "bg-transparent text-foreground hover:bg-white/55 dark:hover:bg-white/8",
  danger: "bg-danger text-white shadow-[var(--shadow-card)] hover:brightness-110",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tracking-[-0.01em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
});
