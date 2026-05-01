"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { loadApplications, saveApplications } from "@/lib/storage";
import type { Application, ApplicationStatus } from "@/lib/types";

interface ApplicationsContextValue {
  applications: Application[];
  hydrated: boolean;
  setStatus: (
    id: string,
    nextStatus: ApplicationStatus,
    options?: { actor: string; note?: string; discrepancyReason?: string }
  ) => void;
  resetSeed: () => void;
}

const ApplicationsContext = createContext<ApplicationsContextValue | undefined>(
  undefined
);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setApplications(loadApplications());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "hp-mis:applications") {
        setApplications(loadApplications());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setStatus = useCallback<ApplicationsContextValue["setStatus"]>(
    (id, nextStatus, options) => {
      setApplications((prev) => {
        const next = prev.map((app) => {
          if (app.id !== id) return app;
          const stamp = new Date().toISOString();
          const historyEntry = {
            id: `${app.id}-h-${prev.length}-${stamp}`,
            action:
              nextStatus === "verified"
                ? "Application verified"
                : nextStatus === "conditional"
                  ? "Conditional accept"
                  : nextStatus === "rejected"
                    ? "Application rejected"
                    : nextStatus === "discrepancy_raised"
                      ? "Discrepancy raised"
                      : "Status updated",
            actor: options?.actor ?? "System",
            timestamp: stamp,
            note: options?.note
          };
          return {
            ...app,
            status: nextStatus,
            discrepancyCount:
              nextStatus === "discrepancy_raised"
                ? app.discrepancyCount + 1
                : app.discrepancyCount,
            discrepancyReason:
              nextStatus === "discrepancy_raised"
                ? options?.discrepancyReason ?? app.discrepancyReason
                : app.discrepancyReason,
            history: [...app.history, historyEntry]
          };
        });
        saveApplications(next);
        return next;
      });
    },
    []
  );

  const resetSeed = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("hp-mis:applications");
    setApplications(loadApplications());
  }, []);

  const value = useMemo(
    () => ({ applications, hydrated, setStatus, resetSeed }),
    [applications, hydrated, setStatus, resetSeed]
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications(): ApplicationsContextValue {
  const ctx = useContext(ApplicationsContext);
  if (!ctx)
    throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
}
