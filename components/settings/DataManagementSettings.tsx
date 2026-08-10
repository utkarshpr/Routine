"use client";

import { useRef, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { exportAsJSON, exportHabitsAsCSV, exportTasksAsCSV, importFromJSON, resetAllData } from "@/lib/export";
import { toast } from "@/stores/toastStore";

export function DataManagementSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      await importFromJSON(text);
      toast("Data imported — reload to see everything", "success");
    } catch {
      toast("Couldn't import that file", "error");
    }
  }

  async function handleReset() {
    await resetAllData();
    toast("All data cleared");
    // Force a full reload (not client-side navigation) so every in-memory
    // Zustand store re-hydrates from the now-empty IndexedDB.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }

  return (
    <SettingsSection title="Data management" description="Your data lives only in this browser. Nothing is uploaded anywhere.">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => exportAsJSON()} type="button">
          <Download className="h-4 w-4" aria-hidden="true" />
          Export JSON
        </Button>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} type="button">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Import JSON
        </Button>
        <Button variant="secondary" size="sm" onClick={() => exportTasksAsCSV()} type="button">
          <Download className="h-4 w-4" aria-hidden="true" />
          Export tasks CSV
        </Button>
        <Button variant="secondary" size="sm" onClick={() => exportHabitsAsCSV()} type="button">
          <Download className="h-4 w-4" aria-hidden="true" />
          Export habits CSV
        </Button>
        <Button variant="danger" size="sm" onClick={() => setResetOpen(true)} type="button">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Reset data
        </Button>
      </div>
      <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleImportFile} />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset all data?"
        description="This permanently deletes every routine, task, habit, goal, and review stored in this browser."
        confirmLabel="Reset everything"
      />
    </SettingsSection>
  );
}
