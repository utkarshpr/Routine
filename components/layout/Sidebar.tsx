"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Tooltip } from "@/components/ui/Tooltip";

export function Sidebar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[72px] shrink-0 border-r border-border bg-surface/65 md:flex md:flex-col md:items-center md:py-4">
      <Link href="/" aria-label="Routine home" className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent text-accent-foreground transition-colors hover:brightness-110">
        <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-2" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Tooltip key={item.href} content={item.label} side="right">
              <Link href={item.href} aria-label={item.label} aria-current={active ? "page" : undefined} className={cn("relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground", active && "text-foreground")}>
                {active && <motion.span layoutId="rail-active" className="absolute inset-0 rounded-full bg-foreground/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                <item.icon className="relative z-10 h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.7} aria-hidden="true" />
              </Link>
            </Tooltip>
          );
        })}
      </nav>
      <Tooltip content="Search" side="right">
        <button type="button" onClick={onOpenCommandPalette} aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
          <Search className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
        </button>
      </Tooltip>
    </aside>
  );
}
