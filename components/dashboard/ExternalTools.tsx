import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EXTERNAL_TOOLS } from "@/lib/constants";

export function ExternalTools() {
  return (
    <Card>
      <CardHeader>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Workspace</p>
        <CardTitle className="mt-2 text-xl tracking-[-0.03em]">External Tools</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-3">
        {EXTERNAL_TOOLS.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-[22px] border border-white/45 bg-white/42 p-4 backdrop-blur-xl transition-colors hover:border-accent/30 hover:bg-white/62 dark:border-white/10 dark:bg-white/6 dark:hover:bg-white/8"
          >
            <div>
              <p className="text-sm font-medium">{tool.name}</p>
              <p className="mt-1 text-xs text-muted">{tool.description}</p>
            </div>
            <span className="mt-3 flex items-center gap-1 text-xs font-medium text-accent">
              Open <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
