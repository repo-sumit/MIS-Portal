import type {
  AllocationOverlayMap,
  Application,
  MeritOverlayMap,
  Session
} from "./types";
import { buildSeedApplications } from "./mock-data";

export const STORAGE_KEYS = {
  session: "hp-mis:portal-session",
  // v2 is the expanded 220-row deterministic seed (mock-data.ts). The
  // suffix ensures browsers that cached the v1 payload (32 rows) refresh
  // to the richer dataset on next visit without manual intervention.
  applications: "hp-mis:applications:v2",
  reports: "hp-mis:reports",
  merit: "hp-mis:merit",
  allocation: "hp-mis:allocation"
} as const;

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadApplications(): Application[] {
  if (!isBrowser()) return buildSeedApplications();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.applications);
    if (!raw) {
      const seeded = buildSeedApplications();
      window.localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Application[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = buildSeedApplications();
      window.localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    return buildSeedApplications();
  }
}

export function saveApplications(apps: Application[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(apps));
}

export function loadSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  if (!isBrowser()) return;
  if (session === null) {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

// ───────────────────── Merit / Allocation lifecycle ─────────────────────

export function loadMerit(): MeritOverlayMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.merit);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object" ? parsed : {}) as MeritOverlayMap;
  } catch {
    return {};
  }
}

export function saveMerit(map: MeritOverlayMap): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.merit, JSON.stringify(map));
}

export function loadAllocation(): AllocationOverlayMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.allocation);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object" ? parsed : {}) as AllocationOverlayMap;
  } catch {
    return {};
  }
}

export function saveAllocation(map: AllocationOverlayMap): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.allocation, JSON.stringify(map));
}
