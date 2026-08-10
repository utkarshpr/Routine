"use client";

import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DrawerPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-3xl border-t border-border-strong bg-surface shadow-[var(--shadow-pop)] outline-none",
            className
          )}
        >
          <DrawerPrimitive.Handle className="mt-3 shrink-0 bg-border-strong" />
          <DrawerPrimitive.Title className="sr-only">{title}</DrawerPrimitive.Title>
          <div className="overflow-y-auto pb-[env(safe-area-inset-bottom)]">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
