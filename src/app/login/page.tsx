"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, User2, ArrowRight, Info } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <div className="tricolor-strip h-1 w-full" aria-hidden />

      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-shell items-center gap-3 px-4 py-3">
          <Image
            src="/assets/HPU_Logo.png"
            alt="HP Higher Education MIS"
            width={44}
            height={44}
            priority
            className="h-11 w-11 flex-shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              HP Higher Education MIS
            </p>
            <p className="hidden text-[11px] text-ink-muted sm:block">
              Department of Higher Education · Government of Himachal Pradesh
            </p>
          </div>
          <Link
            href="#"
            className="ml-auto hidden text-sm font-medium text-primary-700 hover:underline sm:inline"
          >
            Need help?
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl items-stretch gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="hidden flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-primary-700 to-primary-900 p-8 text-white lg:flex">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Authorised access only
              </span>
              <h1 className="mt-6 text-3xl font-semibold leading-tight">
                Admin Portal for the Higher Education admission lifecycle.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                Single workspace for the Directorate of Higher Education and
                affiliated college administrators to oversee scrutiny, merit,
                allocation and reporting across the 2026-27 cycle.
              </p>
            </div>

            <ul className="mt-8 space-y-3 text-sm text-white/85">
              <FeatureLine>
                State-level command centre with district and college oversight
              </FeatureLine>
              <FeatureLine>
                Application scrutiny workbench with audit trail
              </FeatureLine>
              <FeatureLine>
                Real-time merit, allocation and seat-matrix monitoring
              </FeatureLine>
              <FeatureLine>WCAG 2.1 AA · UX4G design system</FeatureLine>
            </ul>

            <div className="mt-8 rounded-lg border border-white/15 bg-white/5 p-3 text-xs leading-relaxed text-white/80">
              This is an official Government of Himachal Pradesh information
              system. Access is logged. Misuse is punishable under the IT Act,
              2000 and applicable departmental regulations.
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                Sign in to continue
              </p>
              <h2 className="mt-1 text-xl font-semibold text-ink">
                State Admin Login
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Use your DHE-issued User ID. Sessions are valid for the active
                admission cycle window.
              </p>
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

              <div className="flex items-start gap-2 rounded-md border border-info-400/40 bg-info-50 p-3 text-xs text-info-600">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
                <p>
                  Demo build: any password works. After login you can switch
                  between State Admin and College Admin from the user menu.
                </p>
              </div>
            </form>

            <p className="mt-6 border-t border-line-subtle pt-4 text-xs leading-relaxed text-ink-muted">
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
            © Government of Himachal Pradesh · Conforms to WCAG 2.1 Level AA
          </p>
          <p>For technical support contact NIC Shimla helpdesk.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70"
      />
      <span>{children}</span>
    </li>
  );
}
