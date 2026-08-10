export type NotificationSupport = "unsupported" | "denied" | "granted" | "default";

export function getNotificationSupport(): NotificationSupport {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission as NotificationSupport;
}

export async function requestNotificationPermission(): Promise<NotificationSupport> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result as NotificationSupport;
  } catch {
    return "denied";
  }
}

export interface ScheduledReminder {
  id: string;
  timeoutId: ReturnType<typeof setTimeout>;
}

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedules a reminder while the app/tab stays open. Browsers do not
 * reliably deliver Notification/setTimeout-based alerts once a tab is
 * closed or the OS suspends the page; this is a foreground-only fallback,
 * not a substitute for server-sent web push.
 */
export function scheduleForegroundReminder(
  id: string,
  fireAt: Date,
  title: string,
  body: string,
  onFallback: (title: string, body: string) => void
): void {
  cancelForegroundReminder(id);
  const delay = fireAt.getTime() - Date.now();
  if (delay <= 0) return;

  const timeoutId = setTimeout(() => {
    activeTimers.delete(id);
    const support = getNotificationSupport();
    if (support === "granted") {
      try {
        new Notification(title, { body, icon: "/icons/icon-192.png" });
        return;
      } catch {
        // fall through to in-app fallback
      }
    }
    onFallback(title, body);
  }, delay);

  activeTimers.set(id, timeoutId);
}

export function cancelForegroundReminder(id: string): void {
  const existing = activeTimers.get(id);
  if (existing) {
    clearTimeout(existing);
    activeTimers.delete(id);
  }
}

export function cancelAllForegroundReminders(): void {
  for (const timeoutId of activeTimers.values()) clearTimeout(timeoutId);
  activeTimers.clear();
}
