import type { Category } from "@/types";

export interface CategoryMeta {
  icon: string;
  color: string;
}

/** icon is a lucide-react icon name (see components/ui/CategoryIcon.tsx), color is a Tailwind-ish hex accent. */
export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Work: { icon: "Briefcase", color: "#6366f1" },
  DSA: { icon: "Braces", color: "#0ea5e9" },
  Golang: { icon: "Terminal", color: "#06b6d4" },
  HLD: { icon: "Network", color: "#8b5cf6" },
  LLD: { icon: "Blocks", color: "#a855f7" },
  Gym: { icon: "Dumbbell", color: "#f97316" },
  Cooking: { icon: "ChefHat", color: "#f59e0b" },
  Personal: { icon: "Sparkles", color: "#10b981" },
  Friends: { icon: "Users", color: "#ec4899" },
  Relationship: { icon: "Heart", color: "#f43f5e" },
  Sleep: { icon: "Moon", color: "#64748b" },
  Other: { icon: "Circle", color: "#71717a" },
};

export const PRIORITIES = ["low", "medium", "high"] as const;

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const DAY_LABELS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const ACCENT_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const EXTERNAL_TOOLS = [
  {
    id: "dsa-tracker",
    name: "DSA Tracker",
    description: "Track problems solved and patterns learned.",
    url: "https://dsa-tracker-wine.vercel.app/dsa",
  },
  {
    id: "system-design",
    name: "System Design",
    description: "HLD/LLD notes and design practice.",
    url: "https://system-desgin-mu.vercel.app/",
  },
  {
    id: "daily-pulse",
    name: "Daily Pulse",
    description: "Your broader daily check-in log.",
    url: "https://daily-pulse-gtat.vercel.app/",
  },
] as const;
