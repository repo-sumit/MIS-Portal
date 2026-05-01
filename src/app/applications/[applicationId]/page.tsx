"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  GraduationCap,
  IdCard,
  ListOrdered,
  History,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, Textarea, FieldShell } from "@/components/ui/input";
import { useApplications } from "@/providers/applications-provider";
import { useToast } from "@/providers/toast-provider";
import { useSession } from "@/providers/session-provider";
import {
  categoryLabel,
  formatDate,
  formatDateTime
} from "@/lib/format";
import type { Application, ApplicationStatus } from "@/lib/types";

type TabKey = "applicant" | "academic" | "claims" | "documents" | "preferences" | "history";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <Detail />
      </PortalFrame>
    </AuthGate>
  );
}

function Detail() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();
  const { applications, setStatus } = useApplications();
  const { push } = useToast();
  const { session } = useSession();

  const [tab, setTab] = useState<TabKey>("applicant");
  const [pending, setPending] = useState<null | "verify" | "conditional" | "reject" | "discrepancy">(
    null
  );
  const [discrepancyOpen, setDiscrepancyOpen] = useState(false);
  const [discrepancyDoc, setDiscrepancyDoc] = useState<string>("");
  const [discrepancyReason, setDiscrepancyReason] = useState("");

  const application = useMemo(
    () => applications.find((a) => a.id === params.applicationId),
    [applications, params.applicationId]
  );

  if (!application) {
    return (
      <Card>
        <CardBody>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-base font-semibold text-ink">
              Application not found
            </p>
            <p className="text-sm text-ink-muted">
              The application you are looking for does not exist or has been
              removed.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/applications")}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Back to queue
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  const commit = (
    next: ApplicationStatus,
    kind: "verify" | "conditional" | "reject" | "discrepancy",
    options?: { note?: string; discrepancyReason?: string }
  ) => {
    setPending(kind);
    window.setTimeout(() => {
      setStatus(application.id, next, {
        actor: session?.name ?? "DHE Officer",
        note: options?.note,
        discrepancyReason: options?.discrepancyReason
      });
      const messages: Record<typeof kind, { msg: string; tone: "success" | "info" | "warning" }> = {
        verify: {
          msg: `${application.studentName} has been approved.`,
          tone: "success"
        },
        conditional: {
          msg: `${application.studentName} marked as conditional accept.`,
          tone: "success"
        },
        reject: {
          msg: `${application.studentName} has been rejected.`,
          tone: "info"
        },
        discrepancy: {
          msg: `Discrepancy raised for ${application.studentName} — student notified.`,
          tone: "warning"
        }
      };
      push(messages[kind].msg, messages[kind].tone);
      setPending(null);
      if (kind !== "discrepancy") {
        router.push("/applications");
      } else {
        setDiscrepancyOpen(false);
        setDiscrepancyDoc("");
        setDiscrepancyReason("");
      }
    }, 600);
  };

  const handleDiscrepancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discrepancyDoc || !discrepancyReason.trim()) return;
    const doc = application.documents.find((d) => d.id === discrepancyDoc);
    commit("discrepancy_raised", "discrepancy", {
      note: `Discrepancy on ${doc?.label ?? "document"}: ${discrepancyReason.trim()}`,
      discrepancyReason: discrepancyReason.trim()
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-ink-muted">
        <Link href="/applications" className="hover:text-primary-700">
          Applications
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink">{application.studentName}</span>
      </nav>

      {/* Summary header */}
      <Card>
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <User className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="font-mono text-xs text-ink-muted">
                {application.applicationNumber}
              </p>
              <h1 className="mt-0.5 text-xl font-semibold text-ink">
                {application.studentName}
              </h1>
              <p className="mt-0.5 text-sm text-ink-muted">
                {application.collegeName} · {application.courseId}{" "}
                {application.courseName}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusPill status={application.status} />
                <Badge tone="neutral">{categoryLabel(application.category)}</Badge>
                {application.discrepancyCount > 0 ? (
                  <Badge tone="warning" dot>
                    {application.discrepancyCount} discrepancy
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-sm text-ink-muted">
            <span>Submitted {formatDate(application.submittedAt)}</span>
            <span>BoF: {application.academicDetails.bestOfFive}%</span>
            <span>Aadhaar: {application.aadhaarMasked}</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Tabs */}
          <Card>
            <div className="overflow-x-auto scrollbar-thin border-b border-line-subtle">
              <nav role="tablist" className="flex min-w-max">
                <Tab
                  active={tab === "applicant"}
                  onClick={() => setTab("applicant")}
                  label="Applicant"
                  icon={<User className="h-4 w-4" />}
                />
                <Tab
                  active={tab === "academic"}
                  onClick={() => setTab("academic")}
                  label="Academic"
                  icon={<GraduationCap className="h-4 w-4" />}
                />
                <Tab
                  active={tab === "claims"}
                  onClick={() => setTab("claims")}
                  label="Reservation claims"
                  icon={<ShieldCheck className="h-4 w-4" />}
                />
                <Tab
                  active={tab === "documents"}
                  onClick={() => setTab("documents")}
                  label="Documents"
                  icon={<FileText className="h-4 w-4" />}
                  badge={application.documents.length}
                />
                <Tab
                  active={tab === "preferences"}
                  onClick={() => setTab("preferences")}
                  label="Preferences"
                  icon={<ListOrdered className="h-4 w-4" />}
                  badge={application.preferences.length}
                />
                <Tab
                  active={tab === "history"}
                  onClick={() => setTab("history")}
                  label="Audit trail"
                  icon={<History className="h-4 w-4" />}
                />
              </nav>
            </div>

            <CardBody>
              {tab === "applicant" ? <ApplicantTab a={application} /> : null}
              {tab === "academic" ? <AcademicTab a={application} /> : null}
              {tab === "claims" ? <ClaimsTab a={application} /> : null}
              {tab === "documents" ? <DocumentsTab a={application} /> : null}
              {tab === "preferences" ? <PreferencesTab a={application} /> : null}
              {tab === "history" ? <HistoryTab a={application} /> : null}
            </CardBody>
          </Card>
        </div>

        {/* Action panel */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader
              title="Scrutiny actions"
              description="All actions are recorded against your sign-in."
              eyebrow="College Admin"
            />
            <CardBody className="flex flex-col gap-3">
              <Button
                variant="success"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                loading={pending === "verify"}
                disabled={
                  pending !== null ||
                  application.status === "verified" ||
                  application.status === "rejected"
                }
                onClick={() => commit("verified", "verify")}
                block
              >
                Verify application
              </Button>
              <Button
                variant="warning"
                leftIcon={<AlertTriangle className="h-4 w-4" />}
                loading={pending === "discrepancy" && !discrepancyOpen}
                disabled={
                  pending !== null ||
                  application.status === "verified" ||
                  application.status === "rejected"
                }
                onClick={() => setDiscrepancyOpen(true)}
                block
              >
                Raise discrepancy
              </Button>
              <Button
                variant="outline"
                leftIcon={<ShieldCheck className="h-4 w-4" />}
                loading={pending === "conditional"}
                disabled={
                  pending !== null ||
                  application.status === "verified" ||
                  application.status === "rejected"
                }
                onClick={() =>
                  commit("conditional", "conditional", {
                    note: "Conditional accept pending document review."
                  })
                }
                block
              >
                Conditional accept
              </Button>
              <Button
                variant="ghost"
                leftIcon={<XCircle className="h-4 w-4 text-danger-ink" />}
                loading={pending === "reject"}
                disabled={
                  pending !== null ||
                  application.status === "verified" ||
                  application.status === "rejected"
                }
                onClick={() => commit("rejected", "reject")}
                block
                className="text-danger-ink hover:bg-danger-50"
              >
                Reject application
              </Button>

              <p className="rounded-md border border-line-subtle bg-surface-subtle p-2.5 text-xs text-ink-muted">
                Scrutiny outcomes are written to the audit trail and reflected
                in the student app within seconds.
              </p>
            </CardBody>
          </Card>

          {discrepancyOpen ? (
            <Card>
              <CardHeader
                title="Raise discrepancy"
                description="Student will be notified to fix the flagged item."
              />
              <form onSubmit={handleDiscrepancy} className="flex flex-col gap-3 px-5 py-4">
                <FieldShell label="Document" required>
                  <Select
                    value={discrepancyDoc}
                    onChange={(e) => setDiscrepancyDoc(e.target.value)}
                    aria-label="Select document"
                  >
                    <option value="">Select a document</option>
                    {application.documents.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </Select>
                </FieldShell>
                <FieldShell label="Reason" hint="Visible to the student" required>
                  <Textarea
                    placeholder="e.g., Name on Class XII Marksheet does not match application form."
                    value={discrepancyReason}
                    onChange={(e) => setDiscrepancyReason(e.target.value)}
                    rows={4}
                  />
                </FieldShell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDiscrepancyOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="warning"
                    size="sm"
                    loading={pending === "discrepancy"}
                    disabled={
                      !discrepancyDoc || !discrepancyReason.trim() || pending !== null
                    }
                  >
                    Raise & notify student
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}

          <Card>
            <CardHeader
              title="Quick reference"
              description="Cycle SLA & policy notes"
            />
            <CardBody className="flex flex-col gap-2 text-sm text-ink-muted">
              <p>
                <strong className="text-ink">Verification SLA:</strong> 72
                hours from submission.
              </p>
              <p>
                <strong className="text-ink">Discrepancy response:</strong>{" "}
                Student gets up to 5 working days to resubmit documents.
              </p>
              <p>
                <strong className="text-ink">Audit log:</strong> All actions
                are signed with reviewer identity.
              </p>
              <Link
                href="/applications"
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline"
              >
                Back to queue <ArrowRight className="h-4 w-4" />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
  icon,
  badge
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      type="button"
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-primary-600 text-primary-700"
          : "border-transparent text-ink-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
      {badge !== undefined ? (
        <span
          className={`ml-1 rounded-full px-1.5 text-[10px] font-semibold ${
            active ? "bg-primary-50 text-primary-700" : "bg-line-subtle text-ink-muted"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted sm:w-44">
        {icon}
        {label}
      </span>
      <span className="text-sm text-ink">{value ?? "—"}</span>
    </div>
  );
}

function ApplicantTab({ a }: { a: Application }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Row label="Full name" value={a.studentName} icon={<User className="h-3.5 w-3.5" />} />
      <Row label="Father's name" value={a.fatherName} />
      <Row label="Date of birth" value={formatDate(a.dob)} icon={<Calendar className="h-3.5 w-3.5" />} />
      <Row label="Mobile" value={a.mobile} icon={<Phone className="h-3.5 w-3.5" />} />
      <Row label="Email" value={a.email} icon={<Mail className="h-3.5 w-3.5" />} />
      <Row label="Aadhaar" value={a.aadhaarMasked} icon={<IdCard className="h-3.5 w-3.5" />} />
      <Row label="Address" value={a.address} icon={<MapPin className="h-3.5 w-3.5" />} />
      <Row label="District" value={a.district} icon={<MapPin className="h-3.5 w-3.5" />} />
    </div>
  );
}

function AcademicTab({ a }: { a: Application }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Row label="Board" value={a.academicDetails.board} />
      <Row label="Year of passing" value={a.academicDetails.yearOfPassing} />
      <Row label="Roll number" value={a.academicDetails.rollNumber} />
      <Row label="Stream" value={a.academicDetails.stream} />
      <Row label="Best of five" value={`${a.academicDetails.bestOfFive}%`} />
      <Row label="Course applied" value={`${a.courseId} · ${a.courseName}`} />
    </div>
  );
}

function ClaimsTab({ a }: { a: Application }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Row label="Category" value={categoryLabel(a.category)} />
      <Row label="Domicile" value={a.claims.domicile} />
      <Row
        label="Persons with Disability (PwD)"
        value={a.claims.pwd ? "Yes" : "No"}
      />
      <Row label="SGC claim" value={a.claims.sgc ? "Yes" : "No"} />
    </div>
  );
}

function DocumentsTab({ a }: { a: Application }) {
  return (
    <ul className="divide-y divide-line-subtle">
      {a.documents.map((d) => (
        <li key={d.id} className="flex items-start justify-between gap-3 py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-surface-subtle text-ink-muted">
              <FileText className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{d.label}</p>
              <p className="text-xs text-ink-muted">
                Uploaded {formatDateTime(d.uploadedAt)}
              </p>
              {d.remarks ? (
                <p className="mt-1 rounded-md bg-warning-50 px-2 py-1 text-xs text-warning-ink">
                  {d.remarks}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge
              tone={
                d.status === "verified"
                  ? "success"
                  : d.status === "rejected"
                    ? "danger"
                    : d.status === "discrepancy"
                      ? "warning"
                      : "neutral"
              }
              dot
            >
              {d.status === "verified"
                ? "Verified"
                : d.status === "rejected"
                  ? "Rejected"
                  : d.status === "discrepancy"
                    ? "Discrepancy"
                    : "Pending review"}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PreferencesTab({ a }: { a: Application }) {
  return (
    <ol className="divide-y divide-line-subtle">
      {a.preferences.map((p) => (
        <li
          key={`${p.rank}-${p.collegeId}`}
          className="flex items-start gap-3 py-3"
        >
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
            {p.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{p.collegeName}</p>
            <p className="text-xs text-ink-muted">
              {p.courseId} · {p.combination}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {p.vacantSeats} vacant seats
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function HistoryTab({ a }: { a: Application }) {
  return (
    <ol className="border-l-2 border-line-subtle pl-4">
      {a.history.slice().reverse().map((h) => (
        <li key={h.id} className="relative pb-4 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-white bg-primary-600 ring-2 ring-primary-200"
          />
          <p className="text-sm font-medium text-ink">{h.action}</p>
          <p className="text-xs text-ink-muted">
            {h.actor} · {formatDateTime(h.timestamp)}
          </p>
          {h.note ? (
            <p className="mt-1 rounded-md bg-surface-subtle px-2 py-1 text-xs text-ink-muted">
              {h.note}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
