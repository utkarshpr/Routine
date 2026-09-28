"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, WifiOff } from "lucide-react";
import { pageVariants } from "@/lib/motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { Toaster } from "@/components/ui/Toaster";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, TextField } from "@/components/ui/Field";
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
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);
  const hasOnboarded = settings.hasOnboarded;
  const [nameDraft, setNameDraft] = useState(settings.userName);

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
  const shouldPromptForName = ready && hasOnboarded && !isOnboarding && settings.userName.trim().length === 0;

  if (!ready || needsOnboardingRedirect) {
    // While the redirect effect above is navigating to /onboarding, don't mount
    // `children` at all — otherwise pages like Today would briefly materialize
    // tasks from the pre-onboarding default routines before they're replaced.
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" aria-hidden="true" />
          <p className="text-sm text-muted">Loading Routine…</p>
        </div>
      </div>
    );
  }

  if (isOnboarding) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <TooltipProvider delayDuration={200}>
    <div className="relative flex min-h-screen overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[180px] bg-[radial-gradient(ellipse_at_70%_-30%,rgba(185,151,80,0.12),transparent_58%)]"
      />
      <Sidebar onOpenCommandPalette={() => openCommandPalette("search")} />
      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar />
        {!online && (
          <div className="mx-4 mt-3 flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs text-muted md:mx-6">
            <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
            You&rsquo;re offline — changes are saved locally and stay put.
          </div>
        )}
        <main className="min-w-0 flex-1 pb-28 md:pb-10">
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
          className="fixed bottom-7 right-7 z-40 hidden h-12 w-12 items-center justify-center rounded-full border border-accent bg-accent text-accent-foreground shadow-[var(--shadow-pop)] md:flex"
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
      <Modal open={shouldPromptForName} onClose={() => undefined} title="Tell us your name" className="max-w-md">
        <h2 className="text-xl font-semibold tracking-tight">Make it yours</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Start with a blank workspace and add your name once, so Routine feels personal from the beginning.
        </p>
        <div className="mt-5">
          <Label htmlFor="first-run-name">Your name</Label>
          <TextField
            id="first-run-name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            disabled={nameDraft.trim().length === 0}
            onClick={() => updateSettings({ userName: nameDraft.trim() })}
          >
            Save name
          </Button>
        </div>
      </Modal>
    </div>
    </TooltipProvider>
  );
}
