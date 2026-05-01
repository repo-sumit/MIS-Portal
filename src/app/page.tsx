"use client";

import Link from "next/link";
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
  CalendarDays
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge, StatusPill } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress";
import { useApplications } from "@/providers/applications-provider";
import { useSession } from "@/providers/session-provider";
import { HP_DISTRICTS, POLICY_ALERTS } from "@/lib/mock-data";
import { pct } from "@/lib/format";
import { useMemo } from "react";

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
  const { session } = useSession();

  const kpis = useMemo(() => {
    const total = applications.length;
    const verified = applications.filter((a) => a.status === "verified").length;
    const pending = applications.filter((a) =>
      ["submitted", "under_scrutiny"].includes(a.status)
    ).length;
    const discrepancy = applications.filter(
      (a) => a.status === "discrepancy_raised"
    ).length;
    const conditional = applications.filter((a) => a.status === "conditional").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const seatsSanctioned = 720;
    const seatsFilled = verified + conditional;
    return {
      total,
      verified,
      pending,
      discrepancy,
      conditional,
      rejected,
      seatsSanctioned,
      seatsFilled
    };
  }, [applications]);

  const districtRows = useMemo(() => {
    return HP_DISTRICTS.map((d) => {
      const inDistrict = applications.filter((a) => a.district === d.name);
      const total = inDistrict.length;
      const verified = inDistrict.filter((a) => a.status === "verified").length;
      const pending = inDistrict.filter(
        (a) => a.status === "submitted" || a.status === "under_scrutiny"
      ).length;
      const discrepancy = inDistrict.filter(
        (a) => a.status === "discrepancy_raised"
      ).length;
      return {
        name: d.name,
        total,
        verified,
        pending,
        discrepancy,
        verifiedPct: pct(verified, total || 1),
        seatFillPct: pct(verified, Math.max(total, 12))
      };
    }).sort((a, b) => b.total - a.total);
  }, [applications]);

  const lowVerify = districtRows
    .filter((r) => r.total > 0)
    .sort((a, b) => a.verifiedPct - b.verifiedPct)
    .slice(0, 3);

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
            Welcome, {session?.name?.replace(/^Dr\.\s+/, "Dr. ")}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Cycle 2026-27 · Application window open through 16 May 2026, 6:00
            PM IST
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
          value="190"
          hint="167 HPU-affiliated"
          icon={<Building2 className="h-5 w-5" />}
          tone="primary"
        />
        <Stat
          label="Total applications"
          value={hydrated ? kpis.total.toLocaleString("en-IN") : "—"}
          hint="Across all districts"
          icon={<ClipboardList className="h-5 w-5" />}
          tone="info"
        />
        <Stat
          label="Verified applications"
          value={hydrated ? kpis.verified : "—"}
          hint={`${pct(kpis.verified, kpis.total || 1)}% of total`}
          icon={<CircleCheck className="h-5 w-5" />}
          tone="success"
        />
        <Stat
          label="Pending scrutiny"
          value={hydrated ? kpis.pending : "—"}
          hint="Awaiting reviewer"
          icon={<CircleDashed className="h-5 w-5" />}
          tone="warning"
        />
        <Stat
          label="Open discrepancies"
          value={hydrated ? kpis.discrepancy : "—"}
          hint="Awaiting student response"
          icon={<TriangleAlert className="h-5 w-5" />}
          tone="danger"
        />
        <Stat
          label="Seats filled"
          value={hydrated ? `${kpis.seatsFilled}/${kpis.seatsSanctioned}` : "—"}
          hint={`${pct(kpis.seatsFilled, kpis.seatsSanctioned)}% utilisation`}
          icon={<GraduationCap className="h-5 w-5" />}
          tone="primary"
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

      {/* Two-column main */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* District performance */}
          <Card>
            <CardHeader
              title="District performance"
              description="Live verification and fill metrics across HP districts"
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
              <table className="data-table w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th>District</th>
                    <th className="text-right">Applications</th>
                    <th>Verified %</th>
                    <th className="text-right">Pending</th>
                    <th className="text-right">Discrepancies</th>
                    <th>Seat fill %</th>
                  </tr>
                </thead>
                <tbody>
                  {districtRows.map((r) => (
                    <tr key={r.name}>
                      <td className="font-medium">{r.name}</td>
                      <td className="text-right tabular-nums">{r.total}</td>
                      <td className="w-[140px]">
                        <ProgressBar
                          value={r.verifiedPct}
                          tone={
                            r.verifiedPct >= 70
                              ? "success"
                              : r.verifiedPct >= 50
                                ? "primary"
                                : "warning"
                          }
                        />
                      </td>
                      <td className="text-right tabular-nums text-warning-ink">
                        {r.pending}
                      </td>
                      <td className="text-right tabular-nums text-danger-ink">
                        {r.discrepancy}
                      </td>
                      <td className="w-[140px]">
                        <ProgressBar
                          value={r.seatFillPct}
                          tone={
                            r.seatFillPct >= 70
                              ? "success"
                              : r.seatFillPct >= 40
                                ? "primary"
                                : "warning"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent activity */}
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
              {recentActivity.map((a) => (
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
              ))}
            </ul>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="flex flex-col gap-6">
          {/* Priority insights */}
          <Card>
            <CardHeader
              title="Priority insights"
              description="Where attention is needed today"
            />
            <CardBody className="space-y-3">
              <Alert
                tone="danger"
                title="Districts with low verification"
                action={
                  <Link
                    href="/applications"
                    className="text-xs font-medium text-danger-ink hover:underline"
                  >
                    Review
                  </Link>
                }
              >
                {lowVerify
                  .map((d) => `${d.name} (${d.verifiedPct}%)`)
                  .join(" · ")}
              </Alert>
              <Alert
                tone="warning"
                title="Colleges breaching scrutiny SLA"
                action={
                  <Link
                    href="/college"
                    className="text-xs font-medium text-warning-ink hover:underline"
                  >
                    Open
                  </Link>
                }
              >
                4 colleges with applications pending over 60 hours.
              </Alert>
              <Alert tone="info" title="Courses with high vacancy">
                BCA and BBA tracks at 38% utilisation. Consider awareness
                drives in Mandi, Kullu and Kangra districts.
              </Alert>
            </CardBody>
          </Card>

          {/* Policy alerts */}
          <Card>
            <CardHeader
              title="Policy & operational alerts"
              description="Recent advisories from DHE"
            />
            <ul className="divide-y divide-line-subtle">
              {POLICY_ALERTS.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        a.severity === "danger"
                          ? "danger"
                          : a.severity === "warning"
                            ? "warning"
                            : "info"
                      }
                      dot
                    >
                      {a.severity === "danger"
                        ? "Critical"
                        : a.severity === "warning"
                          ? "Warning"
                          : "Notice"}
                    </Badge>
                    <span className="text-xs text-ink-muted">{a.timeAgo}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink">{a.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-muted">
                    {a.detail}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader title="Quick actions" />
            <CardBody className="flex flex-col gap-2">
              <Link
                href="/applications"
                className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-subtle"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary-700" />
                  Open applications queue
                </span>
                <ArrowRight className="h-4 w-4 text-ink-muted" />
              </Link>
              <Link
                href="/college"
                className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-subtle"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary-700" />
                  Switch to College Operations
                </span>
                <ArrowRight className="h-4 w-4 text-ink-muted" />
              </Link>
              <Link
                href="/reports"
                className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-subtle"
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary-700" />
                  Generate weekly report
                </span>
                <ArrowRight className="h-4 w-4 text-ink-muted" />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
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
          <li
            key={s.label}
            className="flex items-center gap-3 md:flex-1"
          >
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
