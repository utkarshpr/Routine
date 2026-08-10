"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, WifiOff } from "lucide-react";
import { pageVariants } from "@/lib/motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { Toaster } from "@/components/ui/Toaster";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ShortcutsHelp } from "@/components/command/ShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useReminderScheduler } from "@/hooks/useReminderScheduler";
import { useHydrateApp } from "@/stores/hydrate";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUIStore } from "@/stores/uiStore";

export function AppShell({ children }: { children: React.ReactNode }) {
  const ready = useHydrateApp();
  const router = useRouter();
  const pathname = usePathname();
  const online = useOnlineStatus();
  const hasOnboarded = useSettingsStore((s) => s.settings.hasOnboarded);

  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen);
  const commandPaletteMode = useUIStore((s) => s.commandPaletteMode);
  const commandPaletteAddDate = useUIStore((s) => s.commandPaletteAddDate);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const closeCommandPalette = useUIStore((s) => s.closeCommandPalette);
  const shortcutsHelpOpen = useUIStore((s) => s.shortcutsHelpOpen);
  const openShortcutsHelp = useUIStore((s) => s.openShortcutsHelp);
  const closeShortcutsHelp = useUIStore((s) => s.closeShortcutsHelp);

  useKeyboardShortcuts({
    onNewTask: () => openCommandPalette("add"),
    onOpenPalette: () => openCommandPalette("search"),
    onShowHelp: openShortcutsHelp,
  });

  useReminderScheduler();

  useEffect(() => {
    if (!ready) return;
    if (!hasOnboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [ready, hasOnboarded, pathname, router]);

  useEffect(() => {
    if (!ready || pathname === "/onboarding") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [ready, pathname]);

  const isOnboarding = pathname === "/onboarding";
  const needsOnboardingRedirect = ready && !hasOnboarded && !isOnboarding;

  if (!ready || needsOnboardingRedirect) {
    // While the redirect effect above is navigating to /onboarding, don't mount
    // `children` at all — otherwise pages like Today would briefly materialize
    // tasks from the pre-onboarding default routines before they're replaced.
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" aria-hidden="true" />
          <p className="text-sm text-muted">Loading Daily OS…</p>
        </div>
      </div>
    );
  }

  if (isOnboarding) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <TooltipProvider delayDuration={200}>
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar onOpenCommandPalette={() => openCommandPalette("search")} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-surface-2 py-1.5 text-xs text-muted">
            <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
            You&rsquo;re offline — changes are saved locally and stay put.
          </div>
        )}
        <main className="min-w-0 flex-1 pb-24 md:pb-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-w-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Tooltip content="Quick add (N)" side="left">
        <motion.button
          type="button"
          onClick={() => openCommandPalette("add")}
          aria-label="Quick add"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-pop)] md:bottom-6 md:right-6"
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </motion.button>
      </Tooltip>

      <BottomNav />
      <InstallPrompt />
      <Toaster />
      <CommandPalette
        key={`${commandPaletteMode}-${commandPaletteAddDate ?? ""}`}
        open={commandPaletteOpen}
        onClose={closeCommandPalette}
        initialMode={commandPaletteMode}
        initialDate={commandPaletteAddDate ?? undefined}
      />
      <ShortcutsHelp open={shortcutsHelpOpen} onClose={closeShortcutsHelp} />
    </div>
    </TooltipProvider>
  );
}
