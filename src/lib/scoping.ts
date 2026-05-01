import type { Application, Session } from "./types";

export function isStateAdmin(session: Session | null | undefined): boolean {
  return session?.role === "state_admin";
}

export function isCollegeAdmin(session: Session | null | undefined): boolean {
  return session?.role === "college_admin";
}

/**
 * Returns the applications a session is allowed to see.
 *
 *  - state_admin → all applications
 *  - college_admin with collegeId → only their college's applications
 *  - college_admin without collegeId → empty (caller should show a config warning)
 *  - no session → empty
 */
export function getVisibleApplications(
  session: Session | null | undefined,
  applications: Application[]
): Application[] {
  if (!session) return [];
  if (isStateAdmin(session)) return applications;
  if (isCollegeAdmin(session)) {
    if (!session.collegeId) return [];
    return applications.filter((a) => a.collegeId === session.collegeId);
  }
  return [];
}

/**
 * Always returns a single-college slice for the supplied session, regardless
 * of role. Used by the College Operations dashboard and Seat Matrix when a
 * State Admin is previewing a college.
 */
export function getCollegeScopedApplications(
  session: Session | null | undefined,
  applications: Application[],
  fallbackCollegeId?: string
): Application[] {
  const collegeId = session?.collegeId ?? fallbackCollegeId;
  if (!collegeId) return [];
  return applications.filter((a) => a.collegeId === collegeId);
}
