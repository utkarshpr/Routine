import confetti from "canvas-confetti";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function celebrate() {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 32,
    origin: { y: 0.7 },
    colors: ["#2563eb", "#3b82f6", "#10b981", "#f59e0b"],
  });
}

export function celebrateBig() {
  if (prefersReducedMotion()) return;
  const end = Date.now() + 400;
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors: ["#2563eb", "#10b981", "#f59e0b"] });
    confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors: ["#2563eb", "#10b981", "#f59e0b"] });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
