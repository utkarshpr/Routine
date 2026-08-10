"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      offset={{ bottom: "5rem" }}
      mobileOffset={{ bottom: "5rem" }}
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground shadow-[var(--shadow-pop)] backdrop-blur-md",
          success: "border-success/30",
          error: "border-danger/30",
          title: "text-sm",
        },
      }}
    />
  );
}
