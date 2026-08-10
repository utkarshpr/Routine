import { CATEGORY_META } from "@/lib/constants";
import { addMinutesToTime, timeToMinutes } from "@/lib/dates";
import { createId } from "@/lib/id";
import type { Category, DayOfWeek, Goal, Habit, Routine, TaskType } from "@/types";

const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS: DayOfWeek[] = [1, 2, 3, 4, 5];

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

/** The default section-19 SSE-prep routine, editable after creation. */
export const DEFAULT_ROUTINE_BLUEPRINT: RoutineBlueprint[] = [
  { title: "Gym", category: "Gym", startTime: "06:00", endTime: "07:00", daysOfWeek: ALL_DAYS, priority: "high", type: "FLEXIBLE" },
  { title: "Shower + refresh", category: "Personal", startTime: "07:00", endTime: "07:30", daysOfWeek: ALL_DAYS, priority: "low", type: "FLEXIBLE" },
  { title: "DSA Deep Work", category: "DSA", startTime: "07:30", endTime: "08:45", daysOfWeek: WEEKDAYS, priority: "high", type: "FIXED" },
  { title: "Breakfast", category: "Personal", startTime: "08:45", endTime: "09:15", daysOfWeek: ALL_DAYS, priority: "low", type: "FLEXIBLE" },
  { title: "HLD / LLD", category: "HLD", startTime: "09:15", endTime: "10:00", daysOfWeek: WEEKDAYS, priority: "medium", type: "FIXED" },
  { title: "Work", category: "Work", startTime: "10:00", endTime: "18:00", daysOfWeek: WEEKDAYS, priority: "high", type: "FIXED", notes: "Deep work + meetings" },
  { title: "Break / commute / decompress", category: "Personal", startTime: "18:00", endTime: "19:00", daysOfWeek: WEEKDAYS, priority: "low", type: "FLEXIBLE" },
  { title: "Cooking + dinner", category: "Cooking", startTime: "19:00", endTime: "20:00", daysOfWeek: ALL_DAYS, priority: "medium", type: "FLEXIBLE" },
  { title: "Golang / project", category: "Golang", startTime: "20:00", endTime: "21:30", daysOfWeek: WEEKDAYS, priority: "high", type: "FLEXIBLE" },
  { title: "Me time / girlfriend / friends", category: "Relationship", startTime: "21:30", endTime: "22:30", daysOfWeek: ALL_DAYS, priority: "medium", type: "FLEXIBLE" },
  { title: "Planning + wind down", category: "Personal", startTime: "22:30", endTime: "23:00", daysOfWeek: ALL_DAYS, priority: "low", type: "FLEXIBLE" },
  { title: "Sleep", category: "Sleep", startTime: "23:00", endTime: "06:00", daysOfWeek: ALL_DAYS, priority: "high", type: "FIXED" },
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
  return buildRoutinesFromBlueprint(DEFAULT_ROUTINE_BLUEPRINT);
}

export type OnboardingGoal = "DSA" | "Golang" | "HLD" | "LLD" | "Fitness" | "Personal";

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
  { title: "Gym", category: "Gym", minutes: 60, priority: "high", type: "FLEXIBLE", requiresGoal: "Fitness" },
  { title: "Shower + refresh", category: "Personal", minutes: 30, priority: "low", type: "FLEXIBLE" },
  { title: "DSA Deep Work", category: "DSA", minutes: 75, priority: "high", type: "FIXED", requiresGoal: "DSA" },
  { title: "Breakfast", category: "Personal", minutes: 30, priority: "low", type: "FLEXIBLE" },
  { title: "HLD / LLD", category: "HLD", minutes: 45, priority: "medium", type: "FIXED", requiresGoal: "HLD" },
];

const EVENING_BLOCKS: FlexBlock[] = [
  { title: "Break / commute / decompress", category: "Personal", minutes: 60, priority: "low", type: "FLEXIBLE" },
  { title: "Cooking + dinner", category: "Cooking", minutes: 60, priority: "medium", type: "FLEXIBLE" },
  { title: "Golang / project", category: "Golang", minutes: 90, priority: "high", type: "FLEXIBLE", requiresGoal: "Golang" },
  { title: "Me time / friends", category: "Relationship", minutes: 60, priority: "medium", type: "FLEXIBLE", requiresGoal: "Personal" },
  { title: "Planning + wind down", category: "Personal", minutes: 30, priority: "low", type: "FLEXIBLE" },
];

function includesGoal(goals: OnboardingGoal[], block: FlexBlock): boolean {
  return !block.requiresGoal || goals.includes(block.requiresGoal) || (block.requiresGoal === "HLD" && goals.includes("LLD"));
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
      daysOfWeek: block.category === "DSA" || block.category === "HLD" ? [1, 2, 3, 4, 5] : ALL_DAYS,
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
  const defs: { title: string; icon: string; color: string }[] = [
    { title: "Gym", icon: "Dumbbell", color: "#f97316" },
    { title: "Study", icon: "Braces", color: "#0ea5e9" },
    { title: "Read", icon: "Sparkles", color: "#10b981" },
    { title: "Meditate", icon: "Moon", color: "#64748b" },
    { title: "Drink Water", icon: "Circle", color: "#0ea5e9" },
    { title: "Sleep before 11", icon: "Moon", color: "#8b5cf6" },
  ];
  return defs.map((d) => ({
    id: createId(),
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
      id: createId(),
      title: "₹1 Cr SSE Preparation",
      areas: ["DSA", "HLD", "LLD", "Golang", "Work"],
      targetDate: "2026-12-31",
      progress: 15,
      milestones: [
        { id: createId(), title: "300 DSA problems solved", done: false },
        { id: createId(), title: "20 HLD designs practiced", done: false },
        { id: createId(), title: "10 LLD designs practiced", done: false },
        { id: createId(), title: "Ship 2 Golang projects", done: false },
        { id: createId(), title: "Mock interviews x10", done: false },
      ],
      notes: "",
      createdAt: now,
    },
  ];
}
