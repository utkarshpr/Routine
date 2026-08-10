import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ProgressSection({
  progressPct,
  completedCount,
  totalCount,
}: {
  progressPct: number;
  completedCount: number;
  totalCount: number;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Completion</p>
          <CardTitle className="mt-2 text-xl tracking-[-0.03em]">Today&rsquo;s Progress</CardTitle>
        </div>
        <span className="rounded-full border border-white/45 bg-white/55 px-3 py-1 text-sm font-medium text-muted dark:border-white/10 dark:bg-white/6">
          {completedCount}/{totalCount}
        </span>
      </CardHeader>
      <CardContent>
        <ProgressBar value={progressPct} trackClassName="h-2.5 bg-white/60 dark:bg-white/8" className="bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_82%,white),var(--accent))]" />
      </CardContent>
    </Card>
  );
}
