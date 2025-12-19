import { useEffect } from "react";
import styles from "./Toast.module.css";

type Props = {
  message: string;
  isOpen: boolean;
  durationMs?: number;
  onClose: () => void;
};

export function Toast({ message, isOpen, durationMs = 2500, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const id = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(id);
  }, [isOpen, durationMs, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
}
