import { createContext } from "react";

export type ToastApi = {
  showToast: (message: string) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);
