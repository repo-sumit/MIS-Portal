"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useSession } from "@/providers/session-provider";
import type { RoleCode } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Renders children only when the active session matches one of `allow`.
 * For other roles, renders a formal "Role required" card with a CTA back
 * to the appropriate landing page.
 */
export function RoleGate({
  allow,
  redirectTo,
  children
}: {
  allow: RoleCode[];
  /** If provided, automatically redirects ineligible users instead of rendering the card. */
  redirectTo?: string;
  children: ReactNode;
}) {
  const { session, hydrated } = useSession();
  const router = useRouter();

  const allowed = !!session && allow.includes(session.role);

  useEffect(() => {
    if (hydrated && session && !allowed && redirectTo) {
      router.replace(redirectTo);
    }
  }, [hydrated, session, allowed, redirectTo, router]);

  if (!hydrated) return null;
  if (allowed) return <>{children}</>;
  if (redirectTo) return null;

  const required = allow
    .map((r) => (r === "state_admin" ? "State Admin" : "College Admin"))
    .join(" or ");

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-50 text-warning-ink">
            <ShieldAlert className="h-6 w-6" aria-hidden />
          </div>
          <p className="text-base font-semibold text-ink">
            Role required: {required}
          </p>
          <p className="max-w-md text-sm text-ink-muted">
            This page is restricted to {required} accounts. Switch role from
            the user menu, or return to your workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="outline" onClick={() => router.push("/college")}>
              Go to College Operations
            </Button>
            <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
