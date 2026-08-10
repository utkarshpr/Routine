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
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Queue</p>
        <CardTitle className="mt-2 text-xl tracking-[-0.03em]">Next Up</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <EmptyState title={copy.allCaughtUp} className="py-6" />
        ) : (
          <ul className="space-y-1">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-[22px] border border-white/45 bg-white/46 px-3 py-3 text-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/6"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${t.color}16`, color: t.color }}
                >
                  <CategoryIcon iconName={t.icon} className="h-4 w-4" />
                </div>
                <span className="w-16 shrink-0 tabular-nums text-muted">{formatTimeLabel(t.startTime)}</span>
                <span className="font-medium tracking-[-0.01em]">{t.title}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
