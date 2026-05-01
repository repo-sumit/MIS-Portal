"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import {
  CheckCircle2,
  Info,
  TriangleAlert,
  XCircle,
  X
} from "lucide-react";
import type { ToastEntry, ToastTone } from "@/lib/types";

interface ToastContextValue {
  push: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TONE_STYLES: Record<ToastTone, { icon: ReactNode; cls: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-success-ink" aria-hidden />,
    cls: "border-success/30 bg-success-50"
  },
  info: {
    icon: <Info className="h-5 w-5 text-info-600" aria-hidden />,
    cls: "border-info-400/40 bg-info-50"
  },
  warning: {
    icon: <TriangleAlert className="h-5 w-5 text-warning-ink" aria-hidden />,
    cls: "border-warning/30 bg-warning-50"
  },
  danger: {
    icon: <XCircle className="h-5 w-5 text-danger-ink" aria-hidden />,
    cls: "border-danger/30 bg-danger-50"
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: ToastTone = "info") => {
      idRef.current += 1;
      const id = idRef.current;
      const entry: ToastEntry = { id, message, tone };
      setToasts((prev) => [...prev, entry]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3"
      >
        {toasts.map((t) => {
          const tone = TONE_STYLES[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3 shadow-elevated animate-fade-up ${tone.cls}`}
            >
              <div className="mt-0.5 flex-shrink-0">{tone.icon}</div>
              <p className="flex-1 text-sm leading-snug text-ink">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="flex-shrink-0 rounded p-1 text-ink-muted hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
