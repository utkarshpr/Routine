import { cn } from "@/lib/cn";

export function Badge({
  className,
  color,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted",
        className
      )}
      style={color ? { color, backgroundColor: `${color}1a` } : undefined}
      {...props}
    />
  );
}
