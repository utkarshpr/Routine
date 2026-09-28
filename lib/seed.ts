import { CATEGORY_META } from "@/lib/constants";
import { addMinutesToTime, timeToMinutes } from "@/lib/dates";
import { createId } from "@/lib/id";
import type { Category, DayOfWeek, Goal, Habit, Routine, TaskType } from "@/types";

const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS: DayOfWeek[] = [1, 2, 3, 4, 5];
const DEFAULT_GOAL_ID = "seed-goal-balanced-week";

interface RoutineBlueprint {
  title: string;
  category: Category;
  startTime: string;
  endTime: string;
  daysOfWeek: DayOfWeek[];
  priority: "low" | "medium" | "high";
  type: TaskType;
  notes?: string;
}

/** A neutral starter routine for people who skip personalization during onboarding. */
export const DEFAULT_ROUTINE_BLUEPRINT: RoutineBlueprint[] = [
  { title: "Morning reset", category: "Personal", startTime: "07:00", endTime: "07:30", daysOfWeek: ALL_DAYS, priority: "medium", type: "FLEXIBLE" },
  { title: "Move your body", category: "Gym", startTime: "07:30", endTime: "08:15", daysOfWeek: ALL_DAYS, priority: "high", type: "FLEXIBLE" },
  { title: "Breakfast", category: "Personal", startTime: "08:15", endTime: "08:45", daysOfWeek: ALL_DAYS, priority: "low", type: "FLEXIBLE" },
  { title: "Focused work", category: "Work", startTime: "09:00", endTime: "12:00", daysOfWeek: WEEKDAYS, priority: "high", type: "FIXED", notes: "One meaningful block before the day gets noisy" },
  { title: "Lunch + reset", category: "Personal", startTime: "12:00", endTime: "13:00", daysOfWeek: WEEKDAYS, priority: "low", type: "FLEXIBLE" },
  { title: "Work / study", category: "Work", startTime: "13:00", endTime: "17:00", daysOfWeek: WEEKDAYS, priority: "high", type: "FIXED" },
  { title: "Transition time", category: "Personal", startTime: "17:00", endTime: "18:00", daysOfWeek: WEEKDAYS, priority: "low", type: "FLEXIBLE" },
  { title: "Dinner", category: "Cooking", startTime: "18:00", endTime: "19:00", daysOfWeek: ALL_DAYS, priority: "medium", type: "FLEXIBLE" },
  { title: "Personal project", category: "Personal", startTime: "19:00", endTime: "20:00", daysOfWeek: [1, 2, 3, 4, 5], priority: "medium", type: "FLEXIBLE" },
  { title: "People + free time", category: "Friends", startTime: "20:00", endTime: "21:30", daysOfWeek: ALL_DAYS, priority: "medium", type: "FLEXIBLE" },
  { title: "Plan tomorrow", category: "Personal", startTime: "21:30", endTime: "21:45", daysOfWeek: ALL_DAYS, priority: "low", type: "FLEXIBLE" },
  { title: "Sleep", category: "Sleep", startTime: "22:30", endTime: "07:00", daysOfWeek: ALL_DAYS, priority: "high", type: "FIXED" },
];

export function buildRoutinesFromBlueprint(
  blueprint: RoutineBlueprint[]
): Routine[] {
  const now = new Date().toISOString();
  return blueprint.map((b, index) => ({
    id: createId(),
    title: b.title,
    category: b.category,
    startTime: b.startTime,
    endTime: b.endTime,
    daysOfWeek: b.daysOfWeek,
    priority: b.priority,
    icon: CATEGORY_META[b.category].icon,
    color: CATEGORY_META[b.category].color,
    notes: b.notes,
    recurring: true,
    reminder: { enabled: true, offsetMinutes: 10, sound: true },
    completionRequired: true,
    type: b.type,
    paused: false,
    order: index,
    createdAt: now,
    updatedAt: now,
  }));
}

export function defaultSeedRoutines(): Routine[] {
  return buildRoutinesFromBlueprint(DEFAULT_ROUTINE_BLUEPRINT).map((routine, index) => ({
    ...routine,
    id: `seed-routine-${index}`,
  }));
}

export type OnboardingGoal = "Work" | "Learning" | "Projects" | "Fitness" | "Personal" | "Recovery";

export interface OnboardingAnswers {
  wakeTime: string;
  workStart: string;
  workEnd: string;
  sleepTime: string;
  goals: OnboardingGoal[];
}

interface FlexBlock {
  title: string;
  category: Category;
  minutes: number;
  priority: "low" | "medium" | "high";
  type: TaskType;
  requiresGoal?: OnboardingGoal;
}

const MORNING_BLOCKS: FlexBlock[] = [
  { title: "Move your body", category: "Gym", minutes: 45, priority: "high", type: "FLEXIBLE", requiresGoal: "Fitness" },
  { title: "Morning reset", category: "Personal", minutes: 30, priority: "low", type: "FLEXIBLE" },
  { title: "Learn / read", category: "Personal", minutes: 60, priority: "high", type: "FIXED", requiresGoal: "Learning" },
  { title: "Breakfast", category: "Personal", minutes: 30, priority: "low", type: "FLEXIBLE" },
];

const EVENING_BLOCKS: FlexBlock[] = [
  { title: "Transition time", category: "Personal", minutes: 60, priority: "low", type: "FLEXIBLE" },
  { title: "Dinner", category: "Cooking", minutes: 60, priority: "medium", type: "FLEXIBLE" },
  { title: "Personal project", category: "Personal", minutes: 60, priority: "high", type: "FLEXIBLE", requiresGoal: "Projects" },
  { title: "People + free time", category: "Friends", minutes: 60, priority: "medium", type: "FLEXIBLE", requiresGoal: "Personal" },
  { title: "Plan tomorrow", category: "Personal", minutes: 15, priority: "low", type: "FLEXIBLE" },
];

function includesGoal(goals: OnboardingGoal[], block: FlexBlock): boolean {
  return !block.requiresGoal || goals.includes(block.requiresGoal);
}

/** Adapts the default routine template to the user's chosen day boundaries and focus areas. */
export function buildAdaptedRoutineBlueprint(answers: OnboardingAnswers): RoutineBlueprint[] {
  const blocks: RoutineBlueprint[] = [];
  let cursor = timeToMinutes(answers.wakeTime);
  const workStart = timeToMinutes(answers.workStart);

  for (const block of MORNING_BLOCKS) {
    if (!includesGoal(answers.goals, block)) continue;
    const start = Math.min(cursor, workStart);
    const end = start + block.minutes;
    blocks.push({
      title: block.title,
      category: block.category,
      startTime: addMinutesToTime("00:00", start),
      endTime: addMinutesToTime("00:00", end),
      daysOfWeek: block.requiresGoal === "Learning" || block.requiresGoal === "Projects" ? WEEKDAYS : ALL_DAYS,
      priority: block.priority,
      type: block.type,
    });
    cursor = end;
  }

  blocks.push({
    title: "Work",
    category: "Work",
    startTime: answers.workStart,
    endTime: answers.workEnd,
    daysOfWeek: WEEKDAYS,
    priority: "high",
    type: "FIXED",
    notes: "Deep work + meetings",
  });

  cursor = timeToMinutes(answers.workEnd);
  const sleepMinutes = timeToMinutes(answers.sleepTime);
  for (const block of EVENING_BLOCKS) {
    if (!includesGoal(answers.goals, block)) continue;
    const start = cursor;
    const end = start + block.minutes;
    blocks.push({
      title: block.title,
      category: block.category,
      startTime: addMinutesToTime("00:00", start),
      endTime: addMinutesToTime("00:00", end),
      daysOfWeek: ALL_DAYS,
      priority: block.priority,
      type: block.type,
    });
    cursor = end;
  }

  blocks.push({
    title: "Sleep",
    category: "Sleep",
    startTime: addMinutesToTime("00:00", Math.max(cursor, sleepMinutes)),
    endTime: answers.wakeTime,
    daysOfWeek: ALL_DAYS,
    priority: "high",
    type: "FIXED",
  });

  return blocks;
}

export function defaultSeedHabits(): Habit[] {
  const now = new Date().toISOString();
  const defs: { id: string; title: string; icon: string; color: string }[] = [
    { id: "seed-habit-move", title: "Move your body", icon: "Dumbbell", color: "#f97316" },
    { id: "seed-habit-read", title: "Read or learn", icon: "BookOpen", color: "#0ea5e9" },
    { id: "seed-habit-reset", title: "Take a real pause", icon: "Sparkles", color: "#10b981" },
    { id: "seed-habit-reflect", title: "Reflect for five minutes", icon: "Moon", color: "#64748b" },
    { id: "seed-habit-water", title: "Drink enough water", icon: "Circle", color: "#0ea5e9" },
    { id: "seed-habit-sleep", title: "Keep a steady bedtime", icon: "Moon", color: "#8b5cf6" },
  ];
  return defs.map((d) => ({
    id: d.id,
    title: d.title,
    icon: d.icon,
    color: d.color,
    targetDaysOfWeek: ALL_DAYS,
    createdAt: now,
    archived: false,
  }));
}

export function defaultSeedGoals(): Goal[] {
  const now = new Date().toISOString();
  return [
    {
      id: DEFAULT_GOAL_ID,
      title: "Build a balanced week",
      areas: ["Work", "Gym", "Personal"],
      targetDate: "2026-12-31",
      progress: 15,
      milestones: [
        { id: "seed-goal-milestone-1", title: "Choose three meaningful priorities", done: false },
        { id: "seed-goal-milestone-2", title: "Protect time for deep work", done: false },
        { id: "seed-goal-milestone-3", title: "Move on most days", done: false },
        { id: "seed-goal-milestone-4", title: "Leave space for people and rest", done: false },
        { id: "seed-goal-milestone-5", title: "Review the week honestly", done: false },
      ],
      notes: "",
      createdAt: now,
    },
  ];
}
