import { create } from "zustand";
import { db } from "@/lib/db";
import type { WeeklyReview } from "@/types";

interface ReviewState {
  reviews: WeeklyReview[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  upsert: (key: string, weekStart: string, partial: Partial<WeeklyReview>) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  hydrated: false,
  hydrate: async () => {
    const reviews = await db.getAll("weeklyReviews");
    set({ reviews, hydrated: true });
  },
  upsert: async (key, weekStart, partial) => {
    const existing = get().reviews.find((r) => r.id === key);
    const updated: WeeklyReview = {
      id: key,
      weekStart,
      wentWell: existing?.wentWell ?? "",
      needsImprovement: existing?.needsImprovement ?? "",
      nextWeekFocus: existing?.nextWeekFocus ?? "",
      ...existing,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    await db.put("weeklyReviews", updated);
    set((state) => ({
      reviews: state.reviews.some((r) => r.id === key)
        ? state.reviews.map((r) => (r.id === key ? updated : r))
        : [...state.reviews, updated],
    }));
  },
  remove: async (key) => {
    await db.remove("weeklyReviews", key);
    set((state) => ({ reviews: state.reviews.filter((review) => review.id !== key) }));
  },
}));
