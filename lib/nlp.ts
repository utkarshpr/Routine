import { addMinutesToTime, minutesToTime } from "@/lib/dates";
import { CATEGORY_META } from "@/lib/constants";
import type { Category } from "@/types";
import { CATEGORIES } from "@/types";

export interface ParsedQuickAdd {
  title: string;
  category: Category;
  startTime: string;
  durationMinutes: number;
  confidence: "high" | "low";
}

const CATEGORY_KEYWORDS: Partial<Record<Category, string[]>> = {
  Gym: ["gym", "workout", "run", "exercise"],
  DSA: ["dsa", "leetcode", "algorithm", "algo"],
  Golang: ["golang", "go ", "go project"],
  HLD: ["hld", "system design", "high level design"],
  LLD: ["lld", "low level design"],
  Cooking: ["cook", "cooking", "dinner", "lunch", "breakfast", "meal"],
  Friends: ["friend", "call friend", "hang out"],
  Relationship: ["girlfriend", "boyfriend", "partner", "date night"],
  Sleep: ["sleep", "nap"],
  Work: ["work", "meeting", "standup", "call"],
  Personal: ["me time", "personal", "read", "journal"],
};

function guessCategory(text: string): Category {
  const lower = text.toLowerCase();
  for (const category of CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords?.some((k) => lower.includes(k))) return category;
  }
  return "Other";
}

const DURATION_RE = /(\d+(?:\.\d+)?)\s*(hour|hr|h|minute|min|m)\b/i;
const TIME_RE = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i;
const TIME_24_RE = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;

function extractDuration(text: string): { minutes: number | null; cleaned: string } {
  const match = text.match(DURATION_RE);
  if (!match) return { minutes: null, cleaned: text };
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const minutes = unit.startsWith("h") ? Math.round(value * 60) : Math.round(value);
  return { minutes, cleaned: text.replace(match[0], "").trim() };
}

function extractTime(text: string): { time: string | null; cleaned: string } {
  const ampm = text.match(TIME_RE);
  if (ampm) {
    let hour = parseInt(ampm[1], 10) % 12;
    if (ampm[3].toLowerCase() === "pm") hour += 12;
    const minute = ampm[2] ? parseInt(ampm[2], 10) : 0;
    return { time: minutesToTime(hour * 60 + minute), cleaned: text.replace(ampm[0], "").trim() };
  }
  const t24 = text.match(TIME_24_RE);
  if (t24) {
    return {
      time: `${t24[1].padStart(2, "0")}:${t24[2]}`,
      cleaned: text.replace(t24[0], "").trim(),
    };
  }
  return { time: null, cleaned: text };
}

/**
 * Very small local NLP for Quick Add. Extracts title, optional duration and
 * optional clock time; if we couldn't confidently find a time/duration the
 * caller should show a confirmation form instead of creating outright.
 */
export function parseQuickAdd(input: string, defaultStartTime: string): ParsedQuickAdd {
  const raw = input.trim().replace(/^\+\s*/, "");
  const { minutes: durationMin, cleaned: afterDuration } = extractDuration(raw);
  const { time, cleaned: afterTime } = extractTime(afterDuration);

  const title = afterTime
    .replace(/\bfor\b|\bat\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim() || raw;

  const category = guessCategory(raw);
  const startTime = time ?? defaultStartTime;
  const duration = durationMin ?? 30;
  const confidence: "high" | "low" = time || durationMin ? "high" : "low";

  return { title, category, startTime, durationMinutes: duration, confidence };
}

export function endTimeFor(parsed: ParsedQuickAdd): string {
  return addMinutesToTime(parsed.startTime, parsed.durationMinutes);
}

export function defaultIconColor(category: Category) {
  return CATEGORY_META[category];
}
