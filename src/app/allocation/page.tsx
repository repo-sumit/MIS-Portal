"use client";

import { useMemo, useState } from "react";
import {
  GraduationCap,
  Play,
  RefreshCw,
  AlertTriangle,
  Inbox,
  Building2,
  IndianRupee
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { RoleGate } from "@/components/shell/role-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { useApplications } from "@/providers/applications-provider";
import { useSession } from "@/providers/session-provider";
import { useToast } from "@/providers/toast-provider";
import { useLifecycle } from "@/providers/lifecycle-provider";
import { buildMeritCohorts } from "@/lib/lifecycle";
import { categoryLabel, formatDateTime } from "@/lib/format";
import type { AllocationOfferStatus, CourseCode } from "@/lib/types";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <RoleGate allow={["state_admin"]}>
          <Allocation />
        </RoleGate>
      </PortalFrame>
    </AuthGate>
  );
}

function Allocation() {
  const { applications } = useApplications();
  const { session } = useSession();
  const { merit, allocation, runAllocationFor } = useLifecycle();
  const { push } = useToast();

  const [pendingCourse, setPendingCourse] = useState<CourseCode | null>(null);
  const [activeCourse, setActiveCourse] = useState<CourseCode | null>(null);

  const cohorts = useMemo(() => buildMeritCohorts(applications), [applications]);

  const totals = useMemo(() => {
    const meritPublished = Object.keys(merit).length;
    const runs = Object.keys(allocation).length;
    const seatsOffered = Object.values(allocation).reduce(
      (acc, o) => acc + (o?.seatsOffered ?? 0),
      0
    );
    return { meritPublished, runs, seatsOffered };
  }, [merit, allocation]);

  const onRun = (courseId: CourseCode, courseName: string) => {
    setPendingCourse(courseId);
    window.setTimeout(() => {
      const overlay = runAllocationFor(courseId, session?.name ?? "DHE Officer");
      setPendingCourse(null);
      setActiveCourse(courseId);
      if (overlay) {
        push(
          `Round ${overlay.roundNumber} allocation completed for ${courseName} — ${overlay.seatsOffered} seats offered.`,
          "success"
        );
      } else {
        push(
          `Cannot run allocation for ${courseName} — publish merit first.`,
          "danger"
        );
      }
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            Seat allocation
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            Cycle 2026-27 — Allocation rounds
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Run first-preference allocation per course using the published
            merit list. Re-run a round to incorporate fresh declines or
            additional vacancies.
          </p>
        </div>
        <Badge tone={totals.runs > 0 ? "success" : "neutral"} dot>
          {totals.runs} of {cohorts.length} courses allocated
        </Badge>
      </header>

      {/* Summary strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Courses in cycle"
          value={cohorts.length}
          tone="primary"
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <Stat
          label="Merit published"
          value={totals.meritPublished}
          tone="info"
          icon={<RefreshCw className="h-5 w-5" />}
        />
        <Stat
          label="Allocation runs"
          value={totals.runs}
          tone="success"
          icon={<Play className="h-5 w-5" />}
        />
        <Stat
          label="Seats offered"
          value={totals.seatsOffered}
          tone="primary"
          icon={<Building2 className="h-5 w-5" />}
        />
      </section>

      {totals.meritPublished === 0 ? (
        <Alert
          tone="warning"
          title="Publish merit before running allocation"
        >
          Allocation cannot proceed without a published merit list. Open the
          Merit page to compile and publish course-wise rankings.
        </Alert>
      ) : null}

      {/* Course cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {cohorts.map((c) => {
          const m = merit[c.courseId];
          const overlay = allocation[c.courseId];
          const pending = pendingCourse === c.courseId;
          const expanded = activeCourse === c.courseId;
          const meritPublished = !!m;
          return (
            <Card key={c.courseId}>
              <CardHeader
                title={`${c.courseId} — ${c.courseName}`}
                description={
                  overlay
                    ? `Round ${overlay.roundNumber} run ${formatDateTime(overlay.runAt)} by ${overlay.runBy}`
                    : meritPublished
                      ? `Merit published with ${m.candidatesCount} ranked candidates`
                      : "Merit not yet published"
                }
                eyebrow={
                  meritPublished
                    ? `${m.candidatesCount} ranked`
                    : "Awaiting merit"
                }
                action={
                  overlay ? (
                    <Badge tone="success" dot>
                      Round {overlay.roundNumber}
                    </Badge>
                  ) : meritPublished ? (
                    <Badge tone="info" dot>
                      Ready to run
                    </Badge>
                  ) : (
                    <Badge tone="warning" dot>
                      Blocked
                    </Badge>
                  )
                }
              />
              <CardBody className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                  {overlay ? (
                    <>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" /> {overlay.seatsOffered}{" "}
                        seats offered
                      </span>
                      <span className="flex items-center gap-1.5">
                        <IndianRupee className="h-4 w-4" /> ₹
                        {overlay.entries[0]?.feeAmount.toLocaleString("en-IN") ??
                          "—"}{" "}
                        per offer
                      </span>
                    </>
                  ) : meritPublished ? (
                    <span className="flex items-center gap-1.5">
                      Allocator will use first-preference colleges from the
                      merit list.
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-warning-ink">
                      <AlertTriangle className="h-4 w-4" /> Publish merit on the
                      Merit page first.
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={overlay ? "outline" : "primary"}
                    size="sm"
                    leftIcon={
                      overlay ? (
                        <RefreshCw className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )
                    }
                    loading={pending}
                    disabled={pending || !meritPublished}
                    onClick={() => onRun(c.courseId, c.courseName)}
                  >
                    {pending
                      ? overlay
                        ? `Re-running round ${overlay.roundNumber + 1}`
                        : "Running round 1"
                      : overlay
                        ? `Re-run round ${overlay.roundNumber + 1}`
                        : "Run allocation"}
                  </Button>

                  {overlay ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setActiveCourse((prev) =>
                          prev === c.courseId ? null : c.courseId
                        )
                      }
                    >
                      {expanded ? "Hide allocation table" : "Show allocation table"}
                    </Button>
                  ) : null}
                </div>

                {!overlay && !meritPublished ? (
                  <EmptyState
                    title="Allocation not run"
                    description="Run is disabled until merit has been published for this course."
                    icon={<Inbox className="h-6 w-6" aria-hidden />}
                  />
                ) : null}

                {overlay && expanded ? (
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="data-table w-full min-w-[820px] table-fixed">
                      <colgroup>
                        <col className="w-[8%]" />
                        <col className="w-[22%]" />
                        <col className="w-[10%]" />
                        <col className="w-[24%]" />
                        <col className="w-[12%]" />
                        <col className="w-[12%]" />
                        <col className="w-[12%]" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="text-right">Rank</th>
                          <th>Student</th>
                          <th>Course</th>
                          <th>Offered college</th>
                          <th>Category</th>
                          <th className="text-right">Fee</th>
                          <th>Offer status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overlay.entries.slice(0, 20).map((e) => (
                          <tr key={e.applicationId}>
                            <td className="text-right font-semibold tabular-nums">
                              {e.rank}
                            </td>
                            <td>
                              <div className="font-medium text-ink">
                                {e.studentName}
                              </div>
                              <div className="font-mono text-[11px] text-ink-muted">
                                {e.applicationNumber}
                              </div>
                            </td>
                            <td>{c.courseId}</td>
                            <td className="text-ink-muted">
                              {e.offeredCollegeName ?? "—"}
                            </td>
                            <td>
                              <Badge tone="neutral">
                                {categoryLabel(e.category)}
                              </Badge>
                            </td>
                            <td className="text-right tabular-nums">
                              ₹{e.feeAmount.toLocaleString("en-IN")}
                            </td>
                            <td>
                              <OfferBadge status={e.offerStatus} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {overlay.entries.length > 20 ? (
                      <p className="border-t border-line-subtle px-4 py-2 text-xs text-ink-muted">
                        Showing top 20 of {overlay.entries.length} allocated
                        rows. Full list available in the export.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OfferBadge({ status }: { status: AllocationOfferStatus }) {
  if (status === "offered")
    return (
      <Badge tone="success" dot>
        Offered
      </Badge>
    );
  if (status === "freeze")
    return (
      <Badge tone="info" dot>
        Frozen
      </Badge>
    );
  if (status === "float")
    return (
      <Badge tone="info" dot>
        Floating
      </Badge>
    );
  if (status === "decline")
    return (
      <Badge tone="warning" dot>
        Declined
      </Badge>
    );
  return (
    <Badge tone="danger" dot>
      No seat
    </Badge>
  );
}
