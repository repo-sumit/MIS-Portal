type Tone = "primary" | "success" | "warning" | "danger";

const TONE_BAR: Record<Tone, string> = {
  primary: "bg-primary-600",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger"
};

export function ProgressBar({
  value,
  tone = "primary",
  label
}: {
  value: number;
  tone?: Tone;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
          <span>{label}</span>
          <span className="font-medium text-ink">{clamped}%</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-line-subtle">
        <div
          className={`h-full ${TONE_BAR[tone]} transition-all`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
