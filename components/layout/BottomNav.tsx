"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  CalendarDays,
  CircleDot,
  CheckSquare,
  MoreHorizontal,
  Plus,
  Target,
  Settings,
  House,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useUIStore } from "@/stores/uiStore";

const MOBILE_NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: House,
  },
  {
    label: "Today",
    href: "/today",
    icon: Sun,
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: CalendarDays,
  },
  {
    label: "Focus",
    href: "/focus",
    icon: CircleDot,
  },

];

const MORE_ITEMS = [
  {
    label: "Review",
    href: "/review",
    icon: Sparkles,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: CheckSquare,
  },
  {
    label: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },

];

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);

  const moreActive = MORE_ITEMS.some(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
  );

  return (
    <>
      {/* More menu */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-30 bg-black/20 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className="
                fixed
                right-4
                bottom-[88px]
                z-50
                w-48
                overflow-hidden
                rounded-xl
                border border-white/[0.12]
                bg-[#141514]/95
                p-1.5
                shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                backdrop-blur-2xl
                md:hidden
              "
            >
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  openCommandPalette("add");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <Plus className="h-[18px] w-[18px]" />
                <span>Quick add</span>
              </button>
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors",
                      active
                        ? "bg-white/[0.07] text-white"
                        : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <nav
        className="
          fixed inset-x-4 bottom-4 z-40
          md:hidden
          flex items-center
          h-[68px]
          rounded-[18px]
          border border-white/[0.12]
          bg-[#111212]/95
          px-2
          shadow-[0_12px_40px_rgba(0,0,0,0.35)]
          backdrop-blur-2xl
        "
        aria-label="Primary"
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="
                relative
                flex-1
                h-full
                flex
                flex-col
                items-center
                justify-center
                gap-1
                rounded-[18px]
                text-[10px]
                font-medium
              "
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="bottomnav-active"
                  className="
                    absolute
                    inset-x-1
                    inset-y-2
                    rounded-[14px]
                    bg-white/[0.11]
                  "
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              <Icon
                className={cn(
                  "relative z-10 h-[18px] w-[18px]",
                  active
                    ? "text-accent"
                    : "text-white/45"
                )}
                strokeWidth={active ? 2 : 1.7}
              />

              <span
                className={cn(
                  "relative z-10",
                  active
                    ? "text-white"
                    : "text-white/45"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* MORE BUTTON */}
        <button
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-label="More"
          aria-expanded={moreOpen}
          className="
            relative
            flex-1
            h-full
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-[18px]
            text-[10px]
            font-medium
          "
        >
          {(moreOpen || moreActive) && (
            <motion.span
              layoutId="bottomnav-active"
              className="
                absolute
                inset-x-1
                inset-y-2
                rounded-[18px]
                bg-white/[0.07]
              "
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 32,
              }}
            />
          )}

          <MoreHorizontal
            className={cn(
              "relative z-10 h-[18px] w-[18px]",
              moreOpen || moreActive
                ? "text-accent"
                : "text-white/45"
            )}
            strokeWidth={moreOpen ? 2 : 1.7}
          />

          <span
            className={cn(
              "relative z-10",
              moreOpen || moreActive
                ? "text-white"
                : "text-white/45"
            )}
          >
            More
          </span>
        </button>
      </nav>
    </>
  );
}
