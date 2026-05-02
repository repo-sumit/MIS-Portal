"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  Building2,
  CircleDashed,
  CircleCheck,
  ClipboardList,
  TriangleAlert,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  Clock,
  Users,
  TrendingUp,
  ShieldAlert,
  Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge, StatusPill } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress";
import { AreaTrend, HBar, Donut, StackedBar } from "@/components/ui/charts";
import { useApplications } from "@/providers/applications-provider";
import { useSession } from "@/providers/session-provider";
import {
  CATEGORY_DISTRIBUTION,
  COURSE_DEMAND,
  DISTRICT_METRICS,
  FY_LABEL,
  LAST_REFRESHED,
  SCRUTINY_SLA,
  STATE_ALERTS,
  STATE_TOTALS,
  WEEKLY_TREND,
  riskBand
} from "@/lib/state-dashboard-data";
import { pct } from "@/lib/format";
import { isCollegeAdmin } from "@/lib/scoping";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <Dashboard />
      </PortalFrame>
    </AuthGate>
  );
}

function Dashboard() {
  const { applications, hydrated } = useApplications();
  const { session, hydrated: sessionHydrated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionHydrated && isCollegeAdmin(session)) {
      router.replace("/college");
    }
  }, [sessionHydrated, session, router]);

  if (sessionHydrated && isCollegeAdmin(session)) return null;

  const recentActivity = useMemo(() => {
    return applications
      .slice()
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
      .slice(0, 5);
  }, [applications]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            Higher Education Command Centre
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            Statewide admission intelligence
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {FY_LABEL} · Across all HP districts and {STATE_TOTALS.affiliatedColleges}{" "}
            affiliated colleges · Refreshed {LAST_REFRESHED}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success" dot>
            Cycle on track
          </Badge>
          <Link
            href="/reports"
            className="inline-flex h-10 items-center gap-1 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink hover:bg-surface-subtle"
          >
            View reports
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </header>

      {/* KPI strip */}
      <section
        aria-label="Cycle KPIs"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
      >
        <Stat
          label="Affiliated colleges"
          value={STATE_TOTALS.affiliatedColleges}
          hint={`${STATE_TOTALS.governmentColleges} Govt · ${STATE_TOTALS.privateColleges} Private`}
          icon={<Building2 className="h-5 w-5" />}
          tone="primary"
        />
        <Stat
          label="Total applications"
          value={STATE_TOTALS.totalApplications.toLocaleString("en-IN")}
          hint="Across all 12 HP districts"
          icon={<ClipboardList className="h-5 w-5" />}
          tone="info"
        />
        <Stat
          label="Verified applications"
          value={STATE_TOTALS.verified.toLocaleString("en-IN")}
          hint={`${pct(STATE_TOTALS.verified, STATE_TOTALS.totalApplications)}% of total`}
          icon={<CircleCheck className="h-5 w-5" />}
          tone="success"
        />
        <Stat
          label="Pending scrutiny"
          value={STATE_TOTALS.pendingScrutiny.toLocaleString("en-IN")}
          hint="Awaiting reviewer"
          icon={<CircleDashed className="h-5 w-5" />}
          tone="warning"
        />
        <Stat
          label="Open discrepancies"
          value={STATE_TOTALS.discrepancies.toLocaleString("en-IN")}
          hint="Awaiting student response"
          icon={<TriangleAlert className="h-5 w-5" />}
          tone="danger"
        />
        <Stat
          label="Seats filled"
          value={`${STATE_TOTALS.seatsFilled.toLocaleString("en-IN")}/${STATE_TOTALS.seatsSanctioned.toLocaleString("en-IN")}`}
          hint={`${pct(STATE_TOTALS.seatsFilled, STATE_TOTALS.seatsSanctioned)}% utilisation`}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="primary"
        />
      </section>

      {/* Inclusion strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Female applicants"
          value={`${STATE_TOTALS.femaleShare}%`}
          hint="State average across all courses"
          icon={<Users className="h-5 w-5" />}
          tone="info"
        />
        <Stat
          label="Rural applicants"
          value={`${STATE_TOTALS.ruralShare}%`}
          hint="Domicile in rural blocks"
          icon={<Activity className="h-5 w-5" />}
          tone="success"
        />
        <Stat
          label="Demand pressure"
          value="1.31×"
          hint="Applications per sanctioned seat"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="primary"
        />
        <Stat
          label="SLA breaches"
          value={DISTRICT_METRICS.reduce((acc, d) => acc + d.slaBreaches, 0)}
          hint="Pending verification beyond 72h"
          icon={<ShieldAlert className="h-5 w-5" />}
          tone="danger"
        />
      </section>

      {/* Cycle progress strip */}
      <Card>
        <CardHeader
          title="Admission cycle status"
          description="Stage-wise progress of the 2026-27 cycle"
          eyebrow="Cycle 2026-27"
        />
        <CardBody>
          <CycleStrip />
        </CardBody>
      </Card>

      {/* Trend + Category */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Weekly applications trend"
            description="Submissions vs. verifications across the last 8 weeks"
            eyebrow="Cycle progress"
            action={
              <span className="inline-flex items-center gap-1 text-xs text-success-ink">
                <TrendingUp className="h-3.5 w-3.5" /> +12.4% w/w
              </span>
            }
          />
          <CardBody>
            <AreaTrend
              labels={WEEKLY_TREND.map((w) => w.week)}
              series={[
                {
                  key: "submitted",
                  label: "Submitted",
                  color: "#613AF5",
                  stroke: "#613AF5",
                  values: WEEKLY_TREND.map((w) => w.submitted)
                },
                {
                  key: "verified",
                  label: "Verified",
                  color: "#3C9718",
                  stroke: "#3C9718",
                  values: WEEKLY_TREND.map((w) => w.verified)
                },
                {
                  key: "discrepancies",
                  label: "Discrepancies",
                  color: "#BB772B",
                  stroke: "#BB772B",
                  values: WEEKLY_TREND.map((w) => w.discrepancies)
                }
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Category distribution"
            description="Reservation share statewide"
            eyebrow="Equity & inclusion"
            action={<PieChartIcon className="h-4 w-4 text-ink-muted" />}
          />
          <CardBody>
            <Donut
              segments={[
                { key: "general", label: "General", value: 16842, color: "#613AF5" },
                { key: "obc", label: "OBC", value: 8214, color: "#84A2F4" },
                { key: "sc", label: "SC", value: 5142, color: "#3C9718" },
                { key: "st", label: "ST", value: 1864, color: "#BB772B" },
                { key: "ews", label: "EWS", value: 2118, color: "#7E55F7" },
                { key: "pwd", label: "PwD", value: 312, color: "#5478D8" },
                { key: "sgc", label: "Single Girl Child", value: 208, color: "#9B73F8" }
              ]}
              centerLabel={STATE_TOTALS.totalApplications.toLocaleString("en-IN")}
              centerSubLabel="applications"
            />
            <p className="mt-3 text-[11px] leading-snug text-ink-muted">
              Roster source: HP reservation policy 2024 amendment · DHE
              circular 2026/121 (SGC operative this cycle).
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Course demand + SLA */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Course demand vs sanctioned seats"
            description="Applications received against approved intake"
            eyebrow="Programme demand"
          />
          <CardBody>
            <HBar
              rows={COURSE_DEMAND.map((c) => ({
                key: c.courseId,
                label: `${c.courseId} — ${c.courseName}`,
                primary: c.applications,
                secondary: c.sanctionedSeats,
                primaryLabel: "applns",
                caption: (
                  <span className="flex items-center gap-2">
                    <span className="tabular-nums">
                      {c.demandIndex.toFixed(2)}× demand
                    </span>
                    <Badge
                      tone={
                        c.fillRate >= 80
                          ? "success"
                          : c.fillRate >= 50
                            ? "warning"
                            : "danger"
                      }
                    >
                      Fill {c.fillRate}%
                    </Badge>
                  </span>
                )
              }))}
              primaryColor="#613AF5"
              secondaryColor="#84A2F4"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded bg-primary-600"
                />
                Applications received
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded bg-info-400/60"
                />
                Sanctioned seats
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Scrutiny SLA health"
            description="Pending applications by time-in-queue"
            eyebrow="Operational SLA"
          />
          <CardBody>
            <StackedBar
              totalLabel={`${(
                SCRUTINY_SLA.under24h +
                SCRUTINY_SLA.between24And48h +
                SCRUTINY_SLA.between48And72h +
                SCRUTINY_SLA.over72h
              ).toLocaleString("en-IN")} pending applications across the state`}
              segments={[
                {
                  key: "u24",
                  label: "<24h",
                  value: SCRUTINY_SLA.under24h,
                  color: "#3C9718",
                  caption: "On time"
                },
                {
                  key: "24-48",
                  label: "24-48h",
                  value: SCRUTINY_SLA.between24And48h,
                  color: "#84A2F4",
                  caption: "Watching"
                },
                {
                  key: "48-72",
                  label: "48-72h",
                  value: SCRUTINY_SLA.between48And72h,
                  color: "#BB772B",
                  caption: "At risk"
                },
                {
                  key: "o72",
                  label: ">72h",
                  value: SCRUTINY_SLA.over72h,
                  color: "#B7131A",
                  caption: "Breached"
                }
              ]}
            />
          </CardBody>
        </Card>
      </div>

      {/* District performance & insights */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="District performance & risk"
            description="Verification, fill and SLA risk across all 12 HP districts"
            action={
              <Link
                href="/applications"
                className="text-sm font-medium text-primary-700 hover:underline"
              >
                Open queue
              </Link>
            }
          />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="data-table w-full min-w-[760px]">
              <thead>
                <tr>
                  <th>District</th>
                  <th className="text-right">Applications</th>
                  <th>Verified %</th>
                  <th className="text-right">Pending</th>
                  <th className="text-right">SLA breach</th>
                  <th>Seat fill</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {DISTRICT_METRICS.map((d) => {
                  const verifiedPct = pct(d.verified, d.applications);
                  const fillPct = pct(d.seatsFilled, d.seatsSanctioned);
                  const band = riskBand(d.riskScore);
                  const tone =
                    band === "healthy"
                      ? "success"
                      : band === "watch"
                        ? "warning"
                        : "danger";
                  return (
                    <tr key={d.district}>
                      <td className="font-medium">{d.district}</td>
                      <td className="text-right tabular-nums">
                        {d.applications.toLocaleString("en-IN")}
                      </td>
                      <td className="w-[140px]">
                        <ProgressBar
                          value={verifiedPct}
                          tone={
                            verifiedPct >= 70
                              ? "success"
                              : verifiedPct >= 50
                                ? "primary"
                                : "warning"
                          }
                        />
                      </td>
                      <td className="text-right tabular-nums text-warning-ink">
                        {d.pendingScrutiny.toLocaleString("en-IN")}
                      </td>
                      <td className="text-right tabular-nums text-danger-ink">
                        {d.slaBreaches}
                      </td>
                      <td className="w-[140px]">
                        <ProgressBar
                          value={fillPct}
                          tone={
                            fillPct >= 70
                              ? "success"
                              : fillPct >= 40
                                ? "primary"
                                : "warning"
                          }
                        />
                      </td>
                      <td>
                        <Badge tone={tone} dot>
                          {band === "healthy"
                            ? "Healthy"
                            : band === "watch"
                              ? "Watch"
                              : "Critical"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right column: alerts + recent activity */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader
              title="Priority alerts"
              description="Where attention is needed today"
            />
            <ul className="divide-y divide-line-subtle">
              {STATE_ALERTS.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        a.severity === "critical"
                          ? "danger"
                          : a.severity === "warning"
                            ? "warning"
                            : "info"
                      }
                      dot
                    >
                      {a.severity === "critical"
                        ? "Critical"
                        : a.severity === "warning"
                          ? "Warning"
                          : "Notice"}
                    </Badge>
                    <span className="text-[11px] text-ink-muted">
                      {a.raisedAt}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink">{a.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-muted">
                    {a.detail}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-primary-700">
                    {a.scope}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Recent applications"
              description="Latest submissions across all colleges"
              action={
                <Link
                  href="/applications"
                  className="text-sm font-medium text-primary-700 hover:underline"
                >
                  View all
                </Link>
              }
            />
            <ul className="divide-y divide-line-subtle">
              {hydrated && recentActivity.length > 0 ? (
                recentActivity.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-surface-subtle"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {a.studentName}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {a.applicationNumber} · {a.collegeName} · {a.courseId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={a.status} />
                      <Link
                        href={`/applications/${a.id}`}
                        aria-label={`Open application ${a.applicationNumber}`}
                        className="rounded-md p-1 text-ink-muted hover:bg-line-subtle hover:text-ink"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-5 py-4 text-sm text-ink-muted">
                  Loading recent submissions…
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      {/* Action banner */}
      <Alert
        tone="info"
        title="Open the College Operations workspace to act on a specific college"
        action={
          <Link href="/college">
            <span className="inline-flex h-9 items-center gap-1 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink hover:bg-surface-subtle">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        }
      >
        State Admin can preview any college&apos;s queue, scrutiny SLA and
        seat matrix. College Admins act on the same data scoped to their
        assigned college.
      </Alert>
    </div>
  );
}

function CycleStrip() {
  const stages = [
    { label: "Application open", status: "current" as const, hint: "Closes 16 May" },
    { label: "Scrutiny in progress", status: "current" as const, hint: "Ends 22 May" },
    { label: "Merit publication", status: "upcoming" as const, hint: "26 May 2026" },
    { label: "Allocation", status: "upcoming" as const, hint: "1 Jun 2026" },
    { label: "Admission confirmed", status: "upcoming" as const, hint: "10 Jun 2026" }
  ];
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
      {stages.map((s, idx) => {
        const dotColor =
          s.status === "current"
            ? "bg-primary-600 ring-4 ring-primary-50"
            : "bg-line ring-4 ring-line-subtle";
        return (
          <li key={s.label} className="flex items-center gap-3 md:flex-1">
            <span className={`h-3 w-3 flex-shrink-0 rounded-full ${dotColor}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{s.label}</p>
              <p className="flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="h-3 w-3" /> {s.hint}
              </p>
            </div>
            {idx < stages.length - 1 ? (
              <span
                aria-hidden
                className="hidden h-px flex-1 bg-line-subtle md:block"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

