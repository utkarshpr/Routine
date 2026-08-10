import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EXTERNAL_TOOLS } from "@/lib/constants";

export function ExternalTools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>External Tools</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-3">
        {EXTERNAL_TOOLS.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-border bg-surface-2 p-4 transition-colors hover:border-accent/40"
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
