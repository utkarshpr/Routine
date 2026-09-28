import type { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, filter: "blur(3px)", transition: { duration: 0.2, ease: "easeInOut" } },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.99, y: 10, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 180, damping: 24, mass: 0.72 },
  },
  exit: { opacity: 0, scale: 0.99, y: 6, filter: "blur(3px)", transition: { duration: 0.18 } },
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
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const springTransition = { type: "spring", stiffness: 300, damping: 26 } as const;
