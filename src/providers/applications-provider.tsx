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
import { loadApplications, saveApplications, STORAGE_KEYS } from "@/lib/storage";
import { reviewToStorage } from "@/lib/format";
import type {
  Application,
  ApplicationStatus,
  DocumentReviewStatus
} from "@/lib/types";

interface DocumentReviewOptions {
  actor: string;
  note?: string;
}

interface ApplicationsContextValue {
  applications: Application[];
  hydrated: boolean;
  setStatus: (
    id: string,
    nextStatus: ApplicationStatus,
    options?: { actor: string; note?: string; discrepancyReason?: string }
  ) => void;
  /**
   * Update a single document's status, append an audit-trail entry, and
   * cascade the application status when needed (concern_raised → the
   * application is flagged as discrepancy_raised so it surfaces in the
   * queue).
   */
  setDocumentStatus: (
    applicationId: string,
    documentId: string,
    nextReviewStatus: DocumentReviewStatus,
    options: DocumentReviewOptions
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
      if (e.key === STORAGE_KEYS.applications) {
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

  const setDocumentStatus = useCallback<
    ApplicationsContextValue["setDocumentStatus"]
  >((applicationId, documentId, nextReviewStatus, options) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.id !== applicationId) return app;
        const stamp = new Date().toISOString();
        const targetDoc = app.documents.find((d) => d.id === documentId);
        if (!targetDoc) return app;

        const storageStatus = reviewToStorage(nextReviewStatus);
        const docs = app.documents.map((d) =>
          d.id === documentId
            ? {
                ...d,
                status: storageStatus,
                remarks: options.note ?? d.remarks,
                reviewNote: options.note,
                reviewedBy: options.actor,
                reviewedAt: stamp
              }
            : d
        );

        const action =
          nextReviewStatus === "approved"
            ? `Document approved · ${targetDoc.label}`
            : nextReviewStatus === "rejected"
              ? `Document rejected · ${targetDoc.label}`
              : nextReviewStatus === "concern_raised"
                ? `Concern raised · ${targetDoc.label}`
                : `Document marked pending · ${targetDoc.label}`;

        const historyEntry = {
          id: `${app.id}-doc-${documentId}-${stamp}`,
          action,
          actor: options.actor,
          timestamp: stamp,
          note: options.note
        };

        // Cascade: if the document review raised a concern, surface the
        // application in the queue as discrepancy_raised. Other actions
        // leave the application status untouched so the reviewer keeps
        // control of the whole-application outcome.
        const cascadeStatus =
          nextReviewStatus === "concern_raised" &&
          app.status !== "rejected" &&
          app.status !== "verified"
            ? "discrepancy_raised"
            : app.status;
        const cascadeDiscrepancyCount =
          nextReviewStatus === "concern_raised"
            ? app.discrepancyCount + 1
            : app.discrepancyCount;
        const cascadeReason =
          nextReviewStatus === "concern_raised" && options.note
            ? options.note
            : app.discrepancyReason;

        return {
          ...app,
          documents: docs,
          status: cascadeStatus,
          discrepancyCount: cascadeDiscrepancyCount,
          discrepancyReason: cascadeReason,
          history: [...app.history, historyEntry]
        };
      });
      saveApplications(next);
      return next;
    });
  }, []);

  const resetSeed = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEYS.applications);
    setApplications(loadApplications());
  }, []);

  const value = useMemo(
    () => ({ applications, hydrated, setStatus, setDocumentStatus, resetSeed }),
    [applications, hydrated, setStatus, setDocumentStatus, resetSeed]
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
