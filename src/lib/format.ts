import type {
  ApplicationStatus,
  DocumentReviewStatus,
  DocumentStatus,
  ReservationCategory
} from "./types";

export function statusLabel(status: ApplicationStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "under_scrutiny":
      return "Under scrutiny";
    case "discrepancy_raised":
      return "Discrepancy raised";
    case "verified":
      return "Verified";
    case "conditional":
      return "Conditional";
    case "rejected":
      return "Rejected";
  }
}

export function statusTone(
  status: ApplicationStatus
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "verified":
      return "success";
    case "conditional":
    case "discrepancy_raised":
      return "warning";
    case "rejected":
      return "danger";
    case "under_scrutiny":
      return "info";
    default:
      return "neutral";
  }
}

export function categoryLabel(c: ReservationCategory): string {
  switch (c) {
    case "general":
      return "General";
    case "obc":
      return "OBC";
    case "sc":
      return "SC";
    case "st":
      return "ST";
    case "ews":
      return "EWS";
  }
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

export function relativeFromNow(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export function pct(numer: number, denom: number): number {
  if (denom <= 0) return 0;
  return Math.round((numer / denom) * 1000) / 10;
}

// ───────────────────── Document review status helpers ─────────────────────

/** Map storage status → normalized review status. */
export function reviewStatus(s: DocumentStatus): DocumentReviewStatus {
  switch (s) {
    case "verified":
      return "approved";
    case "rejected":
      return "rejected";
    case "discrepancy":
      return "concern_raised";
    default:
      return "pending_review";
  }
}

/** Reverse map — used when persisting from the review modal. */
export function reviewToStorage(s: DocumentReviewStatus): DocumentStatus {
  switch (s) {
    case "approved":
      return "verified";
    case "rejected":
      return "rejected";
    case "concern_raised":
      return "discrepancy";
    default:
      return "pending";
  }
}

export function reviewStatusLabel(s: DocumentReviewStatus): string {
  switch (s) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "concern_raised":
      return "Concern raised";
    default:
      return "Pending review";
  }
}

export function reviewStatusTone(
  s: DocumentReviewStatus
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "concern_raised":
      return "warning";
    default:
      return "info";
  }
}

/** Pretty file-type label for the review preview pane. */
export function mimeLabel(mime?: string): string {
  if (!mime) return "PDF / image";
  if (mime === "application/pdf") return "PDF";
  if (mime === "image/jpeg") return "JPEG";
  if (mime === "image/png") return "PNG";
  return mime.toUpperCase();
}
