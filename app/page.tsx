"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Flag, ListChecks, ScanLine, Settings, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";
import { cardVariants, listStagger } from "@/lib/motion";

const DESTINATIONS = [
  { label: "Plan the day", detail: "Schedule", href: "/today", icon: CalendarDays },
  { label: "Protect a focus block", detail: "Deep work", href: "/focus", icon: Target },
  { label: "Keep the rhythm", detail: "Habits", href: "/habits", icon: ListChecks },
];

const EXPLORE = [
  { label: "Schedule", href: "/schedule", icon: CalendarDays },
  { label: "Goals", href: "/goals", icon: Flag },
  { label: "Review", href: "/review", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function HomePage() {
  return (
    <motion.main className="mx-auto w-full max-w-[1180px] px-4 py-7 sm:px-6 md:px-10 md:py-12" initial="initial" animate="animate" variants={listStagger}>
      <motion.header variants={cardVariants} className="max-w-3xl border-b border-border pb-7">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-[-0.04em]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground"><Sparkles className="h-4 w-4" aria-hidden="true" /></span>Routine <span className="ml-1 text-muted">/ workspace</span></div>
        <h1 className="mt-8 text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Make space for what matters.</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">A calm starting point for the work, rituals, and direction you want to keep close.</p>
      </motion.header>

      <motion.section variants={cardVariants} className="mt-5 overflow-hidden rounded-[20px] bg-accent text-accent-foreground md:mt-8" aria-label="Start today">
        <Link href="/today" className="group flex items-center justify-between gap-5 px-5 py-5 sm:px-6 sm:py-6">
          <span className="min-w-0"><span className="block text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">Start here</span><span className="mt-1 block text-xl font-semibold tracking-[-0.045em] sm:text-2xl">See what today needs.</span><span className="mt-1 block text-xs opacity-65">Your plan, next action, and progress in one quiet view.</span></span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-transform group-hover:translate-x-1"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </Link>
      </motion.section>

      <motion.section variants={cardVariants} className="mt-8" aria-label="Workspace destinations">
        <div className="flex items-center justify-between border-b border-border pb-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">For you</p><ScanLine className="h-4 w-4 text-muted" aria-hidden="true" /></div>
        <div className="grid gap-3 pt-4 md:grid-cols-3">
          {DESTINATIONS.map((item) => (
            <Link key={item.href} href={item.href} className="group flex min-h-32 flex-col justify-between rounded-[18px] border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2"><item.icon className="h-5 w-5 text-foreground" aria-hidden="true" /></span>
              <span className="mt-6 flex items-end justify-between gap-3"><span><span className="block text-base font-semibold tracking-[-0.03em]">{item.label}</span><span className="mt-1 block text-xs text-muted">{item.detail}</span></span><ArrowUpRight className="mb-0.5 h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section variants={cardVariants} className="mt-10" aria-label="Explore Routine">
        <div className="flex items-center justify-between border-b border-border pb-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Explore Routine</p><span className="text-xs text-muted">{EXPLORE.length} spaces</span></div>
        <div className="flex flex-wrap gap-2.5 pt-4">
          {EXPLORE.map((item) => <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2"><item.icon className="h-4 w-4 text-muted" aria-hidden="true" />{item.label}</Link>)}
        </div>
      </motion.section>
    </motion.main>
  );
}
