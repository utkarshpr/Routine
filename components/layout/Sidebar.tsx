"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function Sidebar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[280px] md:flex-col md:px-5 md:py-6">
      <div className="flex h-full flex-col rounded-[28px] border border-border bg-surface px-4 py-5 shadow-[var(--shadow-card)] backdrop-blur-md">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-accent text-accent-foreground shadow-[var(--shadow-card)]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-tight leading-none">Daily OS</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">Designed for calmer days</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted shadow-[var(--shadow-card)] transition-colors hover:border-border-strong hover:text-foreground"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search</span>
        <kbd className="ml-auto rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-foreground/75">
          ⌘K
        </kbd>
      </button>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium tracking-[-0.01em] transition-colors",
                active ? "text-foreground" : "text-muted hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-2xl border border-border-strong bg-surface-2 shadow-[var(--shadow-card)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                  active ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted"
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      </div>
    </aside>
  );
}
