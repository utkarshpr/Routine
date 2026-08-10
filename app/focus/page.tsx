"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FocusSetup } from "@/components/focus/FocusSetup";
import { FocusTimer } from "@/components/focus/FocusTimer";
import { FocusComplete } from "@/components/focus/FocusComplete";
import { useFocusStore } from "@/stores/focusStore";
import { useTaskStore } from "@/stores/taskStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/stores/toastStore";
import type { Category, FocusMode } from "@/types";

function FocusPageContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const tasks = useTaskStore((s) => s.tasks);
  const completeTask = useTaskStore((s) => s.completeTask);
  const task = tasks.find((t) => t.id === taskId) ?? null;

  const sessions = useFocusStore((s) => s.sessions);
  const activeSessionId = useFocusStore((s) => s.activeSessionId);
  const start = useFocusStore((s) => s.start);
  const pause = useFocusStore((s) => s.pause);
  const resume = useFocusStore((s) => s.resume);
  const complete = useFocusStore((s) => s.complete);
  const abandon = useFocusStore((s) => s.abandon);

  const defaultFocusMinutes = useSettingsStore((s) => s.settings.defaultFocusDurationMin);
  const defaultBreakMinutes = useSettingsStore((s) => s.settings.defaultBreakDurationMin);

  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const viewingSpecificTask = Boolean(taskId && task);
  const activeSessionMatchesTask = Boolean(
    activeSession && taskId && activeSession.taskId === taskId
  );
  const shouldShowRequestedTaskSetup = viewingSpecificTask && !activeSessionMatchesTask;
  const completedSession = sessions.find((s) => s.id === justCompletedId) ?? null;

  async function handleStart(params: { title: string; category: Category; mode: FocusMode; plannedSeconds: number }) {
    if (activeSession && shouldShowRequestedTaskSetup) {
      await abandon(activeSession.id);
    }
    await start({ taskId: task?.id ?? null, ...params });
  }

  async function handleComplete() {
    if (!activeSessionId) return;
    await complete(activeSessionId);
    if (task) {
      await completeTask(task.id);
      toast("Task marked complete", "success");
    }
    setJustCompletedId(activeSessionId);
  }

  async function handleExit() {
    if (!activeSessionId) return;
    await abandon(activeSessionId);
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.code !== "Space" || !activeSession) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      if (activeSession.status === "running") pause(activeSession.id);
      else resume(activeSession.id);
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [activeSession, pause, resume]);

  if (completedSession) {
    return <FocusComplete session={completedSession} onDone={() => setJustCompletedId(null)} />;
  }

  if (activeSession && !shouldShowRequestedTaskSetup) {
    return (
      <FocusTimer
        session={activeSession}
        onPause={() => pause(activeSession.id)}
        onResume={() => resume(activeSession.id)}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );
  }

  return (
    <FocusSetup
      task={task}
      defaultFocusMinutes={defaultFocusMinutes}
      defaultBreakMinutes={defaultBreakMinutes}
      onStart={handleStart}
    />
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={null}>
      <FocusPageContent />
    </Suspense>
  );
}
