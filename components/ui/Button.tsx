import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "border border-accent bg-accent text-accent-foreground hover:brightness-110",
  secondary:
    "border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-2",
  ghost: "bg-transparent text-foreground hover:bg-surface-2 hover:text-accent",
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
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.975, y: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 30, mass: 0.7 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold tracking-[-0.015em] transition-[color,background-color,border-color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-40",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
});
