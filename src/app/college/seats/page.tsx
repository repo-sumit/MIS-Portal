"use client";

import { useMemo, useState } from "react";
import {
  Download,
  ShieldCheck,
  Info,
  CheckCircle2,
  TriangleAlert
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/providers/toast-provider";
import { useSession } from "@/providers/session-provider";
import { COLLEGES, SEAT_MATRIX } from "@/lib/mock-data";

export default function Page() {
  return (
    <AuthGate>
      <PortalFrame>
        <SeatMatrix />
      </PortalFrame>
    </AuthGate>
  );
}

function SeatMatrix() {
  const { push } = useToast();
  const { session } = useSession();
  const [exporting, setExporting] = useState(false);

  const collegeId = session?.collegeId ?? "gc-sanjauli";
  const college = COLLEGES.find((c) => c.id === collegeId) ?? COLLEGES[0];

  const totals = SEAT_MATRIX.reduce(
    (acc, r) => {
      acc.sanctioned += r.sanctioned;
      acc.GEN += r.GEN;
      acc.OBC += r.OBC;
      acc.SC += r.SC;
      acc.ST += r.ST;
      acc.EWS += r.EWS;
      acc.PwD += r.PwD;
      acc.SGC += r.SGC;
      return acc;
    },
    { sanctioned: 0, GEN: 0, OBC: 0, SC: 0, ST: 0, EWS: 0, PwD: 0, SGC: 0 }
  );

  const mismatchCount = useMemo(
    () =>
      SEAT_MATRIX.filter(
        (r) =>
          r.GEN + r.OBC + r.SC + r.ST + r.EWS + r.PwD + r.SGC !== r.sanctioned
      ).length,
    []
  );

  const handleExport = () => {
    setExporting(true);
    window.setTimeout(() => {
      setExporting(false);
      push(`Seat matrix exported for ${college.name}.`, "success");
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            Seat matrix
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">{college.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {college.district} · AISHE {college.aisheCode} · Approved seat plan
            for cycle 2026-27
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success" dot>
            <ShieldCheck className="h-3 w-3" /> Approved by DHE
          </Badge>
          <Button
            variant="primary"
            leftIcon={<Download className="h-4 w-4" />}
            loading={exporting}
            onClick={handleExport}
          >
            Download matrix
          </Button>
        </div>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sanctioned seats" value={totals.sanctioned} tone="primary" />
        <Stat label="BA combinations" value={2} tone="info" />
        <Stat label="BSc combinations" value={2} tone="info" />
        <Stat label="UG courses offered" value={SEAT_MATRIX.length} tone="success" />
      </section>

      {/* Validation alert */}
      {mismatchCount > 0 ? (
        <Alert
          tone="warning"
          title="Seat split validation"
        >
          {mismatchCount} {mismatchCount === 1 ? "row needs" : "rows need"} review —
          the category-wise total does not match the sanctioned intake. Yellow
          badges in the “Category total” column flag the mismatched rows. The
          sanctioned figure is the approved DHE total; the category split
          must add up to the same number.
        </Alert>
      ) : (
        <Alert tone="success" title="Seat split is consistent">
          For every course, the sum of category-wise seats equals the
          sanctioned intake. No reconciliation needed.
        </Alert>
      )}

      {/* Matrix */}
      <Card>
        <CardHeader
          title="Course-wise seat matrix"
          description="Sanctioned (approved intake) compared with the category-wise allocation. Each yellow badge marks a row where the two totals do not agree."
          action={
            <span className="hidden items-center gap-3 text-[11px] text-ink-muted sm:inline-flex">
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-success"
                />
                Match
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-warning"
                />
                Mismatch
              </span>
            </span>
          }
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="data-table w-full min-w-[960px]">
            <thead>
              <tr>
                <th className="min-w-[260px]">Course / track</th>
                <th className="text-right">
                  <span className="inline-flex flex-col items-end">
                    <span>Sanctioned</span>
                    <span className="text-[10px] font-normal normal-case tracking-normal text-ink-muted">
                      Approved intake
                    </span>
                  </span>
                </th>
                <th className="text-right">GEN</th>
                <th className="text-right">OBC</th>
                <th className="text-right">SC</th>
                <th className="text-right">ST</th>
                <th className="text-right">EWS</th>
                <th className="text-right">PwD</th>
                <th className="text-right">SGC</th>
                <th className="text-right">
                  <span className="inline-flex flex-col items-end">
                    <span>Category total</span>
                    <span className="text-[10px] font-normal normal-case tracking-normal text-ink-muted">
                      Sum of categories
                    </span>
                  </span>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SEAT_MATRIX.map((r) => {
                const sum = r.GEN + r.OBC + r.SC + r.ST + r.EWS + r.PwD + r.SGC;
                const mismatch = sum !== r.sanctioned;
                return (
                  <tr key={r.course}>
                    <td className="font-medium text-ink">{r.course}</td>
                    <td className="text-right tabular-nums">{r.sanctioned}</td>
                    <td className="text-right tabular-nums">{r.GEN}</td>
                    <td className="text-right tabular-nums">{r.OBC}</td>
                    <td className="text-right tabular-nums">{r.SC}</td>
                    <td className="text-right tabular-nums">{r.ST}</td>
                    <td className="text-right tabular-nums">{r.EWS}</td>
                    <td className="text-right tabular-nums">{r.PwD}</td>
                    <td className="text-right tabular-nums">{r.SGC}</td>
                    <td className="text-right tabular-nums">
                      {mismatch ? (
                        <span
                          title={`Category-wise total (${sum}) does not match sanctioned seats (${r.sanctioned}). Diff: ${sum - r.sanctioned > 0 ? "+" : ""}${sum - r.sanctioned}.`}
                        >
                          <Badge tone="warning">
                            {sum} ≠ {r.sanctioned}
                          </Badge>
                        </span>
                      ) : (
                        <span title="Category-wise total matches sanctioned seats">
                          {sum}
                        </span>
                      )}
                    </td>
                    <td>
                      {mismatch ? (
                        <Badge tone="warning" dot>
                          <TriangleAlert className="mr-1 h-3 w-3" /> Review
                        </Badge>
                      ) : (
                        <Badge tone="success" dot>
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Match
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-line bg-surface-subtle">
                <td className="font-semibold">Total</td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.sanctioned}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.GEN}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.OBC}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.SC}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.ST}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.EWS}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.PwD}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.SGC}
                </td>
                <td className="text-right font-semibold tabular-nums">
                  {totals.GEN +
                    totals.OBC +
                    totals.SC +
                    totals.ST +
                    totals.EWS +
                    totals.PwD +
                    totals.SGC}
                </td>
                <td>
                  {totals.GEN +
                    totals.OBC +
                    totals.SC +
                    totals.ST +
                    totals.EWS +
                    totals.PwD +
                    totals.SGC ===
                  totals.sanctioned ? (
                    <Badge tone="success" dot>
                      Match
                    </Badge>
                  ) : (
                    <Badge tone="warning" dot>
                      Review
                    </Badge>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t border-line-subtle bg-surface-muted px-5 py-3 text-xs leading-relaxed text-ink-muted">
          <p className="mb-1 font-semibold text-ink">How to read this table</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <span className="font-medium text-ink">Sanctioned</span> — the
              approved total intake for the course as released by DHE.
            </li>
            <li>
              <span className="font-medium text-ink">Category total</span> —
              the sum of GEN + OBC + SC + ST + EWS + PwD + SGC seats for the
              same course.
            </li>
            <li>
              A yellow{" "}
              <Badge tone="warning" className="mx-0.5 align-middle">
                130 ≠ 120
              </Badge>{" "}
              badge means the category-wise total is 130 but the sanctioned
              intake is 120 — the row needs reconciliation before merit.
            </li>
            <li>
              A green{" "}
              <Badge tone="success" className="mx-0.5 align-middle" dot>
                Match
              </Badge>{" "}
              status confirms the two totals agree and the row is ready.
            </li>
          </ul>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="College information" />
          <CardBody className="space-y-2 text-sm">
            <Row label="College name" value={college.name} />
            <Row label="AISHE code" value={college.aisheCode} />
            <Row label="District" value={college.district} />
            <Row label="College type" value={college.type} />
            <Row label="Principal" value={college.principal} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Category legend" />
          <CardBody className="flex flex-wrap gap-2">
            {[
              { code: "GEN", label: "General" },
              { code: "OBC", label: "Other Backward Classes" },
              { code: "SC", label: "Scheduled Castes" },
              { code: "ST", label: "Scheduled Tribes" },
              { code: "EWS", label: "Economically Weaker Sections" },
              { code: "PwD", label: "Persons with Disability" },
              { code: "SGC", label: "Single Girl Child" }
            ].map((c) => (
              <span
                key={c.code}
                className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm"
              >
                <Badge tone="primary">{c.code}</Badge>
                <span className="text-ink-muted">{c.label}</span>
              </span>
            ))}
            <p className="mt-2 flex items-start gap-2 text-xs text-ink-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              Category limits follow the HP reservation roster as amended by
              DHE circular 2026/121.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line-subtle py-2 last:border-b-0">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
