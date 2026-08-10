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
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.08)] md:hidden"
      aria-label="Primary"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              active ? "text-accent" : "text-muted"
            )}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <motion.span
                layoutId="bottomnav-active-pill"
                className="absolute top-1 h-1 w-8 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
