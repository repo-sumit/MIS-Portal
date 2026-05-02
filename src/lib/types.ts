export type RoleCode = "state_admin" | "college_admin";

export type ApplicationStatus =
  | "submitted"
  | "under_scrutiny"
  | "discrepancy_raised"
  | "verified"
  | "conditional"
  | "rejected";

export type ReservationCategory = "general" | "obc" | "sc" | "st" | "ews";

export type CourseCode = "BA" | "BSc" | "BCom" | "BCA" | "BBA" | "BVoc";

export interface District {
  id: string;
  name: string;
}

export interface College {
  id: string;
  name: string;
  district: string;
  type: "Government" | "Government Aided" | "Private" | "Autonomous";
  aisheCode: string;
  principal: string;
}

/**
 * Storage-side document status. Kept stable so existing localStorage
 * payloads continue to deserialize cleanly. The public review surface
 * uses the normalized aliases below (see `DocumentReviewStatus`).
 */
export type DocumentStatus = "pending" | "verified" | "rejected" | "discrepancy";

/** Human-facing review state used by the document review modal. */
export type DocumentReviewStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "concern_raised";

export interface DocumentEntry {
  id: string;
  type: string;
  label: string;
  uploadedAt: string;
  status: DocumentStatus;
  remarks?: string;
  /** Optional MIME hint shown in the review preview */
  mime?: "application/pdf" | "image/jpeg" | "image/png";
  /** Reviewer note attached to the most recent action */
  reviewNote?: string;
  /** Reviewer who took the most recent action */
  reviewedBy?: string;
  /** ISO timestamp of the most recent review action */
  reviewedAt?: string;
}

export interface PreferenceEntry {
  rank: number;
  collegeId: string;
  collegeName: string;
  courseId: CourseCode;
  combination: string;
  vacantSeats: number;
}

export interface HistoryEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface AcademicDetails {
  board: string;
  yearOfPassing: number;
  rollNumber: string;
  bestOfFive: number;
  stream: "Science" | "Commerce" | "Arts";
}

export interface Claims {
  category: ReservationCategory;
  domicile: string;
  pwd: boolean;
  sgc: boolean;
}

export interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  fatherName: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  aadhaarMasked: string;
  district: string;
  collegeId: string;
  collegeName: string;
  courseId: CourseCode;
  courseName: string;
  category: ReservationCategory;
  status: ApplicationStatus;
  submittedAt: string;
  documents: DocumentEntry[];
  academicDetails: AcademicDetails;
  claims: Claims;
  preferences: PreferenceEntry[];
  history: HistoryEntry[];
  discrepancyCount: number;
  discrepancyReason?: string;
}

export interface Session {
  role: RoleCode;
  name: string;
  designation: string;
  department: string;
  email: string;
  collegeId?: string;
  collegeName?: string;
  loggedInAt: string;
}

export type ToastTone = "success" | "info" | "warning" | "danger";

export interface ToastEntry {
  id: number;
  message: string;
  tone: ToastTone;
}

// ───────────────────── Merit & Allocation lifecycle ─────────────────────

export interface MeritRankEntry {
  rank: number;
  applicationId: string;
  applicationNumber: string;
  studentName: string;
  category: ReservationCategory;
  bofPercentage: number;
  firstPreferenceCollegeId: string;
  firstPreferenceCollegeName: string;
  status: "verified" | "conditional";
}

export interface MeritOverlay {
  courseId: CourseCode;
  courseName: string;
  candidatesCount: number;
  ranks: MeritRankEntry[];
  publishedAt: string;
  publishedBy: string;
  publishVersion: number;
}

/** Keyed by CourseCode. */
export type MeritOverlayMap = Partial<Record<CourseCode, MeritOverlay>>;

export type AllocationOfferStatus =
  | "offered"
  | "freeze"
  | "float"
  | "decline"
  | "no_seat";

export interface AllocationEntry {
  rank: number;
  applicationId: string;
  applicationNumber: string;
  studentName: string;
  category: ReservationCategory;
  bofPercentage: number;
  offeredCollegeId: string | null;
  offeredCollegeName: string | null;
  feeAmount: number;
  feeStatus: "pending" | "paid" | "waived";
  offerStatus: AllocationOfferStatus;
}

export interface AllocationOverlay {
  courseId: CourseCode;
  courseName: string;
  roundNumber: number;
  runAt: string;
  runBy: string;
  seatsOffered: number;
  entries: AllocationEntry[];
}

export type AllocationOverlayMap = Partial<Record<CourseCode, AllocationOverlay>>;
