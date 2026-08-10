"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsSection";
import { getNotificationSupport, requestNotificationPermission, type NotificationSupport } from "@/lib/notifications";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/stores/toastStore";

const STATUS_COPY: Record<NotificationSupport, string> = {
  unsupported: "Not supported in this browser.",
  denied: "Blocked — enable notifications for this site in your browser settings.",
  granted: "Enabled while Daily OS is open.",
  default: "Not yet enabled.",
};

// Only ever mounts post-hydration (AppShell gates page content behind store
// readiness), so reading Notification.permission in a lazy initializer is safe.
export function NotificationsSettings() {
  const [status, setStatus] = useState<NotificationSupport>(() => getNotificationSupport());
  const notificationsEnabled = useSettingsStore((s) => s.settings.notificationsEnabled);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);
  const update = useSettingsStore((s) => s.update);

  async function handleEnable() {
    const result = await requestNotificationPermission();
    setStatus(result);
    if (result === "granted") toast("Notifications enabled", "success");
    else if (result === "denied") toast("Notifications blocked by browser", "error");
  }

  return (
    <SettingsSection
      title="Notifications"
      description="Reminders fire while Daily OS is open in a tab. Browsers don't reliably deliver alerts once the app is closed or the tab is backgrounded for long — that requires a push server, which isn't part of this offline-first v1."
    >
      <SettingsRow label="Browser permission">
        <div className="flex items-center gap-2">
          {status === "granted" ? (
            <Bell className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <BellOff className="h-4 w-4 text-muted" aria-hidden="true" />
          )}
          <span className="text-xs text-muted">{STATUS_COPY[status]}</span>
          {status !== "granted" && status !== "unsupported" && (
            <Button size="sm" variant="secondary" onClick={handleEnable} type="button">
              Enable
            </Button>
          )}
        </div>
      </SettingsRow>
      <SettingsRow label="Reminders enabled">
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={(checked) => update({ notificationsEnabled: checked })}
          aria-label="Reminders enabled"
        />
      </SettingsRow>
      <SettingsRow label="Sound">
        <Switch
          checked={soundEnabled}
          onCheckedChange={(checked) => update({ soundEnabled: checked })}
          aria-label="Sound"
        />
      </SettingsRow>
    </SettingsSection>
  );
}
