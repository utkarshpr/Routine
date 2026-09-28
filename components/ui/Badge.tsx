import { cn } from "@/lib/cn";

export function Badge({
  className,
  color,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-2 py-1 text-[11px] font-semibold tracking-[-0.01em] text-muted",
        className
      )}
      style={color ? { color, backgroundColor: `${color}1a` } : undefined}
      {...props}
    />
  );
}
