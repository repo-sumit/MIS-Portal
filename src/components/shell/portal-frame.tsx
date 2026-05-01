"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
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
  ChevronDown
} from "lucide-react";
import { useSession } from "@/providers/session-provider";
import { useToast } from "@/providers/toast-provider";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match: (path: string) => boolean;
}

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden />,
    match: (p) => p === "/"
  },
  {
    href: "/applications",
    label: "Applications",
    icon: <FileSpreadsheet className="h-4 w-4" aria-hidden />,
    match: (p) => p.startsWith("/applications")
  },
  {
    href: "/college",
    label: "College Operations",
    icon: <Building2 className="h-4 w-4" aria-hidden />,
    match: (p) => p === "/college"
  },
  {
    href: "/college/seats",
    label: "Seat Matrix",
    icon: <Grid3x3 className="h-4 w-4" aria-hidden />,
    match: (p) => p.startsWith("/college/seats")
  },
  {
    href: "/reports",
    label: "Reports",
    icon: <BarChart3 className="h-4 w-4" aria-hidden />,
    match: (p) => p.startsWith("/reports")
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

  const handleSignOut = () => {
    signOut();
    push("You have been signed out securely.", "info");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      {/* Tricolor strip */}
      <div className="tricolor-strip h-1 w-full" aria-hidden />

      {/* Identity bar */}
      <div className="bg-white border-b border-line-subtle">
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

          <Link href="/" className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-600 text-white font-bold"
            >
              HP
            </span>
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
      <div className="mx-auto flex w-full max-w-shell flex-1 px-4 py-6 gap-6">
        <aside className="hidden w-60 flex-shrink-0 md:block">
          <nav className="sticky top-[112px] flex flex-col gap-1">
            {NAV.map((item) => (
              <SidebarLink
                key={item.href}
                {...item}
                active={item.match(pathname)}
              />
            ))}
            <div className="my-3 h-px bg-line-subtle" />
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                Cycle 2026-27
              </p>
              <p className="mt-1 text-sm font-medium text-ink">Application open</p>
              <p className="mt-1 text-xs text-ink-muted">
                Closes 16 May 2026, 6:00 PM
              </p>
            </div>
          </nav>
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
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-elevated">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-ink">Navigation</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-surface-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {NAV.map((item) => (
                <SidebarLink
                  key={item.href}
                  {...item}
                  active={item.match(pathname)}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
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
      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary-50 text-primary-700"
          : "text-ink hover:bg-surface-subtle"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded ${
          active ? "bg-primary-600 text-white" : "bg-surface-subtle text-ink-muted"
        }`}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

function UserMenu({
  role,
  name,
  onSwitch,
  onSignOut
}: {
  role: "state_admin" | "college_admin";
  name: string;
  onSwitch: (r: "state_admin" | "college_admin") => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const initials = name
    .replace(/^Dr\.\s+/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            {name.replace(/^Dr\.\s+/, "Dr. ")}
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
            className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-line bg-white p-2 shadow-elevated"
          >
            <div className="border-b border-line-subtle p-2">
              <p className="text-sm font-semibold text-ink">{name}</p>
              <p className="text-xs text-ink-muted">
                {role === "state_admin"
                  ? "Directorate of Higher Education"
                  : "Government College Sanjauli, Shimla"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge tone="primary" dot>
                  {role === "state_admin" ? "State Admin" : "College Admin"}
                </Badge>
                <Badge tone="success">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Active
                </Badge>
              </div>
            </div>
            <div className="p-2">
              <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Demo role view
              </p>
              <button
                type="button"
                onClick={() => {
                  onSwitch("state_admin");
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-ink hover:bg-surface-subtle ${role === "state_admin" ? "font-semibold" : ""}`}
              >
                State Admin
                {role === "state_admin" ? (
                  <Badge tone="primary">Current</Badge>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitch("college_admin");
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-ink hover:bg-surface-subtle ${role === "college_admin" ? "font-semibold" : ""}`}
              >
                College Admin
                {role === "college_admin" ? (
                  <Badge tone="primary">Current</Badge>
                ) : null}
              </button>
            </div>
            <div className="border-t border-line-subtle p-2">
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-danger-ink hover:bg-danger-50"
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
