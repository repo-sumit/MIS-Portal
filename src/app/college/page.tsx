"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ClipboardList,
  CircleCheck,
  TriangleAlert,
  Clock,
  Activity,
  CalendarClock,
  Building2,
  Grid3x3,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge, StatusPill } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/providers/applications-provider";
import { useSession } from "@/providers/session-provider";
import { COLLEGES } from "@/lib/mock-data";
import { categoryLabel, formatDate } from "@/lib/format";
import {
  getCollegeScopedApplications,
  isCollegeAdmin,
  isStateAdmin
} from "@/lib/scoping";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <CollegeOps />
      </PortalFrame>
    </AuthGate>
  );
}

function CollegeOps() {
  const { applications } = useApplications();
  const { session, switchRole } = useSession();

  const stateAdmin = isStateAdmin(session);
  const collegeAdmin = isCollegeAdmin(session);
  const missingCollegeAssignment = collegeAdmin && !session?.collegeId;

  // State Admin previews GC Sanjauli; College Admin sees their own.
  const previewCollegeId = "gc-sanjauli";
  const collegeId = session?.collegeId ?? (stateAdmin ? previewCollegeId : undefined);
  const college = (collegeId && COLLEGES.find((c) => c.id === collegeId)) || COLLEGES[0];

  const collegeApps = useMemo(
    () =>
      collegeId
        ? getCollegeScopedApplications(session, applications, collegeId)
        : [],
    [session, applications, collegeId]
  );

  const today = new Date().toDateString();
  const todayApps = collegeApps.filter(
    (a) => new Date(a.submittedAt).toDateString() === today
  ).length;
  const pending = collegeApps.filter((a) =>
    ["submitted", "under_scrutiny"].includes(a.status)
  );
  const discrepancies = collegeApps.filter(
    (a) => a.status === "discrepancy_raised"
  );
  const verified = collegeApps.filter((a) => a.status === "verified");

  // Queue health buckets (mocked from submission age)
  const now = Date.now();
  const slaBuckets = pending.reduce(
    (acc, a) => {
      const ageH = (now - new Date(a.submittedAt).getTime()) / 3600000;
      if (ageH > 72) acc.over72 += 1;
      else if (ageH > 48) acc.over48 += 1;
      else acc.within48 += 1;
      return acc;
    },
    { within48: 0, over48: 0, over72: 0 }
  );
  const avgHrs =
    pending.length === 0
      ? 0
      : Math.round(
          pending.reduce((acc, a) => {
            const age = (now - new Date(a.submittedAt).getTime()) / 3600000;
            return acc + age;
          }, 0) / pending.length
        );

  // Category breakdown
  const cats = ["general", "obc", "sc", "st", "ews"] as const;
  const catCounts = cats.map((c) => ({
    code: c,
    label: categoryLabel(c),
    count: collegeApps.filter((a) => a.category === c).length
  }));
  const catMax = Math.max(1, ...catCounts.map((c) => c.count));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            College Operations Centre
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">{college.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {college.district} · AISHE {college.aisheCode} · Principal{" "}
            {college.principal}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {discrepancies.length > 0 ? (
            <Badge tone="warning" dot>
              {discrepancies.length} discrepancies open
            </Badge>
          ) : null}
          {pending.length === 0 ? (
            <Badge tone="success" dot>
              Queue clear
            </Badge>
          ) : (
            <Badge tone="info" dot>
              {pending.length} pending scrutiny
            </Badge>
          )}
        </div>
      </header>

      {missingCollegeAssignment ? (
        <Alert
          tone="warning"
          title="No college assigned to your account"
        >
          Contact the Directorate of Higher Education to map a college to your
          College Admin profile. Until then, no operational data is visible.
        </Alert>
      ) : null}

      {stateAdmin ? (
        <Alert
          tone="info"
          title="State Admin preview of My college"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => switchRole("college_admin")}
            >
              Switch to College Admin
            </Button>
          }
        >
          You are viewing {college.name} as a State Admin. Switch to the
          College Admin role to act on this queue.
        </Alert>
      ) : null}

      {/* KPI strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Today's applications"
          value={todayApps}
          tone="primary"
          icon={<CalendarClock className="h-5 w-5" />}
        />
        <Stat
          label="Pending scrutiny"
          value={pending.length}
          tone="warning"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <Stat
          label="Discrepancies"
          value={discrepancies.length}
          tone="danger"
          icon={<TriangleAlert className="h-5 w-5" />}
        />
        <Stat
          label="Verified today"
          value={verified.length}
          tone="success"
          icon={<CircleCheck className="h-5 w-5" />}
        />
        <Stat
          label="Avg. queue age"
          value={`${avgHrs}h`}
          tone="info"
          icon={<Clock className="h-5 w-5" />}
        />
        <Stat
          label="Total in scope"
          value={collegeApps.length}
          tone="primary"
          icon={<Building2 className="h-5 w-5" />}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Next actions */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Next actions"
            description="Recommended for today, ranked by SLA risk"
          />
          <CardBody className="flex flex-col gap-3">
            {slaBuckets.over72 > 0 ? (
              <Alert
                tone="danger"
                title={`Clear ${slaBuckets.over72} overdue ${slaBuckets.over72 === 1 ? "case" : "cases"} first`}
                action={
                  <Link
                    href="/applications"
                    className="text-xs font-medium text-danger-ink hover:underline"
                  >
                    Open
                  </Link>
                }
              >
                Pending beyond 72-hour SLA. Resolve immediately to avoid breach.
              </Alert>
            ) : null}
            {pending.length > 0 ? (
              <Alert
                tone="warning"
                title={`Verify ${pending.length} pending ${pending.length === 1 ? "application" : "applications"}`}
                action={
                  <Link
                    href="/applications"
                    className="text-xs font-medium text-warning-ink hover:underline"
                  >
                    Open
                  </Link>
                }
              >
                Operate the scrutiny workbench from the applications queue.
              </Alert>
            ) : null}
            {discrepancies.length > 0 ? (
              <Alert
                tone="info"
                title={`${discrepancies.length} ${discrepancies.length === 1 ? "applicant is" : "applicants are"} fixing flagged items`}
              >
                Wait for the student response. Re-scrutiny opens automatically
                on resubmission.
              </Alert>
            ) : null}
            {pending.length === 0 && discrepancies.length === 0 ? (
              <Alert
                tone="success"
                title="Queue is clear and within SLA"
              >
                Excellent. No outstanding scrutiny or discrepancies.
              </Alert>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Link href="/applications">
                <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Open application queue
                </Button>
              </Link>
              <Link href="/college/seats">
                <Button variant="outline" leftIcon={<Grid3x3 className="h-4 w-4" />}>
                  Seat matrix
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Queue health */}
        <Card>
          <CardHeader title="Queue health" description="Time-in-queue distribution" />
          <CardBody className="space-y-3">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-ink">{avgHrs}h</p>
              <p className="text-sm text-ink-muted">average age of pending</p>
            </div>
            <BucketRow
              label="Within 48h"
              value={slaBuckets.within48}
              tone="success"
            />
            <BucketRow
              label="Approaching SLA (48-72h)"
              value={slaBuckets.over48}
              tone="warning"
            />
            <BucketRow
              label="Past 72h SLA"
              value={slaBuckets.over72}
              tone="danger"
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* By category */}
        <Card>
          <CardHeader title="By category" description="Reservation distribution" />
          <CardBody className="space-y-2">
            {catCounts.map((c) => (
              <div key={c.code}>
                <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
                  <span>{c.label}</span>
                  <span className="font-medium text-ink">
                    {c.count}{" "}
                    <span className="text-ink-muted">
                      · {Math.round((c.count / Math.max(1, collegeApps.length)) * 100)}%
                    </span>
                  </span>
                </div>
                <ProgressBar
                  value={Math.round((c.count / catMax) * 100)}
                  tone="primary"
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Application queue preview */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Application queue preview"
            description="Most urgent first"
            action={
              <Link
                href="/applications"
                className="text-sm font-medium text-primary-700 hover:underline"
              >
                Open queue
              </Link>
            }
          />
          {collegeApps.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-muted">
                No applications received yet for {college.name}.
              </p>
            </CardBody>
          ) : (
            <ul className="divide-y divide-line-subtle">
              {collegeApps
                .slice()
                .sort((a, b) => {
                  const order: Record<string, number> = {
                    discrepancy_raised: 0,
                    submitted: 1,
                    under_scrutiny: 2,
                    conditional: 3,
                    verified: 4,
                    rejected: 5
                  };
                  return order[a.status] - order[b.status];
                })
                .slice(0, 6)
                .map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-surface-subtle"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {a.studentName}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {a.applicationNumber} · {a.courseId} ·{" "}
                        {formatDate(a.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={a.status} />
                      <Link
                        href={`/applications/${a.id}`}
                        aria-label={`Open ${a.applicationNumber}`}
                        className="rounded-md p-1 text-ink-muted hover:bg-line-subtle hover:text-ink"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Seat matrix preview */}
      <Card>
        <CardHeader
          title="Seat matrix summary"
          description="Course-wise sanctioned and category split"
          action={
            <Link
              href="/college/seats"
              className="text-sm font-medium text-primary-700 hover:underline"
            >
              View full matrix
            </Link>
          }
        />
        <CardBody className="text-sm text-ink-muted">
          <p className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary-700" /> 7 courses · 720
            sanctioned seats · Approved by DHE
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

function BucketRow({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-ink">
        <span
          className={`h-2 w-2 rounded-full ${
            tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-danger"
          }`}
        />
        {label}
      </span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}
