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
    <Card>
      <CardHeader className="flex items-center justify-between pb-1">
        <CardTitle>Today&rsquo;s Progress</CardTitle>
        <span className="text-sm font-medium text-muted">
          {completedCount}/{totalCount}
        </span>
      </CardHeader>
      <CardContent>
        <ProgressBar value={progressPct} />
      </CardContent>
    </Card>
  );
}
