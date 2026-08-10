import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  FocusSession,
  Goal,
  Habit,
  HabitCompletion,
  Routine,
  Settings,
  Task,
  WeeklyReview,
} from "@/types";

const DB_NAME = "daily-os";
const DB_VERSION = 1;

interface DailyOSSchema extends DBSchema {
  routines: { key: string; value: Routine };
  tasks: { key: string; value: Task; indexes: { "by-date": string } };
  habits: { key: string; value: Habit };
  habitCompletions: {
    key: string;
    value: HabitCompletion;
    indexes: { "by-habit": string; "by-date": string };
  };
  goals: { key: string; value: Goal };
  focusSessions: { key: string; value: FocusSession };
  weeklyReviews: { key: string; value: WeeklyReview };
  settings: { key: string; value: Settings };
}

type StoreName = keyof DailyOSSchema;

const STORE_NAMES: StoreName[] = [
  "routines",
  "tasks",
  "habits",
  "habitCompletions",
  "goals",
  "focusSessions",
  "weeklyReviews",
  "settings",
];

let dbPromise: Promise<IDBPDatabase<DailyOSSchema>> | null = null;

function getDB() {
  if (typeof indexedDB === "undefined") {
    throw new TypeError("IndexedDB is not available in this environment");
  }
  dbPromise ??= openDB<DailyOSSchema>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains("routines")) {
        database.createObjectStore("routines", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("tasks")) {
        const store = database.createObjectStore("tasks", { keyPath: "id" });
        store.createIndex("by-date", "date");
      }
      if (!database.objectStoreNames.contains("habits")) {
        database.createObjectStore("habits", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("habitCompletions")) {
        const store = database.createObjectStore("habitCompletions", {
          keyPath: "id",
        });
        store.createIndex("by-habit", "habitId");
        store.createIndex("by-date", "date");
      }
      if (!database.objectStoreNames.contains("goals")) {
        database.createObjectStore("goals", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("focusSessions")) {
        database.createObjectStore("focusSessions", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("weeklyReviews")) {
        database.createObjectStore("weeklyReviews", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("settings")) {
        database.createObjectStore("settings", { keyPath: "id" });
      }
    },
  });
  return dbPromise;
}

// idb's mapped-type helpers don't distribute cleanly over a generic store-name
// parameter, so the implementation below is loosely typed and the strict,
// per-store typing is provided by the `DB` interface the exported object
// satisfies.
async function getAllImpl(store: StoreName): Promise<unknown[]> {
  const database = await getDB();
  return database.getAll(store as never);
}

async function putImpl(store: StoreName, value: unknown): Promise<unknown> {
  const database = await getDB();
  await database.put(store as never, value as never);
  return value;
}

async function removeImpl(store: StoreName, key: string): Promise<void> {
  const database = await getDB();
  await database.delete(store as never, key);
}

async function getByDateRangeImpl(
  startDate: string,
  endDate: string
): Promise<unknown[]> {
  const database = await getDB();
  const range = IDBKeyRange.bound(startDate, endDate);
  return database.getAllFromIndex("tasks", "by-date", range);
}

async function clearAllImpl(): Promise<void> {
  const database = await getDB();
  await Promise.all(STORE_NAMES.map((name) => database.clear(name as never)));
}

interface DB {
  getAll<K extends StoreName>(store: K): Promise<DailyOSSchema[K]["value"][]>;
  put<K extends StoreName>(
    store: K,
    value: DailyOSSchema[K]["value"]
  ): Promise<DailyOSSchema[K]["value"]>;
  remove<K extends StoreName>(store: K, key: string): Promise<void>;
  getByDateRange(startDate: string, endDate: string): Promise<Task[]>;
  clearAll(): Promise<void>;
}

export const db = {
  getAll: getAllImpl,
  put: putImpl,
  remove: removeImpl,
  getByDateRange: getByDateRangeImpl,
  clearAll: clearAllImpl,
} as unknown as DB;
