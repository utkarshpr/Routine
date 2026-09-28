"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const DISMISSED_KEY = "daily-os-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// This component only ever mounts client-side (AppShell gates it behind post-hydration
// store readiness), so reading browser globals in lazy initializers here is safe.
export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS] = useState(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
  const [isStandalone] = useState(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
  );
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === "1");

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  async function install() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
  }

  const shouldShow = !isStandalone && !dismissed && (deferredEvent || isIOS);
  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-md rounded-2xl border border-border bg-surface p-4 shadow-xl md:bottom-6 md:left-6 md:right-auto"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="absolute right-3 top-3 text-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="pr-6 text-sm font-medium">Install Routine</p>
        {deferredEvent ? (
          <>
            <p className="mt-1 text-xs text-muted">Add it to your home screen for a native, offline-ready experience.</p>
            <Button size="sm" className="mt-3" onClick={install} type="button">
              Install
            </Button>
          </>
        ) : (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            Tap <Share className="inline h-3.5 w-3.5" /> then &ldquo;Add to Home Screen&rdquo;.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
