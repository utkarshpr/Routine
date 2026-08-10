import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground shadow-[var(--shadow-card)] hover:brightness-110",
  secondary: "bg-surface-2 text-foreground border border-border hover:border-border-strong hover:bg-border/40",
  ghost: "bg-transparent text-foreground hover:bg-surface-2",
  danger: "bg-danger text-white shadow-[var(--shadow-card)] hover:brightness-110",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
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
        "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
});
