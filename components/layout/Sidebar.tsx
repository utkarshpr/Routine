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
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-surface md:px-4 md:py-6">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-[var(--shadow-card)]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight leading-none">Daily OS</p>
          <p className="text-xs text-muted">Build your day.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search</span>
        <kbd className="ml-auto rounded border border-border bg-surface px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-accent" : "text-muted hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-accent/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4" aria-hidden="true" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
