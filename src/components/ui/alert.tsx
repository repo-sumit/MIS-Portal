import type { ReactNode } from "react";
import { Info, TriangleAlert, ShieldAlert, CheckCircle2 } from "lucide-react";

type Tone = "info" | "warning" | "danger" | "success";

const TONE_CLS: Record<Tone, { wrap: string; icon: ReactNode }> = {
  info: {
    wrap: "border-info-400/30 bg-info-50",
    icon: <Info className="h-5 w-5 text-info-600" aria-hidden />
  },
  warning: {
    wrap: "border-warning/30 bg-warning-50",
    icon: <TriangleAlert className="h-5 w-5 text-warning-ink" aria-hidden />
  },
  danger: {
    wrap: "border-danger/30 bg-danger-50",
    icon: <ShieldAlert className="h-5 w-5 text-danger-ink" aria-hidden />
  },
  success: {
    wrap: "border-success/30 bg-success-50",
    icon: <CheckCircle2 className="h-5 w-5 text-success-ink" aria-hidden />
  }
};

export function Alert({
  tone = "info",
  title,
  children,
  action
}: {
  tone?: Tone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 ${TONE_CLS[tone].wrap}`}
    >
      <div className="mt-0.5 flex-shrink-0">{TONE_CLS[tone].icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {children ? (
          <p className="mt-0.5 text-sm leading-snug text-ink-muted">{children}</p>
        ) : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}
