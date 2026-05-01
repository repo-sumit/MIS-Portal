import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    label: string;
  };
  icon?: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
}

const TONE_BAR: Record<NonNullable<StatProps["tone"]>, string> = {
  neutral: "bg-line",
  primary: "bg-primary-600",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info-600"
};

const ICON_BG: Record<NonNullable<StatProps["tone"]>, string> = {
  neutral: "bg-surface-subtle text-ink-muted",
  primary: "bg-primary-50 text-primary-700",
  success: "bg-success-50 text-success-ink",
  warning: "bg-warning-50 text-warning-ink",
  danger: "bg-danger-50 text-danger-ink",
  info: "bg-info-50 text-info-600"
};

export function Stat({
  label,
  value,
  hint,
  trend,
  icon,
  tone = "primary"
}: StatProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-white p-4 shadow-card">
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-full w-1 ${TONE_BAR[tone]}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
          {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
        </div>
        {icon ? (
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${ICON_BG[tone]}`}>
            {icon}
          </div>
        ) : null}
      </div>
      {trend ? (
        <p
          className={`mt-3 text-xs font-medium ${
            trend.direction === "up"
              ? "text-success-ink"
              : trend.direction === "down"
                ? "text-danger-ink"
                : "text-ink-muted"
          }`}
        >
          {trend.direction === "up" ? "▲" : trend.direction === "down" ? "▼" : "—"}{" "}
          {trend.label}
        </p>
      ) : null}
    </div>
  );
}
