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
import {
  loadAllocation,
  loadMerit,
  saveAllocation,
  saveMerit
} from "@/lib/storage";
import {
  computeMeritRanks,
  runAllocation,
  vacantSeatsForCourse,
  type MeritCohort
} from "@/lib/lifecycle";
import { COLLEGES } from "@/lib/mock-data";
import type {
  AllocationOverlay,
  AllocationOverlayMap,
  CourseCode,
  MeritOverlay,
  MeritOverlayMap
} from "@/lib/types";

interface LifecycleContextValue {
  merit: MeritOverlayMap;
  allocation: AllocationOverlayMap;
  hydrated: boolean;
  publishMerit: (
    cohort: MeritCohort,
    actor: string
  ) => MeritOverlay;
  runAllocationFor: (
    courseId: CourseCode,
    actor: string
  ) => AllocationOverlay | null;
}

const LifecycleContext = createContext<LifecycleContextValue | undefined>(
  undefined
);

export function LifecycleProvider({ children }: { children: ReactNode }) {
  const [merit, setMerit] = useState<MeritOverlayMap>({});
  const [allocation, setAllocation] = useState<AllocationOverlayMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMerit(loadMerit());
    setAllocation(loadAllocation());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "hp-mis:merit") setMerit(loadMerit());
      if (e.key === "hp-mis:allocation") setAllocation(loadAllocation());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const publishMerit = useCallback<LifecycleContextValue["publishMerit"]>(
    (cohort, actor) => {
      const prev = merit[cohort.courseId];
      const overlay = computeMeritRanks(
        cohort,
        new Date().toISOString(),
        actor,
        (prev?.publishVersion ?? 0) + 1
      );
      const next: MeritOverlayMap = { ...merit, [cohort.courseId]: overlay };
      saveMerit(next);
      setMerit(next);
      return overlay;
    },
    [merit]
  );

  const runAllocationFor = useCallback<LifecycleContextValue["runAllocationFor"]>(
    (courseId, actor) => {
      const m = merit[courseId];
      if (!m) return null;
      const prev = allocation[courseId];
      const seats = vacantSeatsForCourse(courseId, COLLEGES);
      const overlay = runAllocation(
        m,
        seats,
        new Date().toISOString(),
        actor,
        (prev?.roundNumber ?? 0) + 1
      );
      const next: AllocationOverlayMap = {
        ...allocation,
        [courseId]: overlay
      };
      saveAllocation(next);
      setAllocation(next);
      return overlay;
    },
    [merit, allocation]
  );

  const value = useMemo(
    () => ({ merit, allocation, hydrated, publishMerit, runAllocationFor }),
    [merit, allocation, hydrated, publishMerit, runAllocationFor]
  );

  return (
    <LifecycleContext.Provider value={value}>
      {children}
    </LifecycleContext.Provider>
  );
}

export function useLifecycle(): LifecycleContextValue {
  const ctx = useContext(LifecycleContext);
  if (!ctx)
    throw new Error("useLifecycle must be used within LifecycleProvider");
  return ctx;
}
