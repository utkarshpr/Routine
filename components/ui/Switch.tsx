"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onCheckedChange,
  className,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full bg-surface-2 border border-border transition-colors data-[state=checked]:bg-accent data-[state=checked]:border-accent",
        className
      )}
    >
      <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-surface shadow-[var(--shadow-card)] transition-transform duration-150 will-change-transform data-[state=checked]:translate-x-[1.125rem] data-[state=checked]:bg-accent-foreground" />
    </SwitchPrimitive.Root>
  );
}
