import type { LucideIcon } from "lucide-react";
import { Calendar, Flag, Home, ListChecks, Settings, Sparkles, Target } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Today", icon: Home, shortcut: "T" },
  { href: "/schedule", label: "Schedule", icon: Calendar, shortcut: "W" },
  { href: "/focus", label: "Focus", icon: Target, shortcut: "F" },
  { href: "/habits", label: "Habits", icon: ListChecks, shortcut: "H" },
  { href: "/goals", label: "Goals", icon: Flag, shortcut: "G" },
  { href: "/review", label: "Review", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Subset shown in the mobile bottom nav (kept short to feel native). */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[4],
];
