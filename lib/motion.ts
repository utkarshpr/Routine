import type { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.24, ease: "easeInOut" } },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.985, y: 14, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
  },
  exit: { opacity: 0, scale: 0.99, y: 8, filter: "blur(8px)", transition: { duration: 0.18 } },
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

export const listStagger: Variants = {
  animate: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const springTransition = { type: "spring", stiffness: 300, damping: 26 } as const;
