"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  spotlight,
  onMouseMove,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { spotlight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    }
    onMouseMove?.(e);
  }

  return (
    <div
      ref={ref}
      onMouseMove={spotlight ? handleMouseMove : onMouseMove}
      className={cn(
        "rounded-2xl bg-surface border border-border shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        spotlight && "group relative overflow-hidden",
        className
      )}
      {...props}
    >
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
          }}
        />
      )}
      {spotlight ? <div className="relative z-10">{children}</div> : children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}
