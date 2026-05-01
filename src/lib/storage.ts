import type { Application, Session } from "./types";
import { buildSeedApplications } from "./mock-data";

export const STORAGE_KEYS = {
  session: "hp-mis:portal-session",
  applications: "hp-mis:applications",
  reports: "hp-mis:reports"
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
