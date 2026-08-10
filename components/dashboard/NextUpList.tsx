import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTimeLabel } from "@/lib/dates";
import { copy } from "@/lib/copy";
import type { Task } from "@/types";

export function NextUpList({ tasks }: { tasks: Task[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <EmptyState title={copy.allCaughtUp} className="py-6" />
        ) : (
          <ul className="space-y-1">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm">
                <CategoryIcon iconName={t.icon} className="h-4 w-4 shrink-0" style={{ color: t.color }} />
                <span className="w-16 shrink-0 tabular-nums text-muted">{formatTimeLabel(t.startTime)}</span>
                <span className="font-medium">{t.title}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
