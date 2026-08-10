"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Command } from "cmdk";
import { Plus, Search as SearchIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRoutineStore } from "@/stores/routineStore";
import { useHabitStore } from "@/stores/habitStore";
import { useGoalStore } from "@/stores/goalStore";
import { useReviewStore } from "@/stores/reviewStore";
import { useTaskStore } from "@/stores/taskStore";
import { toast } from "@/stores/toastStore";
import { defaultIconColor, endTimeFor, parseQuickAdd } from "@/lib/nlp";
import { minutesToTime, parseDateKey, todayKey } from "@/lib/dates";
import { CATEGORIES, type Category } from "@/types";

interface SearchResult {
  id: string;
  label: string;
  meta: string;
  onSelect: () => void;
}

function roundedNow(): string {
  const now = new Date();
  const minutes = Math.ceil(now.getMinutes() / 5) * 5;
  return minutesToTime(now.getHours() * 60 + minutes);
}

export function CommandPalette({
  open,
  onClose,
  initialMode = "search",
  initialDate,
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: "search" | "add";
  initialDate?: string;
}) {
  const router = useRouter();
  const targetDate = initialDate ?? todayKey();
  const isToday = targetDate === todayKey();
  const targetDateLabel = isToday ? "today" : format(parseDateKey(targetDate), "EEE d");
  const [query, setQuery] = useState("");
  const [manualMode, setManualMode] = useState<"search" | "add">(initialMode);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const routines = useRoutineStore((s) => s.routines);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);
  const reviews = useReviewStore((s) => s.reviews);
  const addManualTask = useTaskStore((s) => s.addManualTask);

  // Reset local state whenever the palette transitions from closed to open,
  // using React's render-time "adjusting state" pattern instead of an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setManualMode(initialMode);
    }
  }

  const mode = query.trim().startsWith("+") ? "add" : manualMode;

  function switchMode(next: "search" | "add") {
    setQuery("");
    setManualMode(next);
  }

  const parsed = useMemo(() => parseQuickAdd(query || "+ New task", roundedNow()), [query]);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("Other");
  const [formStart, setFormStart] = useState("");
  const [formDuration, setFormDuration] = useState(30);

  // Re-sync the editable preview fields from the live parse every time the
  // query text changes while in add mode, so typing "+ Gym 6 PM" actually
  // updates the preview instead of freezing at the first parse.
  const [lastSyncedQuery, setLastSyncedQuery] = useState<string | null>(null);
  if (mode === "add" && query !== lastSyncedQuery) {
    setLastSyncedQuery(query);
    setFormTitle(parsed.title);
    setFormCategory(parsed.category);
    setFormStart(parsed.startTime);
    setFormDuration(parsed.durationMinutes);
  }

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q || mode === "add") return [];
    const items: SearchResult[] = [];

    routines
      .filter((r) => r.title.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((r) =>
        items.push({
          id: `routine-${r.id}`,
          label: r.title,
          meta: `Routine · ${r.category}`,
          onSelect: () => router.push("/schedule"),
        })
      );

    habits
      .filter((h) => h.title.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((h) =>
        items.push({
          id: `habit-${h.id}`,
          label: h.title,
          meta: "Habit",
          onSelect: () => router.push("/habits"),
        })
      );

    goals
      .filter((g) => g.title.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((g) =>
        items.push({
          id: `goal-${g.id}`,
          label: g.title,
          meta: "Goal",
          onSelect: () => router.push("/goals"),
        })
      );

    reviews
      .filter(
        (r) =>
          r.wentWell.toLowerCase().includes(q) ||
          r.needsImprovement.toLowerCase().includes(q) ||
          r.nextWeekFocus.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .forEach((r) =>
        items.push({
          id: `review-${r.id}`,
          label: `Week ${r.id}`,
          meta: "Weekly review note",
          onSelect: () => router.push("/review"),
        })
      );

    return items;
  }, [query, mode, routines, habits, goals, reviews, router]);

  async function handleAdd() {
    const meta = defaultIconColor(formCategory);
    const end = endTimeFor({
      title: formTitle,
      category: formCategory,
      startTime: formStart,
      durationMinutes: formDuration,
      confidence: "high",
    });
    await addManualTask({
      routineId: null,
      date: targetDate,
      title: formTitle.trim() || "Untitled task",
      category: formCategory,
      startTime: formStart,
      endTime: end,
      priority: "medium",
      icon: meta.icon,
      color: meta.color,
      type: "FLEXIBLE",
      status: "pending",
      completionRequired: true,
    });
    toast(`Added to ${targetDateLabel}`, "success");
    onClose();
  }

  const body = (
    <Command shouldFilter={false} loop className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {mode === "add" ? <Plus className="h-4 w-4 text-muted" /> : <SearchIcon className="h-4 w-4 text-muted" />}
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === "add" ? "+ Gym 6 PM, or DSA 1 hour" : "Search tasks, habits, goals, notes…"}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        {mode === "search" && (
          <button
            type="button"
            onClick={() => switchMode("add")}
            className="rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10"
          >
            Quick add
          </button>
        )}
        {mode === "add" && (
          <button
            type="button"
            onClick={() => switchMode("search")}
            className="rounded-lg px-2 py-1 text-xs font-medium text-muted hover:bg-surface-2"
          >
            Search instead
          </button>
        )}
      </div>

      {mode === "search" ? (
        query.trim() === "" ? (
          <p className="px-3 py-6 text-center text-sm text-muted">Type to search, or press ⌘K anytime.</p>
        ) : (
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
              No matches for &ldquo;{query}&rdquo;.
            </Command.Empty>
            {results.map((r) => (
              <Command.Item
                key={r.id}
                value={r.id}
                onSelect={() => {
                  r.onSelect();
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm data-[selected=true]:bg-surface-2"
              >
                <span>{r.label}</span>
                <span className="text-xs text-muted">{r.meta}</span>
              </Command.Item>
            ))}
          </Command.List>
        )
      ) : (
        <div className="space-y-3 p-4">
          <p className="text-xs text-muted">
            We parsed this as best we could — check the details before adding.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <TextField
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <SelectField value={formCategory} onChange={(e) => setFormCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-2 px-2">
              <CategoryIcon category={formCategory} className="h-4 w-4 text-muted" />
              <input
                type="time"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
                className="flex-1 bg-transparent px-1 py-2.5 text-sm outline-none"
              />
            </div>
            <SelectField
              value={String(formDuration)}
              onChange={(e) => setFormDuration(Number(e.target.value))}
              className="col-span-2"
            >
              {[15, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </SelectField>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleAdd} type="button">
              Add to {targetDateLabel}
            </Button>
          </div>
        </div>
      )}
    </Command>
  );

  if (isDesktop) {
    return (
      <Modal open={open} onClose={onClose} title="Command palette" className="max-w-xl p-0">
        {body}
      </Modal>
    );
  }

  return (
    <Drawer open={open} onClose={onClose} title="Command palette">
      {body}
    </Drawer>
  );
}
