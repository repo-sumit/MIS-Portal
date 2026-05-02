import type {
  AllocationEntry,
  AllocationOverlay,
  AllocationOfferStatus,
  Application,
  CourseCode,
  MeritOverlay,
  MeritRankEntry
} from "./types";
import { COURSES, SEAT_MATRIX } from "./mock-data";

/** Course-level cohort of eligible applicants for merit. */
export interface MeritCohort {
  courseId: CourseCode;
  courseName: string;
  candidates: Application[];
}

/**
 * Group verified + conditional applications by course.
 */
export function buildMeritCohorts(applications: Application[]): MeritCohort[] {
  const eligible = applications.filter(
    (a) => a.status === "verified" || a.status === "conditional"
  );
  return COURSES.map((c) => {
    const candidates = eligible.filter((a) => a.courseId === c.id);
    return {
      courseId: c.id,
      courseName: c.name,
      candidates
    };
  });
}

const CATEGORY_PRIORITY: Record<string, number> = {
  general: 0,
  ews: 1,
  obc: 2,
  sc: 3,
  st: 4
};

/**
 * Sort + rank candidates for a single course.
 *  - primary: best-of-five percentage descending
 *  - tiebreak: date of birth ascending (older first)
 *  - tiebreak: category priority (deterministic)
 *  - tiebreak: applicationNumber ascending (deterministic final tiebreaker)
 */
export function computeMeritRanks(
  cohort: MeritCohort,
  publishedAt: string,
  publishedBy: string,
  publishVersion: number
): MeritOverlay {
  const ranked = cohort.candidates
    .slice()
    .sort((a, b) => {
      if (b.academicDetails.bestOfFive !== a.academicDetails.bestOfFive) {
        return b.academicDetails.bestOfFive - a.academicDetails.bestOfFive;
      }
      const aDob = new Date(a.dob).getTime();
      const bDob = new Date(b.dob).getTime();
      if (aDob !== bDob) return aDob - bDob;
      const ap = CATEGORY_PRIORITY[a.category] ?? 9;
      const bp = CATEGORY_PRIORITY[b.category] ?? 9;
      if (ap !== bp) return ap - bp;
      return a.applicationNumber.localeCompare(b.applicationNumber);
    })
    .map<MeritRankEntry>((a, idx) => {
      const firstPref = a.preferences[0];
      return {
        rank: idx + 1,
        applicationId: a.id,
        applicationNumber: a.applicationNumber,
        studentName: a.studentName,
        category: a.category,
        bofPercentage: a.academicDetails.bestOfFive,
        firstPreferenceCollegeId: firstPref?.collegeId ?? a.collegeId,
        firstPreferenceCollegeName: firstPref?.collegeName ?? a.collegeName,
        status: a.status === "verified" ? "verified" : "conditional"
      };
    });

  return {
    courseId: cohort.courseId,
    courseName: cohort.courseName,
    candidatesCount: ranked.length,
    ranks: ranked,
    publishedAt,
    publishedBy,
    publishVersion
  };
}

/**
 * Compute total sanctioned seats for a course across all colleges.
 * Uses SEAT_MATRIX as the per-college reference plan and assumes the same
 * matrix applies to every college (prototype simplification).
 */
export function totalSeatsForCourse(courseId: CourseCode, collegeCount: number): number {
  const courseRows = SEAT_MATRIX.filter((r) => {
    if (courseId === "BA") return r.course.startsWith("BA");
    if (courseId === "BSc") return r.course.startsWith("BSc");
    return r.course === courseId;
  });
  const sumPerCollege = courseRows.reduce((acc, r) => acc + r.sanctioned, 0);
  return Math.max(1, sumPerCollege * Math.max(1, collegeCount));
}

const FEE_BY_COURSE: Record<CourseCode, number> = {
  BA: 2400,
  BSc: 3200,
  BCom: 2800,
  BCA: 6800,
  BBA: 6200,
  BVoc: 4500
};

/**
 * Simple first-preference allocator for a single course.
 *  - Walk the merit list top-down.
 *  - Each candidate is offered their first-preference college if vacant seats remain.
 *  - When the college's seats are exhausted, candidate gets `no_seat`.
 *  - Keeps everything pure + deterministic so re-runs produce identical results.
 */
export function runAllocation(
  merit: MeritOverlay,
  vacantSeatsByCollege: Record<string, number>,
  runAt: string,
  runBy: string,
  roundNumber: number
): AllocationOverlay {
  const seats: Record<string, number> = { ...vacantSeatsByCollege };
  const courseFee = FEE_BY_COURSE[merit.courseId] ?? 3000;
  let seatsOffered = 0;

  const entries: AllocationEntry[] = merit.ranks.map((r) => {
    const collegeId = r.firstPreferenceCollegeId;
    const remaining = seats[collegeId] ?? 0;
    let offered: AllocationOfferStatus = "no_seat";
    let offeredCollegeId: string | null = null;
    let offeredCollegeName: string | null = null;
    if (remaining > 0) {
      seats[collegeId] = remaining - 1;
      offered = "offered";
      offeredCollegeId = collegeId;
      offeredCollegeName = r.firstPreferenceCollegeName;
      seatsOffered += 1;
    }
    return {
      rank: r.rank,
      applicationId: r.applicationId,
      applicationNumber: r.applicationNumber,
      studentName: r.studentName,
      category: r.category,
      bofPercentage: r.bofPercentage,
      offeredCollegeId,
      offeredCollegeName,
      feeAmount: courseFee,
      feeStatus: "pending",
      offerStatus: offered
    };
  });

  return {
    courseId: merit.courseId,
    courseName: merit.courseName,
    roundNumber,
    runAt,
    runBy,
    seatsOffered,
    entries
  };
}

/**
 * Build a per-college vacant-seats map for the supplied course based on the
 * SEAT_MATRIX baseline plan and the colleges actually appearing in candidate
 * preferences. Each college gets its baseline allocation for the course.
 */
export function vacantSeatsForCourse(
  courseId: CourseCode,
  collegesInScope: { id: string }[]
): Record<string, number> {
  const courseRows = SEAT_MATRIX.filter((r) => {
    if (courseId === "BA") return r.course.startsWith("BA");
    if (courseId === "BSc") return r.course.startsWith("BSc");
    return r.course === courseId;
  });
  const perCollege = courseRows.reduce((acc, r) => acc + r.sanctioned, 0);
  const out: Record<string, number> = {};
  for (const c of collegesInScope) {
    out[c.id] = perCollege || 30;
  }
  return out;
}
