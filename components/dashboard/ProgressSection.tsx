import { Check } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ProgressSection({ progressPct, completedCount, totalCount }: { progressPct: number; completedCount: number; totalCount: number }) {
  return (
    <section className="px-4 py-4" aria-label="Today's progress">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Daily progress</p><p className="mt-1 text-2xl font-semibold tracking-[-0.05em]">{progressPct}%</p></div><div className="flex items-center gap-1.5 text-xs text-muted"><Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />{completedCount}/{totalCount} done</div></div>
      <ProgressBar value={progressPct} trackClassName="mt-3 h-1.5 bg-surface-2" className="bg-success" />
    </section>
  );
}
