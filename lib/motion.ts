import type { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
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
  animate: { transition: { staggerChildren: 0.04 } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const springTransition = { type: "spring", stiffness: 300, damping: 26 } as const;
