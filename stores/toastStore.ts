import { toast as sonnerToast } from "sonner";

export type ToastTone = "default" | "success" | "error";

export function toast(message: string, tone: ToastTone = "default") {
  if (tone === "success") sonnerToast.success(message);
  else if (tone === "error") sonnerToast.error(message);
  else sonnerToast(message);
}
