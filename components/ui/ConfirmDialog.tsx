import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
