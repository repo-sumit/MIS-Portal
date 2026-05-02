"use client";

import { useMemo, useState } from "react";
import {
  Trophy,
  RefreshCw,
  CheckCircle2,
  Inbox,
  Users,
  Building2
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
import type { CourseCode } from "@/lib/types";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <RoleGate allow={["state_admin"]}>
          <Merit />
        </RoleGate>
      </PortalFrame>
    </AuthGate>
  );
}

function Merit() {
  const { applications } = useApplications();
  const { session } = useSession();
  const { merit, publishMerit } = useLifecycle();
  const { push } = useToast();

  const [pendingCourse, setPendingCourse] = useState<CourseCode | null>(null);
  const [activeCourse, setActiveCourse] = useState<CourseCode | null>(null);

  const cohorts = useMemo(() => buildMeritCohorts(applications), [applications]);

  const totals = useMemo(() => {
    const verified = applications.filter((a) => a.status === "verified").length;
    const conditional = applications.filter((a) => a.status === "conditional").length;
    const pending = applications.filter(
      (a) => a.status === "submitted" || a.status === "under_scrutiny"
    ).length;
    const published = Object.keys(merit).length;
    return { verified, conditional, pending, published };
  }, [applications, merit]);

  const onPublish = (courseId: CourseCode) => {
    const cohort = cohorts.find((c) => c.courseId === courseId);
    if (!cohort || cohort.candidates.length === 0) return;
    setPendingCourse(courseId);
    window.setTimeout(() => {
      const overlay = publishMerit(cohort, session?.name ?? "DHE Officer");
      setPendingCourse(null);
      setActiveCourse(courseId);
      push(
        `Merit published for ${cohort.courseName} — ${overlay.candidatesCount} candidates ranked.`,
        "success"
      );
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            Merit publication
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            Cycle 2026-27 — Merit lists
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Compile and publish course-wise merit rankings from verified and
            conditional applications. Re-publish to incorporate fresh
            scrutiny outcomes.
          </p>
        </div>
        <Badge tone={totals.published > 0 ? "success" : "neutral"} dot>
          {totals.published} of {cohorts.length} courses published
        </Badge>
      </header>

      {/* Summary strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Courses in cycle"
          value={cohorts.length}
          tone="primary"
          icon={<Trophy className="h-5 w-5" />}
        />
        <Stat
          label="Verified applications"
          value={totals.verified}
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <Stat
          label="Awaiting scrutiny"
          value={totals.pending}
          tone="warning"
          icon={<Users className="h-5 w-5" />}
        />
        <Stat
          label="Merit published"
          value={totals.published}
          tone="info"
          icon={<RefreshCw className="h-5 w-5" />}
        />
      </section>

      {totals.verified + totals.conditional === 0 ? (
        <Alert
          tone="warning"
          title="No eligible candidates yet"
        >
          Verified or conditional applications are required before merit can
          be compiled. Clear the scrutiny backlog to build the candidate pool.
        </Alert>
      ) : null}

      {/* Course cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {cohorts.map((c) => {
          const overlay = merit[c.courseId];
          const eligible = c.candidates.length;
          const pending = pendingCourse === c.courseId;
          const expanded = activeCourse === c.courseId;
          return (
            <Card key={c.courseId}>
              <CardHeader
                title={`${c.courseId} — ${c.courseName}`}
                description={
                  overlay
                    ? `Published ${formatDateTime(overlay.publishedAt)} by ${overlay.publishedBy}`
                    : "Not yet published"
                }
                eyebrow={`${eligible} eligible`}
                action={
                  <div className="flex items-center gap-2">
                    {overlay ? (
                      <Badge tone="success" dot>
                        Published v{overlay.publishVersion}
                      </Badge>
                    ) : (
                      <Badge tone="neutral" dot>
                        Awaiting publication
                      </Badge>
                    )}
                  </div>
                }
              />
              <CardBody className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> {eligible} candidates
                  </span>
                  {overlay ? (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />{" "}
                      {new Set(
                        overlay.ranks.map((r) => r.firstPreferenceCollegeId)
                      ).size}{" "}
                      colleges in pool
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={overlay ? "outline" : "primary"}
                    size="sm"
                    leftIcon={
                      overlay ? (
                        <RefreshCw className="h-4 w-4" />
                      ) : (
                        <Trophy className="h-4 w-4" />
                      )
                    }
                    loading={pending}
                    disabled={pending || eligible === 0}
                    onClick={() => onPublish(c.courseId)}
                  >
                    {pending
                      ? overlay
                        ? "Republishing"
                        : "Publishing"
                      : overlay
                        ? "Republish merit"
                        : "Publish merit"}
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
                      {expanded ? "Hide rank table" : "Show rank table"}
                    </Button>
                  ) : null}
                </div>

                {!overlay && eligible === 0 ? (
                  <EmptyState
                    title="No verified candidates yet"
                    description="Verify applications in the scrutiny queue to build the merit pool for this course."
                    icon={<Inbox className="h-6 w-6" aria-hidden />}
                  />
                ) : null}

                {overlay && expanded ? (
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="data-table w-full min-w-[720px] table-fixed">
                      <colgroup>
                        <col className="w-[8%]" />
                        <col className="w-[15%]" />
                        <col className="w-[20%]" />
                        <col className="w-[27%]" />
                        <col className="w-[12%]" />
                        <col className="w-[8%]" />
                        <col className="w-[10%]" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="text-right">Rank</th>
                          <th>Application</th>
                          <th>Student</th>
                          <th>1st preference</th>
                          <th>Category</th>
                          <th className="text-right">Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overlay.ranks.slice(0, 20).map((r) => (
                          <tr key={r.applicationId}>
                            <td className="text-right font-semibold tabular-nums">
                              {r.rank}
                            </td>
                            <td className="font-mono text-xs text-ink-muted">
                              {r.applicationNumber}
                            </td>
                            <td className="font-medium">{r.studentName}</td>
                            <td className="text-ink-muted">
                              {r.firstPreferenceCollegeName}
                            </td>
                            <td>
                              <Badge tone="neutral">
                                {categoryLabel(r.category)}
                              </Badge>
                            </td>
                            <td className="text-right tabular-nums font-semibold">
                              {r.bofPercentage.toFixed(1)}%
                            </td>
                            <td>
                              <Badge
                                tone={
                                  r.status === "verified" ? "success" : "warning"
                                }
                                dot
                              >
                                {r.status === "verified"
                                  ? "Verified"
                                  : "Conditional"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {overlay.ranks.length > 20 ? (
                      <p className="border-t border-line-subtle px-4 py-2 text-xs text-ink-muted">
                        Showing top 20 of {overlay.ranks.length} ranked
                        candidates. Full list is available in the export.
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
