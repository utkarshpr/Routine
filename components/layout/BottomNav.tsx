"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MOBILE_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 flex items-stretch justify-around rounded-[28px] border border-white/50 bg-surface/88 px-1.5 backdrop-blur-2xl pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-pop)] dark:border-white/10 md:hidden"
      aria-label="Primary"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-[22px] py-3 text-[11px] font-medium tracking-[-0.01em] transition-colors",
              active ? "text-foreground" : "text-muted"
            )}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <motion.span
                layoutId="bottomnav-active-pill"
                className="absolute inset-0 rounded-[22px] border border-white/55 bg-white/82 dark:border-white/12 dark:bg-white/8"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <item.icon className={cn("relative z-10 h-5 w-5", active && "text-accent")} aria-hidden="true" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
