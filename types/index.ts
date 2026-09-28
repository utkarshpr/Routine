export type Category =
  | "Work"
  | "DSA"
  | "Golang"
  | "HLD"
  | "LLD"
  | "Gym"
  | "Cooking"
  | "Personal"
  | "Friends"
  | "Relationship"
  | "Sleep"
  | "Other";

export const CATEGORIES: Category[] = [
  "Work",
  "DSA",
  "Golang",
  "HLD",
  "LLD",
  "Gym",
  "Cooking",
  "Personal",
  "Friends",
  "Relationship",
  "Sleep",
  "Other",
];

export type TaskType = "FIXED" | "FLEXIBLE";

export type TaskStatus = "pending" | "completed" | "skipped";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface ReminderSettings {
  enabled: boolean;
  offsetMinutes: number; // minutes before start
  sound: boolean;
}

/** A recurring (or one-off template) routine definition. */
export interface Routine {
  id: string;
  title: string;
  category: Category;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  daysOfWeek: DayOfWeek[];
  priority: "low" | "medium" | "high";
  icon: string;
  color: string;
  notes?: string;
  recurring: boolean;
  reminder: ReminderSettings;
  completionRequired: boolean;
  type: TaskType;
  paused: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** A concrete task instance for a specific calendar date. */
export interface Task {
  id: string;
  routineId: string | null;
  date: string; // "yyyy-MM-dd"
  title: string;
  category: Category;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  priority: "low" | "medium" | "high";
  icon: string;
  color: string;
  notes?: string;
  type: TaskType;
  status: TaskStatus;
  completionRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  reminder?: ReminderSettings;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  targetDaysOfWeek: DayOfWeek[];
  createdAt: string;
  archived: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // "yyyy-MM-dd"
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  areas: Category[];
  targetDate: string; // ISO date
  progress: number; // 0-100, manual or derived from milestones
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
}

export type FocusMode = "pomodoro" | "custom" | "short-break" | "long-break";

export interface FocusSession {
  id: string;
  taskId: string | null;
  title: string;
  category: Category;
  mode: FocusMode;
  plannedSeconds: number;
  elapsedSeconds: number;
  startedAt: string;
  lastResumedAt: string | null;
  completedAt: string | null;
  status: "running" | "paused" | "completed" | "abandoned";
}

export interface WeeklyReview {
  id: string; // ISO week key e.g. "2026-W32"
  weekStart: string; // yyyy-MM-dd (Monday)
  wentWell: string;
  needsImprovement: string;
  nextWeekFocus: string;
  updatedAt: string;
}

export type AppearanceMode = "light" | "dark" | "system";

export interface Settings {
  id: "settings";
  userName: string;
  hasOnboarded: boolean;
  appearance: AppearanceMode;
  accentColor: string;
  startOfDay: string; // "HH:mm"
  defaultWorkStart: string;
  defaultWorkEnd: string;
  defaultFocusDurationMin: number;
  defaultBreakDurationMin: number;
  timezone: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  weekStartsOn: DayOfWeek;
}

export interface ExternalTool {
  id: string;
  name: string;
  description: string;
  url: string;
}
