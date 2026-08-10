import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  getISOWeek,
  getISOWeekYear,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { DayOfWeek } from "@/types";

export const DATE_KEY_FORMAT = "yyyy-MM-dd";

export function dateKey(date: Date): string {
  return format(date, DATE_KEY_FORMAT);
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function parseDateKey(key: string): Date {
  return parse(key, DATE_KEY_FORMAT, new Date());
}

export function dayOfWeek(dateOrKey: Date | string): DayOfWeek {
  const date =
    typeof dateOrKey === "string" ? parseDateKey(dateOrKey) : dateOrKey;
  return date.getDay() as DayOfWeek;
}

/** Minutes since midnight for a "HH:mm" string. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function durationMinutes(startTime: string, endTime: string): number {
  const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
  return diff >= 0 ? diff : diff + 1440;
}

export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function weekKey(date: Date): string {
  return `${getISOWeekYear(date)}-W${String(getISOWeek(date)).padStart(2, "0")}`;
}

export function weekStart(date: Date, weekStartsOn: DayOfWeek = 1): Date {
  return startOfWeek(date, { weekStartsOn });
}

export function weekDates(date: Date, weekStartsOn: DayOfWeek = 1): Date[] {
  const start = weekStart(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Days from the 1st of the month through `date`, inclusive (never into the future). */
export function monthDatesSoFar(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfMonth(date), end: date });
}

/** Calendar days between now and an ISO date string (negative if in the past). */
export function daysUntil(isoDate: string, now: Date = new Date()): number {
  return differenceInCalendarDays(parseISO(isoDate), now);
}

export { addDays };

export function greetingForNow(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
