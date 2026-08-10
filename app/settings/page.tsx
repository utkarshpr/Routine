"use client";

import { motion } from "framer-motion";
import { Label, SelectField, TextField } from "@/components/ui/Field";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsSection";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { DataManagementSettings } from "@/components/settings/DataManagementSettings";
import { PillTabs } from "@/components/ui/PillTabs";
import { ACCENT_COLORS } from "@/lib/constants";
import { cardVariants, listStagger } from "@/lib/motion";
import { useSettingsStore } from "@/stores/settingsStore";
import type { AppearanceMode } from "@/types";

const APPEARANCE_OPTIONS: AppearanceMode[] = ["light", "dark", "system"];

export default function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <motion.div
      className="mx-auto max-w-5xl space-y-4 px-4 py-6 md:px-8 md:py-10"
      initial="initial"
      animate="animate"
      variants={listStagger}
    >
      <motion.h1 variants={cardVariants} className="text-2xl font-semibold tracking-tight">
        Settings
      </motion.h1>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <motion.div variants={cardVariants}>
      <SettingsSection title="Profile">
        <SettingsRow label="Your name">
          <TextField
            value={settings.userName}
            onChange={(e) => update({ userName: e.target.value })}
            className="w-40"
          />
        </SettingsRow>
      </SettingsSection>
      </motion.div>

      <motion.div variants={cardVariants}>
      <SettingsSection title="Appearance">
        <SettingsRow label="Theme">
          <PillTabs tabs={APPEARANCE_OPTIONS} value={settings.appearance} onChange={(mode) => update({ appearance: mode })} />
        </SettingsRow>
        <SettingsRow label="Accent color">
          <div className="flex gap-1.5">
            {ACCENT_COLORS.map((color) => (
              <motion.button
                key={color}
                type="button"
                onClick={() => update({ accentColor: color })}
                aria-label={color}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className={`h-7 w-7 rounded-full border-2 ${settings.accentColor === color ? "border-foreground" : "border-transparent"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </SettingsRow>
      </SettingsSection>
      </motion.div>

      <motion.div variants={cardVariants}>
      <SettingsSection title="Schedule defaults">
        <SettingsRow label="Start of day">
          <TextField
            type="time"
            value={settings.startOfDay}
            onChange={(e) => update({ startOfDay: e.target.value })}
            className="w-32"
          />
        </SettingsRow>
        <SettingsRow label="Default work hours">
          <div className="flex items-center gap-1.5">
            <TextField
              type="time"
              value={settings.defaultWorkStart}
              onChange={(e) => update({ defaultWorkStart: e.target.value })}
              className="w-28"
            />
            <span className="text-muted">–</span>
            <TextField
              type="time"
              value={settings.defaultWorkEnd}
              onChange={(e) => update({ defaultWorkEnd: e.target.value })}
              className="w-28"
            />
          </div>
        </SettingsRow>
        <SettingsRow label="Default focus duration">
          <SelectField
            value={String(settings.defaultFocusDurationMin)}
            onChange={(e) => update({ defaultFocusDurationMin: Number(e.target.value) })}
            className="w-28"
          >
            {[15, 20, 25, 30, 45, 60].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </SelectField>
        </SettingsRow>
        <SettingsRow label="Default break duration">
          <SelectField
            value={String(settings.defaultBreakDurationMin)}
            onChange={(e) => update({ defaultBreakDurationMin: Number(e.target.value) })}
            className="w-28"
          >
            {[5, 10, 15, 20].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </SelectField>
        </SettingsRow>
        <SettingsRow label="Week starts on">
          <SelectField
            value={String(settings.weekStartsOn)}
            onChange={(e) => update({ weekStartsOn: Number(e.target.value) as 0 | 1 })}
            className="w-28"
          >
            <option value={1}>Monday</option>
            <option value={0}>Sunday</option>
          </SelectField>
        </SettingsRow>
        <SettingsRow label="Timezone">
          <span className="text-sm text-muted">{settings.timezone}</span>
        </SettingsRow>
      </SettingsSection>
      </motion.div>

      <motion.div variants={cardVariants}>
        <NotificationsSettings />
      </motion.div>
      </div>

      <motion.div variants={cardVariants}>
        <DataManagementSettings />
      </motion.div>

      <motion.div variants={cardVariants}>
        <Label>Version</Label>
        <p className="text-xs text-muted">Daily OS · local-first v1</p>
      </motion.div>
    </motion.div>
  );
}
