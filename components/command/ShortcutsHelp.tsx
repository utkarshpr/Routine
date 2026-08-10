import { Modal } from "@/components/ui/Modal";

const SHORTCUTS: [string, string][] = [
  ["N", "New task (Quick Add)"],
  ["F", "Focus mode"],
  ["T", "Today"],
  ["W", "Week / Schedule"],
  ["H", "Habits"],
  ["G", "Goals"],
  ["Space", "Start / pause timer (in Focus)"],
  ["Esc", "Close modal"],
  ["⌘/Ctrl K", "Command palette & search"],
  ["?", "Show this help"],
];

export function ShortcutsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts" className="max-w-sm">
      <h2 className="mb-4 text-base font-semibold">Keyboard shortcuts</h2>
      <ul className="space-y-2">
        {SHORTCUTS.map(([key, label]) => (
          <li key={key} className="flex items-center justify-between text-sm">
            <span className="text-muted">{label}</span>
            <kbd className="rounded border border-border bg-surface-2 px-2 py-0.5 text-xs font-medium">{key}</kbd>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
