"use client";

import { useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  PieChart,
  BarChart3
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/providers/applications-provider";
import { useToast } from "@/providers/toast-provider";
import { useSession } from "@/providers/session-provider";
import { COLLEGES, HP_DISTRICTS } from "@/lib/mock-data";
import { categoryLabel, statusLabel, pct } from "@/lib/format";
import { getVisibleApplications, isCollegeAdmin } from "@/lib/scoping";
import type { ApplicationStatus, ReservationCategory } from "@/lib/types";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <Reports />
      </PortalFrame>
    </AuthGate>
  );
}

function Reports() {
  const { applications } = useApplications();
  const { session } = useSession();
  const { push } = useToast();
  const [busy, setBusy] = useState<null | "csv" | "xlsx" | "weekly">(null);

  const collegeAdmin = isCollegeAdmin(session);
  const scopedApps = useMemo(
    () => getVisibleApplications(session, applications),
    [session, applications]
  );

  const exportFile = (kind: "csv" | "xlsx" | "weekly") => {
    setBusy(kind);
    window.setTimeout(() => {
      setBusy(null);
      const scopeNote = collegeAdmin && session?.collegeName
        ? ` for ${session.collegeName}`
        : "";
      const messages: Record<typeof kind, string> = {
        csv: `Reports exported as CSV${scopeNote} — download started.`,
        xlsx: `Reports exported as XLSX${scopeNote} — download started.`,
        weekly: collegeAdmin
          ? `Weekly college report pack queued${scopeNote} — link sent to your inbox.`
          : "Weekly DHE report pack queued — link sent to your inbox."
      };
      push(messages[kind], "success");
    }, 700);
  };

  const total = scopedApps.length;
  const verified = scopedApps.filter((a) => a.status === "verified").length;
  const pending = scopedApps.filter(
    (a) => a.status === "submitted" || a.status === "under_scrutiny"
  ).length;
  const discrepancy = scopedApps.filter(
    (a) => a.status === "discrepancy_raised"
  ).length;

  const statuses: ApplicationStatus[] = [
    "submitted",
    "under_scrutiny",
    "discrepancy_raised",
    "verified",
    "conditional",
    "rejected"
  ];
  const statusBreakdown = statuses.map((s) => {
    const count = scopedApps.filter((a) => a.status === s).length;
    return { code: s, label: statusLabel(s), count, share: pct(count, total || 1) };
  });

  const categories: ReservationCategory[] = ["general", "obc", "sc", "st", "ews"];
  const categoryBreakdown = categories.map((c) => {
    const count = scopedApps.filter((a) => a.category === c).length;
    return { code: c, label: categoryLabel(c), count, share: pct(count, total || 1) };
  });

  const districtRows = useMemo(() => {
    if (collegeAdmin) return [];
    return HP_DISTRICTS.map((d) => {
      const inDistrict = scopedApps.filter((a) => a.district === d.name);
      const colleges = new Set(inDistrict.map((a) => a.collegeId)).size;
      return {
        name: d.name,
        applications: inDistrict.length,
        colleges
      };
    }).sort((a, b) => b.applications - a.applications);
  }, [scopedApps, collegeAdmin]);

  const districtMax = Math.max(1, ...districtRows.map((r) => r.applications));

  const seatFill = useMemo(() => {
    const sanctionedPerCollege = 90; // mock baseline per college
    const colleges = collegeAdmin && session?.collegeId
      ? COLLEGES.filter((c) => c.id === session.collegeId)
      : COLLEGES;
    return colleges
      .map((c) => {
        const apps = scopedApps.filter((a) => a.collegeId === c.id);
        const fill = pct(apps.length, sanctionedPerCollege);
        return {
          college: c.name,
          sanctioned: sanctionedPerCollege,
          applications: apps.length,
          fill,
          tone:
            fill > 100
              ? ("danger" as const)
              : fill >= 60
                ? ("warning" as const)
                : ("success" as const)
        };
      })
      .sort((a, b) => b.fill - a.fill)
      .slice(0, 8);
  }, [scopedApps, collegeAdmin, session?.collegeId]);

  const myCollegeName = session?.collegeName ?? "your college";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            {collegeAdmin ? "My college reports" : "Reports & analytics"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            {collegeAdmin
              ? `Cycle 2026-27 — ${myCollegeName}`
              : "Cycle 2026-27 reports"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {collegeAdmin
              ? `Status, category and seat utilisation for ${myCollegeName}. Updated in real-time from the applications register.`
              : "Status, category, district and seat utilisation breakdowns across the state. Updated in real-time from the applications register."}
          </p>
        </div>
      </header>

      {/* Export toolbar */}
      <Card>
        <CardHeader
          title="Export & circulars"
          description="Generate downloadable reports for circulation to DHE leadership."
        />
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            variant="outline"
            leftIcon={<FileSpreadsheet className="h-4 w-4" />}
            loading={busy === "csv"}
            disabled={busy !== null}
            onClick={() => exportFile("csv")}
          >
            Download CSV
          </Button>
          <Button
            variant="outline"
            leftIcon={<FileText className="h-4 w-4" />}
            loading={busy === "xlsx"}
            disabled={busy !== null}
            onClick={() => exportFile("xlsx")}
          >
            Download XLSX
          </Button>
          <Button
            variant="primary"
            leftIcon={<Download className="h-4 w-4" />}
            loading={busy === "weekly"}
            disabled={busy !== null}
            onClick={() => exportFile("weekly")}
          >
            Generate weekly report
          </Button>
          <p className="text-xs text-ink-muted">
            Exports include filters applied at the queue level. Files are
            generated in your browser and not sent to any external server.
          </p>
        </CardBody>
      </Card>

      {/* Summary strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total applications" value={total} tone="primary" />
        <Stat label="Verified" value={verified} tone="success" />
        <Stat label="Pending scrutiny" value={pending} tone="warning" />
        <Stat label="Discrepancies" value={discrepancy} tone="danger" />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Status breakdown */}
        <Card>
          <CardHeader
            title="Status breakdown"
            description="Distribution of applications by current status"
            action={<BarChart3 className="h-4 w-4 text-ink-muted" />}
          />
          <CardBody className="space-y-3">
            {statusBreakdown.map((row) => (
              <div key={row.code}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{row.label}</span>
                  <span className="text-ink-muted">
                    {row.count}{" "}
                    <span className="text-xs">· {row.share}%</span>
                  </span>
                </div>
                <ProgressBar
                  value={row.share}
                  tone={
                    row.code === "verified"
                      ? "success"
                      : row.code === "rejected" ||
                          row.code === "discrepancy_raised"
                        ? "danger"
                        : row.code === "conditional"
                          ? "warning"
                          : "primary"
                  }
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader
            title="Category breakdown"
            description="Reservation category distribution"
            action={<PieChart className="h-4 w-4 text-ink-muted" />}
          />
          <CardBody className="space-y-3">
            {categoryBreakdown.map((row) => (
              <div key={row.code}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{row.label}</span>
                  <span className="text-ink-muted">
                    {row.count}{" "}
                    <span className="text-xs">· {row.share}%</span>
                  </span>
                </div>
                <ProgressBar value={row.share} tone="primary" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {collegeAdmin ? (
          <Card>
            <CardHeader
              title="My college summary"
              description={`Snapshot for ${myCollegeName}`}
            />
            <CardBody className="grid grid-cols-2 gap-3 text-sm">
              <SummaryRow label="Total applications" value={total} />
              <SummaryRow label="Verified" value={verified} tone="success" />
              <SummaryRow label="Pending scrutiny" value={pending} tone="warning" />
              <SummaryRow
                label="Open discrepancies"
                value={discrepancy}
                tone="danger"
              />
              <SummaryRow
                label="Verified share"
                value={`${pct(verified, total || 1)}%`}
              />
              <SummaryRow
                label="Pending share"
                value={`${pct(pending, total || 1)}%`}
              />
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader
              title="District-wise application count"
              description="Applications received per HP district"
            />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="data-table w-full min-w-[480px] table-fixed">
                <colgroup>
                  <col className="w-[34%]" />
                  <col />
                  <col className="w-[16%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Distribution</th>
                    <th className="text-right">Applications</th>
                    <th className="text-right">Colleges</th>
                  </tr>
                </thead>
                <tbody>
                  {districtRows.map((d) => (
                    <tr key={d.name}>
                      <td className="font-medium">{d.name}</td>
                      <td>
                        <ProgressBar
                          value={Math.round(
                            (d.applications / districtMax) * 100
                          )}
                          tone="primary"
                        />
                      </td>
                      <td className="text-right tabular-nums">
                        {d.applications.toLocaleString("en-IN")}
                      </td>
                      <td className="text-right tabular-nums">{d.colleges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Seat fill report */}
        <Card>
          <CardHeader
            title="Seat fill utilisation"
            description={
              collegeAdmin
                ? `Applications received vs sanctioned seats — ${myCollegeName}`
                : "Applications received vs sanctioned seats per college"
            }
          />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="data-table w-full min-w-[600px] table-fixed">
              <colgroup>
                <col />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
                <col className="w-[24%]" />
              </colgroup>
              <thead>
                <tr>
                  <th>College</th>
                  <th className="text-right">Sanctioned</th>
                  <th className="text-right">Applications</th>
                  <th className="text-right">Fill</th>
                </tr>
              </thead>
              <tbody>
                {seatFill.map((row) => (
                  <tr key={row.college}>
                    <td className="truncate font-medium">{row.college}</td>
                    <td className="text-right tabular-nums">
                      {row.sanctioned.toLocaleString("en-IN")}
                    </td>
                    <td className="text-right tabular-nums">
                      {row.applications.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <span className="hidden flex-1 sm:block">
                          <ProgressBar
                            value={Math.min(100, row.fill)}
                            tone={row.tone}
                          />
                        </span>
                        <Badge tone={row.tone}>{row.fill}%</Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone
}: {
  label: string;
  value: React.ReactNode;
  tone?: "success" | "warning" | "danger";
}) {
  const valueClass =
    tone === "success"
      ? "text-success-ink"
      : tone === "warning"
        ? "text-warning-ink"
        : tone === "danger"
          ? "text-danger-ink"
          : "text-ink";
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-line bg-surface-muted px-3 py-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <span className={`text-lg font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
