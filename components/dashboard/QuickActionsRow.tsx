"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/uiStore";

export function QuickActionsRow({
  hasConflicts,
  onResolveConflicts,
}: {
  hasConflicts: boolean;
  onResolveConflicts: () => void;
}) {
  const router = useRouter();
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);

  return (
    <div className="flex flex-wrap gap-2.5">
      <Button variant="secondary" size="sm" onClick={() => openCommandPalette("add")} type="button">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Quick add
      </Button>
      <Button variant="secondary" size="sm" onClick={() => router.push("/focus")} type="button">
        <Target className="h-4 w-4" aria-hidden="true" />
        Focus
      </Button>
      {hasConflicts && (
        <Button variant="danger" size="sm" onClick={onResolveConflicts} type="button">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          Resolve conflicts
        </Button>
      )}
    </div>
  );
}
