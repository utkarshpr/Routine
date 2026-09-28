"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, ListChecks, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label, TextField } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { durationMinutes, formatDurationLabel, formatTimeLabel } from "@/lib/dates";
import { CATEGORY_META } from "@/lib/constants";
import { buildAdaptedRoutineBlueprint, buildRoutinesFromBlueprint, defaultSeedRoutines, type OnboardingGoal } from "@/lib/seed";
import { useRoutineStore } from "@/stores/routineStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { pageVariants } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { Category, Routine } from "@/types";

type Step = "intro" | "times" | "goals" | "preview";
type RoutineTemplate = "balanced" | "focus" | "recovery";

const STEPS: Step[] = ["intro", "times", "goals", "preview"];

const STEP_ICON: Record<Step, typeof Sparkles> = {
  intro: Sparkles,
  times: Clock,
  goals: Target,
  preview: ListChecks,
};

const GOAL_OPTIONS: { value: OnboardingGoal; label: string; category: Category }[] = [
  { value: "Work", label: "Work", category: "Work" },
  { value: "Learning", label: "Learning", category: "Personal" },
  { value: "Projects", label: "Personal projects", category: "Personal" },
  { value: "Fitness", label: "Fitness", category: "Gym" },
  { value: "Personal", label: "Personal time", category: "Personal" },
  { value: "Recovery", label: "Rest + recovery", category: "Sleep" },
];

function StepDots({ step }: { step: Step }) {
  const index = STEPS.indexOf(step);
  return (
    <div className="mb-6 flex items-center justify-center gap-1.5">
      {STEPS.map((s, i) => (
        <motion.span
          key={s}
          className={cn("h-1.5 rounded-full", i === index ? "bg-accent" : "bg-border-strong")}
          animate={{ width: i === index ? 24 : 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const routines = useRoutineStore((s) => s.routines);
  const removeRoutine = useRoutineStore((s) => s.remove);
  const seedRoutines = useRoutineStore((s) => s.seed);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);

  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState(settings.userName);
  const [wakeTime, setWakeTime] = useState("06:00");
  const [workStart, setWorkStart] = useState("10:00");
  const [workEnd, setWorkEnd] = useState("18:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [goals, setGoals] = useState<OnboardingGoal[]>(["Work", "Fitness", "Personal"]);
  const [template, setTemplate] = useState<RoutineTemplate>("balanced");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blueprint = useMemo(
    () =>
      step === "preview"
        ? buildAdaptedRoutineBlueprint({ wakeTime, workStart, workEnd, sleepTime, goals })
        : [],
    [step, wakeTime, workStart, workEnd, sleepTime, goals]
  );

  function toggleGoal(goal: OnboardingGoal) {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  async function applyAndFinish(destination: string, nextRoutines: Routine[] = buildRoutinesFromBlueprint(blueprint)) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await Promise.all(routines.map((r) => removeRoutine(r.id)));
    await seedRoutines(nextRoutines);
    await updateSettings({
      userName: name.trim(),
      hasOnboarded: true,
      startOfDay: wakeTime,
      defaultWorkStart: workStart,
      defaultWorkEnd: workEnd,
    });
    router.replace(destination);
  }

  const StepIcon = STEP_ICON[step];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div aria-hidden="true" className="cred-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 w-full max-w-xl">
        <Card className="border-border-strong bg-[#111212] p-5 backdrop-blur-xl sm:p-8">
          {step !== "intro" && <StepDots step={step} />}

          <motion.div key={step} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {step === "intro" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-[var(--shadow-pop)]"
                >
                  <StepIcon className="h-6 w-6" aria-hidden="true" />
                </motion.div>
                <p className="cred-label mt-6 text-muted">Welcome to Routine</p>
                <h1 className="cred-display mt-3 text-4xl sm:text-5xl">EARN YOUR DAY.</h1>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted sm:text-base sm:leading-7">A space for the things you want to make real — one honest block at a time.</p>
                <div className="mt-8 space-y-5 text-left">
                  <div>
                    <Label htmlFor="onboarding-name">Your name</Label>
                    <TextField
                      id="onboarding-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <Button size="lg" className="mt-8" onClick={() => setStep("times")} type="button">
                  Build my ritual
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => applyAndFinish("/today", defaultSeedRoutines())}
                  className="mt-4 block w-full text-sm text-muted transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Skip and use the default routine
                </button>
              </div>
            )}

            {step === "times" && (
              <div>
                <StepHeading icon={StepIcon} title="A few times to anchor your day." subtitle="You can change every block later." />
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <Label htmlFor="wake">Wake-up time</Label>
                    <TextField id="wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="sleep">Sleep time</Label>
                    <TextField id="sleep" type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="workStart">Work start</Label>
                    <TextField id="workStart" type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="workEnd">Work end</Label>
                    <TextField id="workEnd" type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
                  </div>
                </div>
                <Button size="lg" className="mt-8 w-full" onClick={() => setStep("goals")} type="button">
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}

            {step === "goals" && (
              <div>
                <StepHeading icon={StepIcon} title="What should your days make room for?" subtitle="Pick what matters right now — you can change this anytime." />
                <div className="mt-6 grid grid-cols-3 gap-2" aria-label="Routine templates">
                  {([['balanced', 'Balanced'], ['focus', 'Deep focus'], ['recovery', 'Gentle pace']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => { setTemplate(value); setGoals(value === "focus" ? ["Work", "Learning", "Projects"] : value === "recovery" ? ["Personal", "Recovery", "Fitness"] : ["Work", "Fitness", "Personal"]); }} className={cn("rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors", template === value ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2 text-muted hover:text-foreground")}>{label}</button>)}
                </div>
                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {GOAL_OPTIONS.map((option) => {
                    const active = goals.includes(option.value);
                    const meta = CATEGORY_META[option.category];
                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => toggleGoal(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm font-medium transition-colors",
                          active ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2 text-foreground"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <CategoryIcon category={option.category} className="h-4 w-4" style={{ color: meta.color }} />
                          {option.label}
                        </span>
                        {active && <Check className="h-4 w-4" aria-hidden="true" />}
                      </motion.button>
                    );
                  })}
                </div>
                <Button size="lg" className="mt-8 w-full" onClick={() => setStep("preview")} type="button">
                  Generate my routine
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}

            {step === "preview" && (
              <div>
                <StepHeading icon={StepIcon} title="Your suggested day." subtitle="Fully editable — nothing is locked in." />
                <Card className="mt-6 max-h-[55vh] overflow-y-auto border-border bg-surface-2/50 p-2 shadow-none">
                  <ul className="divide-y divide-border">
                    {blueprint.map((b, i) => (
                      <motion.li
                        key={`${b.title}-${b.startTime}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm"
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${CATEGORY_META[b.category].color}1f`, color: CATEGORY_META[b.category].color }}
                        >
                          <CategoryIcon category={b.category} className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{b.title}</p>
                          <p className="text-xs text-muted">{b.category}</p>
                        </div>
                        <div className="text-right text-xs text-muted">
                          <p>{formatTimeLabel(b.startTime)}</p>
                          <p>{formatDurationLabel(durationMinutes(b.startTime, b.endTime))}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={isSubmitting}
                    onClick={() => applyAndFinish("/schedule")}
                    type="button"
                  >
                    Customize
                  </Button>
                  <Button className="flex-1" disabled={isSubmitting} onClick={() => applyAndFinish("/today")} type="button">
                    Use this routine
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </Card>
      </div>
    </main>
  );
}

function StepHeading({ icon: Icon, title, subtitle }: { icon: typeof Sparkles; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
