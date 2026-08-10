"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, modalVariants } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={cn(
                    "relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-surface border border-border-strong p-6 shadow-[var(--shadow-pop)]",
                    className
                  )}
                >
                  <Dialog.Title className="sr-only">{title}</Dialog.Title>
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
