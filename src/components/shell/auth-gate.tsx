"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/providers/session-provider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, hydrated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login");
    }
  }, [hydrated, session, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <div className="flex items-center gap-3 text-ink-muted">
          <span
            className="h-4 w-4 rounded-full border-2 border-primary-600 border-t-transparent animate-spin-slow"
            aria-hidden
          />
          <span className="text-sm">Loading portal…</span>
        </div>
      </div>
    );
  }

  if (!session) return null;
  return <>{children}</>;
}
