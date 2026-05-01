"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  X,
  AlertCircle,
  Download
} from "lucide-react";
import { PortalFrame } from "@/components/shell/portal-frame";
import { AuthGate } from "@/components/shell/auth-gate";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, StatusPill } from "@/components/ui/badge";
import { TextInput, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { useApplications } from "@/providers/applications-provider";
import { useSession } from "@/providers/session-provider";
import { useToast } from "@/providers/toast-provider";
import { COLLEGES, COURSES, HP_DISTRICTS } from "@/lib/mock-data";
import {
  categoryLabel,
  formatDate,
  statusLabel
} from "@/lib/format";
import { getVisibleApplications, isCollegeAdmin } from "@/lib/scoping";
import type { ApplicationStatus, ReservationCategory } from "@/lib/types";

type StatusFilter = ApplicationStatus | "all";
type CategoryFilter = ReservationCategory | "all";

export default function ApplicationsPage() {
  return (
    <AuthGate>
      <PortalFrame>
        <ApplicationsView />
      </PortalFrame>
    </AuthGate>
  );
}

const STATUS_PRIORITY: Record<ApplicationStatus, number> = {
  discrepancy_raised: 0,
  submitted: 1,
  under_scrutiny: 2,
  conditional: 3,
  verified: 4,
  rejected: 5
};

function ApplicationsView() {
  const { applications } = useApplications();
  const { session } = useSession();
  const { push } = useToast();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<StatusFilter>("all");
  const [districtF, setDistrictF] = useState<string>("all");
  const [collegeF, setCollegeF] = useState<string>("all");
  const [courseF, setCourseF] = useState<string>("all");
  const [categoryF, setCategoryF] = useState<CategoryFilter>("all");
  const [exporting, setExporting] = useState(false);

  const collegeAdmin = isCollegeAdmin(session);
  const scopedApps = useMemo(
    () => getVisibleApplications(session, applications),
    [session, applications]
  );

  const missingCollegeAssignment = collegeAdmin && !session?.collegeId;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return scopedApps
      .filter((a) => {
        if (statusF !== "all" && a.status !== statusF) return false;
        if (!collegeAdmin && districtF !== "all" && a.district.toLowerCase() !== districtF) return false;
        if (!collegeAdmin && collegeF !== "all" && a.collegeId !== collegeF) return false;
        if (courseF !== "all" && a.courseId !== courseF) return false;
        if (categoryF !== "all" && a.category !== categoryF) return false;
        if (term) {
          const blob = `${a.applicationNumber} ${a.studentName} ${a.email} ${a.collegeName} ${a.courseId} ${a.courseName}`.toLowerCase();
          if (!blob.includes(term)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const pa = STATUS_PRIORITY[a.status];
        const pb = STATUS_PRIORITY[b.status];
        if (pa !== pb) return pa - pb;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [scopedApps, search, statusF, districtF, collegeF, courseF, categoryF, collegeAdmin]);

  const counts = useMemo(() => {
    return {
      pending: filtered.filter(
        (a) => a.status === "submitted" || a.status === "under_scrutiny"
      ).length,
      discrepancy: filtered.filter((a) => a.status === "discrepancy_raised").length,
      verified: filtered.filter((a) => a.status === "verified").length
    };
  }, [filtered]);

  const clearFilters = () => {
    setSearch("");
    setStatusF("all");
    setDistrictF("all");
    setCollegeF("all");
    setCourseF("all");
    setCategoryF("all");
  };

  const handleExport = () => {
    setExporting(true);
    window.setTimeout(() => {
      setExporting(false);
      const scopeNote = collegeAdmin && session?.collegeName
        ? ` for ${session.collegeName}`
        : "";
      push(
        `${filtered.length} applications exported as CSV${scopeNote} — download started.`,
        "success"
      );
    }, 600);
  };

  const filtersActive =
    statusF !== "all" ||
    (!collegeAdmin && districtF !== "all") ||
    (!collegeAdmin && collegeF !== "all") ||
    courseF !== "all" ||
    categoryF !== "all" ||
    search.trim() !== "";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            {collegeAdmin ? "Applications assigned to your college" : "Applications oversight"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            {collegeAdmin ? "Application queue" : "Statewide applications"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {collegeAdmin
              ? `Showing applications received at ${session?.collegeName ?? "your college"}.`
              : "Monitor and verify applications across all HPU-affiliated colleges."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warning" dot>
            {counts.pending} pending
          </Badge>
          <Badge tone="danger" dot>
            {counts.discrepancy} discrepancies
          </Badge>
          <Badge tone="success" dot>
            {counts.verified} verified
          </Badge>
        </div>
      </header>

      {missingCollegeAssignment ? (
        <Alert
          tone="warning"
          title="No college assigned to your account"
        >
          Contact the Directorate of Higher Education to have a college mapped
          to your College Admin profile. Until then, no applications will be
          visible.
        </Alert>
      ) : null}

      {/* Filters */}
      <Card>
        <CardHeader
          title="Filters"
          description="Refine the queue by status, district, college, course or category"
          action={
            <div className="flex items-center gap-2">
              {filtersActive ? (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<X className="h-4 w-4" />}
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                loading={exporting}
                onClick={handleExport}
              >
                Export CSV
              </Button>
            </div>
          }
        />
        <div className="grid gap-3 px-5 py-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                aria-hidden
              />
              <TextInput
                placeholder="Search by application ID, student name, college, course or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search applications"
              />
            </div>
          </div>

          <Select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value as StatusFilter)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="submitted">{statusLabel("submitted")}</option>
            <option value="under_scrutiny">{statusLabel("under_scrutiny")}</option>
            <option value="discrepancy_raised">{statusLabel("discrepancy_raised")}</option>
            <option value="verified">{statusLabel("verified")}</option>
            <option value="conditional">{statusLabel("conditional")}</option>
            <option value="rejected">{statusLabel("rejected")}</option>
          </Select>

          {!collegeAdmin ? (
            <Select
              value={districtF}
              onChange={(e) => setDistrictF(e.target.value)}
              aria-label="Filter by district"
            >
              <option value="all">All districts</option>
              {HP_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name.toLowerCase()}>
                  {d.name}
                </option>
              ))}
            </Select>
          ) : null}

          {!collegeAdmin ? (
            <Select
              value={collegeF}
              onChange={(e) => setCollegeF(e.target.value)}
              aria-label="Filter by college"
            >
              <option value="all">All colleges</option>
              {COLLEGES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          ) : null}

          <Select
            value={courseF}
            onChange={(e) => setCourseF(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="all">All courses</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={categoryF}
            onChange={(e) =>
              setCategoryF(e.target.value as CategoryFilter)
            }
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="ews">EWS</option>
          </Select>
        </div>
      </Card>

      {/* Applications result */}
      <Card>
        <CardHeader
          title={`${filtered.length} applications`}
          description="Sorted by priority — discrepancies and pending submissions first"
          action={
            filtersActive ? (
              <Badge tone="primary" dot>
                <Filter className="h-3 w-3" /> Filters active
              </Badge>
            ) : null
          }
        />
        {filtered.length === 0 ? (
          <EmptyState
            title="No applications match the current filters"
            description="Adjust the filters or clear them to see the full queue."
            icon={<AlertCircle className="h-6 w-6" aria-hidden />}
            action={
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto scrollbar-thin md:block">
              <table className="data-table w-full min-w-[820px]">
                <thead>
                  <tr>
                    <th>Application</th>
                    <th>Student</th>
                    <th>College</th>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th aria-label="Open" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className={
                        a.status === "discrepancy_raised"
                          ? "shadow-[inset_2px_0_0_theme('colors.warning.DEFAULT')]"
                          : ""
                      }
                    >
                      <td className="font-mono text-xs text-ink-muted">
                        {a.applicationNumber}
                      </td>
                      <td>
                        <div className="font-medium text-ink">
                          {a.studentName}
                        </div>
                        <div className="text-xs text-ink-muted">{a.email}</div>
                      </td>
                      <td>
                        <div className="font-medium text-ink">
                          {a.collegeName}
                        </div>
                        <div className="text-xs text-ink-muted">{a.district}</div>
                      </td>
                      <td>
                        <div className="font-medium">{a.courseId}</div>
                        <div className="text-xs text-ink-muted">{a.courseName}</div>
                      </td>
                      <td>
                        <Badge tone="neutral">{categoryLabel(a.category)}</Badge>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <StatusPill status={a.status} />
                          {a.discrepancyCount > 0 ? (
                            <span className="text-xs text-warning-ink">
                              {a.discrepancyCount} discrepancy
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="text-xs text-ink-muted">
                        {formatDate(a.submittedAt)}
                      </td>
                      <td className="text-right">
                        <Link
                          href={`/applications/${a.id}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50"
                        >
                          Open <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <ul className="divide-y divide-line-subtle md:hidden">
              {filtered.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <Link
                    href={`/applications/${a.id}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-ink-muted">
                          {a.applicationNumber}
                        </span>
                        <Badge tone="neutral">{categoryLabel(a.category)}</Badge>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-ink">
                        {a.studentName}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {a.collegeName} · {a.courseId}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusPill status={a.status} />
                        <span className="text-xs text-ink-muted">
                          {formatDate(a.submittedAt)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="mt-2 h-4 w-4 flex-shrink-0 text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}
