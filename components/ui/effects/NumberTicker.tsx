"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

function parseLeadingNumber(text: string) {
  const match = text.match(/^(-?\d+(\.\d+)?)/);
  if (!match) return null;
  const numStr = match[1];
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { number: parseFloat(numStr), decimals, suffix: text.slice(match[0].length) };
}

export function NumberTicker({ value, className }: { value: string; className?: string }) {
  const parsed = parseLeadingNumber(value);
  const motionValue = useMotionValue(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!parsed || !spanRef.current) return;
    const el = spanRef.current;
    const controls = animate(motionValue, parsed.number, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${v.toFixed(parsed.decimals)}${parsed.suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed?.number, parsed?.decimals, parsed?.suffix]);

  if (!parsed) {
    return <span className={cn(className)}>{value}</span>;
  }

  return (
    <span ref={spanRef} className={cn(className)}>
      {parsed.number.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
