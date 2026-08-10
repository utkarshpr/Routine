import { toast as sonnerToast } from "sonner";

export type ToastTone = "default" | "success" | "error";
export interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function toast(message: string, tone: ToastTone = "default", options?: ToastOptions) {
  const payload = {
    description: options?.description,
    action: options?.action,
  };

  if (tone === "success") sonnerToast.success(message, payload);
  else if (tone === "error") sonnerToast.error(message, payload);
  else sonnerToast(message, payload);
}
