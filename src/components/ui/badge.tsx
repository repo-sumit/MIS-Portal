import type { ReactNode } from "react";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const TONE_CLS: Record<Tone, string> = {
  neutral: "bg-surface-subtle text-ink-muted ring-1 ring-line",
  primary: "bg-primary-50 text-primary-700 ring-1 ring-primary-100",
  success: "bg-success-50 text-success-ink ring-1 ring-success/30",
  warning: "bg-warning-50 text-warning-ink ring-1 ring-warning/30",
  danger: "bg-danger-50 text-danger-ink ring-1 ring-danger/30",
  info: "bg-info-50 text-info-600 ring-1 ring-info-400/40"
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ tone = "neutral", children, dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${TONE_CLS[tone]} ${className}`}
    >
      {dot ? (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            tone === "neutral"
              ? "bg-ink-muted"
              : tone === "primary"
                ? "bg-primary-600"
                : tone === "success"
                  ? "bg-success"
                  : tone === "warning"
                    ? "bg-warning"
                    : tone === "danger"
                      ? "bg-danger"
                      : "bg-info-600"
          }`}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}

import type { ApplicationStatus } from "@/lib/types";
import { statusLabel, statusTone } from "@/lib/format";

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const tone = statusTone(status);
  return (
    <Badge tone={tone === "neutral" ? "neutral" : tone} dot>
      {statusLabel(status)}
    </Badge>
  );
}
