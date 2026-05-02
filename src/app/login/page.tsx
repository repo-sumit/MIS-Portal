"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  User2,
  ArrowRight,
  Info,
  Building2,
  ClipboardList,
  CircleDashed,
  ServerCog,
  Award
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/providers/session-provider";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FieldShell, TextInput } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { session, hydrated, signIn } = useSession();
  const { push } = useToast();

  const [userId, setUserId] = useState("director.dhe@hp.gov.in");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && session) {
      router.replace("/");
    }
  }, [hydrated, session, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!userId.trim() || !password.trim()) {
      setError("Enter your User ID and password to continue.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      signIn(userId.trim());
      push("Signed in to HP Higher Education MIS.", "success");
      router.replace("/");
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FA]">
      <div className="tricolor-strip h-1 w-full" aria-hidden />

      {/* Identity bar */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-shell items-center gap-3 px-4 py-3">
          <Image
            src="/assets/HPU_Logo.png"
            alt="Himachal Pradesh University emblem"
            width={48}
            height={48}
            priority
            className="h-11 w-11 flex-shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink sm:text-base">
              HP Higher Education MIS
            </p>
            <p className="truncate text-[11px] text-ink-muted sm:text-xs">
              Department of Higher Education · Government of Himachal Pradesh
            </p>
          </div>
          <Link
            href="#"
            className="hidden text-sm font-medium text-primary-700 hover:underline sm:inline"
          >
            Need help?
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* HERO */}
          <section className="relative hidden flex-col justify-between overflow-hidden rounded-2xl border border-primary-900/30 bg-primary-800 p-8 text-white shadow-elevated lg:flex">
            {/* Pattern + gradient layers */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(1200px 400px at 0% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), radial-gradient(800px 300px at 100% 100%, rgba(255,153,51,0.12) 0%, rgba(255,153,51,0) 60%)"
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "32px 32px"
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Authorised access only
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#FF9933]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Cycle 2026-27
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold leading-tight">
                Admin workspace for the Higher Education admission lifecycle.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                Single, role-aware MIS for the Directorate of Higher Education
                and HPU-affiliated colleges to oversee scrutiny, merit,
                allocation and reporting in real time.
              </p>

              {/* Mini dashboard preview */}
              <ul className="mt-7 grid grid-cols-3 gap-3">
                <PreviewTile
                  icon={<Building2 className="h-4 w-4" />}
                  value="190"
                  label="Colleges monitored"
                />
                <PreviewTile
                  icon={<ClipboardList className="h-4 w-4" />}
                  value="32,403"
                  label="Applications in cycle"
                />
                <PreviewTile
                  icon={<CircleDashed className="h-4 w-4" />}
                  value="5,655"
                  label="Pending scrutiny"
                />
              </ul>

              {/* Compliance pills */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <CompliancePill
                  icon={<Award className="h-3 w-3" />}
                  label="UX4G aligned"
                />
                <CompliancePill
                  icon={<ShieldCheck className="h-3 w-3" />}
                  label="WCAG 2.1 AA"
                />
                <CompliancePill
                  icon={<ServerCog className="h-3 w-3" />}
                  label="NIC hosted"
                />
              </div>
            </div>

            <div className="relative mt-8 rounded-lg border border-white/15 bg-white/5 p-3 text-xs leading-relaxed text-white/85 backdrop-blur-sm">
              This is an official Government of Himachal Pradesh information
              system. Access is logged. Misuse is punishable under the IT Act,
              2000 and applicable departmental regulations.
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                <ShieldCheck className="h-3 w-3" /> Secure government access
              </span>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">
                Sign in to your workspace
              </h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                Use your DHE-issued User ID. Sessions remain active for the
                duration of the current admission cycle window.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-muted">
                <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface-subtle px-2 py-0.5">
                  Default workspace
                </span>
                <span className="font-semibold text-ink">State Admin</span>
              </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
              <FieldShell label="User ID / Email" htmlFor="userId" required>
                <div className="relative">
                  <User2
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    aria-hidden
                  />
                  <TextInput
                    id="userId"
                    name="userId"
                    autoComplete="username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="director.dhe@hp.gov.in"
                    className="pl-9"
                  />
                </div>
              </FieldShell>

              <FieldShell label="Password" htmlFor="password" required>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                    aria-hidden
                  />
                  <TextInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-9"
                  />
                </div>
              </FieldShell>

              {error ? (
                <p
                  role="alert"
                  className="rounded-md border border-danger/30 bg-danger-50 px-3 py-2 text-sm text-danger-ink"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-line text-primary-600"
                  />
                  Keep me signed in
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                block
              >
                {submitting ? "Verifying credentials" : "Sign in securely"}
              </Button>
            </form>

            {/* Helper card: College Admin via switcher */}
            <div className="mt-5 rounded-lg border border-line bg-surface-muted p-3 text-xs leading-relaxed text-ink-muted">
              <p className="flex items-start gap-2">
                <Info
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-700"
                  aria-hidden
                />
                <span>
                  <span className="font-semibold text-ink">
                    College Admin workspace
                  </span>{" "}
                  is available after signing in — switch from the user menu in
                  the top-right of the portal header.
                </span>
              </p>
            </div>

            {/* Prototype banner */}
            <div
              role="note"
              className="mt-3 flex items-start gap-2 rounded-md border border-info-400/40 bg-info-50 p-3 text-xs text-info-600"
            >
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
              <p>
                Prototype access: use any non-empty password for this
                evaluation build. Real DHE credentials are not required.
              </p>
            </div>

            <p className="mt-5 border-t border-line-subtle pt-4 text-xs leading-relaxed text-ink-muted">
              Department of Higher Education, Government of Himachal Pradesh ·
              Hosted by NIC Shimla. By signing in you accept the system{" "}
              <Link href="#" className="text-primary-700 hover:underline">
                acceptable-use policy
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-shell flex-col gap-1 px-4 py-3 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            Official Government of Himachal Pradesh information system ·
            Conforms to WCAG 2.1 Level AA
          </p>
          <p>For technical support contact NIC Shimla helpdesk.</p>
        </div>
      </footer>
    </div>
  );
}

function PreviewTile({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <li className="rounded-lg border border-white/15 bg-white/8 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-white/80">
        <span className="text-white/90">{icon}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-1 text-xl font-semibold leading-tight">{value}</p>
    </li>
  );
}

function CompliancePill({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-medium text-white/95 backdrop-blur-sm">
      {icon}
      {label}
    </span>
  );
}
