import { cn } from "@/lib/cn";

export function AnimatedGradientText({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "animate-gradient-sweep bg-gradient-to-r from-accent via-fuchsia-500 to-accent bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
