"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Building2,
  BarChart3,
  Grid3x3,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ChevronDown,
  CalendarClock,
  Trophy,
  GraduationCap,
  Landmark,
  School,
  ArrowLeftRight,
  Check
} from "lucide-react";
import { useSession } from "@/providers/session-provider";
import { useToast } from "@/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { isStateAdmin } from "@/lib/scoping";
import type { RoleCode } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match: (path: string) => boolean;
  roles: RoleCode[];
}

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p === "/",
    roles: ["state_admin"]
  },
  {
    href: "/college",
    label: "College Operations",
    icon: <Building2 className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p === "/college",
    roles: ["college_admin"]
  },
  {
    href: "/applications",
    label: "Applications",
    icon: <FileSpreadsheet className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p.startsWith("/applications"),
    roles: ["state_admin", "college_admin"]
  },
  {
    href: "/merit",
    label: "Merit",
    icon: <Trophy className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p.startsWith("/merit"),
    roles: ["state_admin"]
  },
  {
    href: "/allocation",
    label: "Allocation",
    icon: <GraduationCap className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p.startsWith("/allocation"),
    roles: ["state_admin"]
  },
  {
    href: "/college/seats",
    label: "Seat Matrix",
    icon: <Grid3x3 className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p.startsWith("/college/seats"),
    roles: ["college_admin"]
  },
  {
    href: "/reports",
    label: "Reports",
    icon: <BarChart3 className="h-[18px] w-[18px]" aria-hidden />,
    match: (p) => p.startsWith("/reports"),
    roles: ["state_admin", "college_admin"]
  }
];

export function PortalFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { session, signOut, switchRole } = useSession();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const lastUpdated = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

  const visibleNav = useMemo(() => {
    if (!session) return [];
    return NAV.filter((n) => n.roles.includes(session.role));
  }, [session]);

  const handleSignOut = () => {
    signOut();
    push("You have been signed out securely.", "info");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FA]">
      {/* Tricolor strip */}
      <div className="tricolor-strip h-1 w-full" aria-hidden />

      {/* Identity bar */}
      <div className="border-b border-line-subtle bg-white">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-3 px-4 py-2 text-xs text-ink-muted">
          <p className="hidden sm:block">
            Government of Himachal Pradesh · Directorate of Higher Education
          </p>
          <p className="sm:hidden">GoHP · DHE</p>
          <p className="hidden md:block">Last updated · {lastUpdated} IST</p>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex max-w-shell items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-surface-subtle md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/HPU_Logo.png"
              alt="Himachal Pradesh University emblem"
              width={40}
              height={40}
              priority
              className="h-9 w-9 flex-shrink-0 rounded-md object-contain"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight text-ink">
                HP Higher Education MIS
              </span>
              <span className="hidden text-[11px] leading-tight text-ink-muted sm:block">
                Department of Higher Education · Government of Himachal Pradesh
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <UserMenu
                onSwitch={switchRole}
                onSignOut={handleSignOut}
                role={session.role}
                name={session.name}
                collegeName={session.collegeName}
              />
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-md bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="mx-auto flex w-full max-w-shell flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-60 flex-shrink-0 md:block">
          <SidebarPanel
            items={visibleNav}
            pathname={pathname}
            roleLabel={
              session
                ? isStateAdmin(session)
                  ? "State Admin workspace"
                  : "College Admin workspace"
                : ""
            }
            scopeLabel={
              session
                ? isStateAdmin(session)
                  ? "Statewide oversight"
                  : session.collegeName ?? "Assigned college"
                : ""
            }
          />
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-[#F4F6FA] shadow-elevated">
            <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/HPU_Logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                <p className="text-sm font-semibold text-ink">Navigation</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-surface-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3">
              <SidebarPanel
                items={visibleNav}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
                roleLabel={
                  session
                    ? isStateAdmin(session)
                      ? "State Admin"
                      : "College Admin"
                    : ""
                }
                scopeLabel={
                  session
                    ? isStateAdmin(session)
                      ? "Statewide oversight"
                      : session.collegeName ?? "Assigned college"
                    : ""
                }
              />
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

function SidebarPanel({
  items,
  pathname,
  onNavigate,
  roleLabel,
  scopeLabel
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
  roleLabel: string;
  scopeLabel: string;
}) {
  return (
    <nav
      aria-label="Primary"
      className="md:sticky md:top-[112px] md:max-h-[calc(100vh-128px)] md:overflow-y-auto md:scrollbar-thin"
    >
      <div className="rounded-xl border border-line bg-white p-3 shadow-card">
        {/* Workspace label */}
        {roleLabel ? (
          <div className="mb-2 px-2 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-700">
              {roleLabel}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink-muted">{scopeLabel}</p>
          </div>
        ) : null}

        {/* Nav items */}
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <SidebarLink
                {...item}
                active={item.match(pathname)}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Cycle status card */}
      <CycleStatusCard />
    </nav>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
  onNavigate
}: NavItem & { active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 overflow-hidden rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#F1EDFF] text-primary-700"
          : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary-600"
        />
      ) : null}
      <span
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center ${
          active ? "text-primary-700" : "text-ink-muted"
        }`}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function CycleStatusCard() {
  return (
    <div className="mt-4 rounded-xl border border-line bg-white p-3 shadow-card">
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700"
        >
          <CalendarClock className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Cycle 2026-27
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-success ring-2 ring-success/20"
            />
            Application open
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            Closes 16 May 2026, 6:00 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}

function UserMenu({
  role,
  name,
  collegeName,
  onSwitch,
  onSignOut
}: {
  role: RoleCode;
  name: string;
  collegeName?: string;
  onSwitch: (r: RoleCode) => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<RoleCode | null>(null);

  const initials = name
    .replace(/^Dr\.\s+/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSwitch = (target: RoleCode) => {
    if (target === role || switching) return;
    setSwitching(target);
    // Brief delay so the user sees the loading state before the page reload
    window.setTimeout(() => {
      setOpen(false);
      onSwitch(target);
    }, 280);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-md border border-line bg-white px-2 pr-3 hover:bg-surface-subtle"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold leading-tight text-ink">
            {name}
          </span>
          <span className="block text-[10px] leading-tight text-ink-muted">
            {role === "state_admin" ? "State Admin" : "College Admin"}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-ink-muted" />
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-[340px] max-w-[92vw] rounded-xl border border-line bg-white p-2 shadow-elevated"
          >
            {/* Account summary */}
            <div className="border-b border-line-subtle p-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {name}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {role === "state_admin"
                      ? "Directorate of Higher Education"
                      : (collegeName ?? "Assigned college")}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge tone="primary" dot>
                      {role === "state_admin" ? "State Admin" : "College Admin"}
                    </Badge>
                    <Badge tone="success">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Role switcher */}
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">
                  Switch workspace
                </p>
                <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                  <ArrowLeftRight className="h-3 w-3" /> Demo only
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <RoleCard
                  role="state_admin"
                  active={role === "state_admin"}
                  loading={switching === "state_admin"}
                  disabled={!!switching}
                  onClick={() => handleSwitch("state_admin")}
                />
                <RoleCard
                  role="college_admin"
                  active={role === "college_admin"}
                  loading={switching === "college_admin"}
                  disabled={!!switching}
                  onClick={() => handleSwitch("college_admin")}
                />
              </div>
            </div>

            <div className="border-t border-line-subtle p-2">
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setOpen(false);
                }}
                disabled={!!switching}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-danger-ink hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function RoleCard({
  role,
  active,
  loading,
  disabled,
  onClick
}: {
  role: RoleCode;
  active: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const isState = role === "state_admin";
  const Icon = isState ? Landmark : School;
  const title = isState ? "State Admin" : "College Admin";
  const subtitle = isState
    ? "View statewide admissions, reports and lifecycle controls."
    : "Manage applications, scrutiny and seats for the assigned college.";
  const scope = isState ? "Statewide access" : "College scoped";

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onClick}
      disabled={disabled || active}
      className={`group flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
        active
          ? "border-primary-600 bg-primary-50/70"
          : "border-line bg-white hover:border-primary-300 hover:bg-primary-50/40"
      } disabled:cursor-default`}
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
          active
            ? "bg-primary-600 text-white"
            : "bg-surface-subtle text-primary-700 group-hover:bg-primary-50"
        }`}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-ink">{title}</span>
          {active ? (
            <Badge tone="primary" className="flex-shrink-0">
              <Check className="mr-0.5 h-3 w-3" /> Current
            </Badge>
          ) : loading ? (
            <span className="flex flex-shrink-0 items-center gap-1 text-[11px] font-medium text-primary-700">
              <span
                aria-hidden
                className="h-3 w-3 rounded-full border-2 border-primary-600 border-t-transparent animate-spin-slow"
              />
              Switching…
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-ink-muted">
          {subtitle}
        </span>
        <span className="mt-1.5 inline-flex">
          <Badge tone={isState ? "info" : "neutral"}>{scope}</Badge>
        </span>
      </span>
    </button>
  );
}

function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white">
      <div className="mx-auto grid max-w-shell gap-6 px-4 py-8 md:grid-cols-4">
        <FooterColumn
          title="About"
          items={[
            { label: "About the platform", href: "#" },
            { label: "Department of Higher Education", href: "#" },
            { label: "HP University", href: "#" }
          ]}
        />
        <FooterColumn
          title="Policies"
          items={[
            { label: "Privacy policy", href: "#" },
            { label: "Terms of use", href: "#" },
            { label: "Disclaimer", href: "#" },
            { label: "Hyperlinking policy", href: "#" }
          ]}
        />
        <FooterColumn
          title="Contact"
          items={[
            { label: "Helpdesk · 0177-262-XXXX", href: "#" },
            { label: "DHE Shimla", href: "#" },
            { label: "Public grievance portal", href: "#" }
          ]}
        />
        <FooterColumn
          title="Support"
          items={[
            { label: "Accessibility statement", href: "#" },
            { label: "Web information manager", href: "#" },
            { label: "Scrutiny SOP", href: "#" },
            { label: "Sitemap", href: "#" }
          ]}
        />
      </div>
      <div className="border-t border-line-subtle bg-surface-subtle">
        <div className="mx-auto flex flex-col gap-1 px-4 py-4 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © Government of Himachal Pradesh, Department of Higher Education ·
            Hosted by NIC, Shimla
          </p>
          <p>Conforms to WCAG 2.1 Level AA · Best viewed in modern browsers</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">
        {title}
      </p>
      <ul className="space-y-2 text-sm text-ink-muted">
        {items.map((it) => (
          <li key={it.label}>
            <Link href={it.href} className="hover:text-primary-700">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

