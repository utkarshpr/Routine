"use client";

import { motion } from "framer-motion";
import { Label, SelectField, TextField } from "@/components/ui/Field";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsSection";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { DataManagementSettings } from "@/components/settings/DataManagementSettings";
import { PillTabs } from "@/components/ui/PillTabs";
import { cardVariants, listStagger } from "@/lib/motion";
import { useSettingsStore } from "@/stores/settingsStore";
import type { AppearanceMode } from "@/types";
const APPEARANCE_OPTIONS: AppearanceMode[] = ["light", "dark", "system"];

export default function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings); const update = useSettingsStore((s) => s.update);
  return <motion.main className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:px-6 md:px-8 md:py-7" initial="initial" animate="animate" variants={listStagger}>
    <motion.header variants={cardVariants} className="border-b border-border pb-5"><p className="cred-label text-muted">Quiet controls for your day</p><p className="mt-1 text-sm text-muted">Shape Routine around the way you actually live and work.</p></motion.header>
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <motion.div variants={cardVariants}><SettingsSection title="Profile" description="A little context makes the workspace feel like yours."><SettingsRow label="Your name"><TextField aria-label="Your name" value={settings.userName} onChange={(e) => update({ userName: e.target.value })} className="w-36" /></SettingsRow></SettingsSection></motion.div>
      <motion.div variants={cardVariants}><SettingsSection title="Appearance" description="Keep the interface quiet and focused."><SettingsRow label="Theme"><PillTabs tabs={APPEARANCE_OPTIONS} value={settings.appearance} onChange={(mode) => update({ appearance: mode })} /></SettingsRow></SettingsSection></motion.div>
      <motion.div variants={cardVariants}><SettingsSection title="Day shape" description="Defaults only. You can change individual blocks any time."><SettingsRow label="Start of day"><TextField aria-label="Start of day" type="time" value={settings.startOfDay} onChange={(e) => update({ startOfDay: e.target.value })} className="w-28" /></SettingsRow><SettingsRow label="Work hours"><div className="flex items-center gap-1.5"><TextField aria-label="Work starts" type="time" value={settings.defaultWorkStart} onChange={(e) => update({ defaultWorkStart: e.target.value })} className="w-24" /><span className="text-muted">–</span><TextField aria-label="Work ends" type="time" value={settings.defaultWorkEnd} onChange={(e) => update({ defaultWorkEnd: e.target.value })} className="w-24" /></div></SettingsRow><SettingsRow label="Focus"><SelectField aria-label="Default focus duration" value={String(settings.defaultFocusDurationMin)} onChange={(e) => update({ defaultFocusDurationMin: Number(e.target.value) })} className="w-24">{[15, 20, 25, 30, 45, 60].map((m) => <option key={m} value={m}>{m} min</option>)}</SelectField></SettingsRow><SettingsRow label="Break"><SelectField aria-label="Default break duration" value={String(settings.defaultBreakDurationMin)} onChange={(e) => update({ defaultBreakDurationMin: Number(e.target.value) })} className="w-24">{[5, 10, 15, 20].map((m) => <option key={m} value={m}>{m} min</option>)}</SelectField></SettingsRow><SettingsRow label="Week starts"><SelectField aria-label="Week starts on" value={String(settings.weekStartsOn)} onChange={(e) => update({ weekStartsOn: Number(e.target.value) as 0 | 1 })} className="w-24"><option value={1}>Monday</option><option value={0}>Sunday</option></SelectField></SettingsRow><SettingsRow label="Timezone"><span className="text-sm text-muted">{settings.timezone}</span></SettingsRow></SettingsSection></motion.div>
      <motion.div variants={cardVariants}><NotificationsSettings /></motion.div>
    </div>
    <motion.div variants={cardVariants}><DataManagementSettings /></motion.div>
    <motion.div variants={cardVariants} className="border-t border-border pt-4"><Label>Version</Label><p className="text-xs text-muted">Routine · local-first v1</p></motion.div>
  </motion.main>;
}
