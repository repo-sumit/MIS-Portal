/**
 * Lightweight SVG/CSS chart primitives.
 *
 * Hand-rolled to keep the dependency footprint zero. Each component is
 * intentionally minimal (no animation libraries, no chart.js) and uses
 * UX4G colour tokens via Tailwind classes.
 */

import type { ReactNode } from "react";

// ───────────────────── Area / line trend ─────────────────────

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
  stroke: string;
  values: number[];
}

interface AreaTrendProps {
  labels: string[];
  series: TrendSeries[];
  height?: number;
  yLabel?: string;
}

export function AreaTrend({ labels, series, height = 180 }: AreaTrendProps) {
  if (series.length === 0 || series[0].values.length === 0) return null;
  const width = 600;
  const padX = 32;
  const padY = 16;
  const inner = { w: width - padX * 2, h: height - padY * 2 };
  const all = series.flatMap((s) => s.values);
  const max = Math.max(1, ...all);
  const stepX = inner.w / Math.max(1, labels.length - 1);

  const xy = (i: number, v: number) => ({
    x: padX + i * stepX,
    y: padY + inner.h - (v / max) * inner.h
  });

  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Weekly applications trend"
        className="block w-full min-w-[420px]"
      >
        {/* Y axis grid */}
        {[0.25, 0.5, 0.75, 1].map((f) => {
          const y = padY + inner.h - f * inner.h;
          return (
            <line
              key={f}
              x1={padX}
              x2={padX + inner.w}
              y1={y}
              y2={y}
              stroke="#ECEAF5"
              strokeWidth={1}
            />
          );
        })}
        {/* Series */}
        {series.map((s) => {
          const points = s.values.map((v, i) => xy(i, v));
          const path =
            "M " +
            points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ");
          const area =
            path +
            ` L ${points[points.length - 1].x.toFixed(1)},${(padY + inner.h).toFixed(1)} L ${points[0].x.toFixed(1)},${(padY + inner.h).toFixed(1)} Z`;
          return (
            <g key={s.key}>
              <path d={area} fill={s.color} opacity={0.18} />
              <path
                d={path}
                fill="none"
                stroke={s.stroke}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill="#fff"
                  stroke={s.stroke}
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}
        {/* X labels */}
        {labels.map((lbl, i) => (
          <text
            key={lbl}
            x={padX + i * stepX}
            y={height - 4}
            fontSize={10}
            fill="#5B6075"
            textAnchor="middle"
          >
            {lbl}
          </text>
        ))}
        {/* Y axis max marker */}
        <text x={4} y={padY + 4} fontSize={10} fill="#5B6075">
          {max.toLocaleString("en-IN")}
        </text>
        <text x={4} y={padY + inner.h} fontSize={10} fill="#5B6075">
          0
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-ink-muted">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded"
              style={{ background: s.stroke }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────── Horizontal bar chart ─────────────────────

export interface HBarRow {
  key: string;
  label: string;
  primary: number;
  secondary?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  /** caption right of the bar */
  caption?: ReactNode;
}

interface HBarProps {
  rows: HBarRow[];
  primaryColor?: string;
  secondaryColor?: string;
}

export function HBar({
  rows,
  primaryColor = "#613AF5",
  secondaryColor = "#84A2F4"
}: HBarProps) {
  const max = Math.max(
    1,
    ...rows.flatMap((r) => [r.primary, r.secondary ?? 0])
  );
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => {
        const primaryPct = Math.max(0, Math.min(100, (r.primary / max) * 100));
        const secondaryPct =
          r.secondary !== undefined
            ? Math.max(0, Math.min(100, (r.secondary / max) * 100))
            : 0;
        // Track + bar layout: bar fills `[trackPct]%` of the row; the value
        // label always sits in the trailing whitespace using dark ink so
        // contrast stays readable regardless of bar colour.
        const trackPct = Math.max(primaryPct, secondaryPct);
        const labelInside = trackPct >= 70;
        const valueLabel = `${r.primary.toLocaleString("en-IN")}${r.primaryLabel ? ` ${r.primaryLabel}` : ""}`;
        return (
          <li key={r.key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
              <span className="truncate font-medium text-ink">{r.label}</span>
              <span className="flex-shrink-0 text-ink-muted">{r.caption}</span>
            </div>
            <div
              className="relative flex h-6 w-full items-center"
              role="img"
              aria-label={`${r.label}: ${valueLabel}`}
            >
              <div className="relative h-full flex-1 overflow-hidden rounded-md bg-line-subtle">
                {r.secondary !== undefined ? (
                  <div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{
                      width: `${secondaryPct}%`,
                      background: secondaryColor,
                      opacity: 0.55
                    }}
                  />
                ) : null}
                <div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{
                    width: `${primaryPct}%`,
                    background: primaryColor
                  }}
                />
                {/* Value label — dark ink, sits outside the bar by default,
                    moves inside only when the bar is wide enough to keep
                    contrast against violet (>=70% track). */}
                {labelInside ? (
                  <span
                    className="absolute inset-y-0 right-2 flex items-center text-[11px] font-semibold text-white"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
                  >
                    {valueLabel}
                  </span>
                ) : (
                  <span
                    className="absolute inset-y-0 flex items-center text-[11px] font-semibold text-ink"
                    style={{
                      left: `calc(${primaryPct}% + 8px)`,
                      maxWidth: `calc(${100 - primaryPct}% - 12px)`
                    }}
                  >
                    {valueLabel}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ───────────────────── Donut ─────────────────────

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSubLabel?: string;
}

export function Donut({
  segments,
  size = 160,
  thickness = 22,
  centerLabel,
  centerSubLabel
}: DonutProps) {
  const total = Math.max(
    1,
    segments.reduce((acc, s) => acc + s.value, 0)
  );
  const r = size / 2 - thickness / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Category distribution"
        className="flex-shrink-0"
      >
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="#ECEAF5"
          strokeWidth={thickness}
        />
        {segments.map((s) => {
          const dash = (s.value / total) * circ;
          const seg = (
            <circle
              key={s.key}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${c} ${c})`}
            />
          );
          offset += dash;
          return seg;
        })}
        {centerLabel ? (
          <text
            x={c}
            y={c - 2}
            textAnchor="middle"
            fontSize={18}
            fontWeight={600}
            fill="#1C1D1F"
          >
            {centerLabel}
          </text>
        ) : null}
        {centerSubLabel ? (
          <text
            x={c}
            y={c + 14}
            textAnchor="middle"
            fontSize={10}
            fill="#5B6075"
          >
            {centerSubLabel}
          </text>
        ) : null}
      </svg>
      <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:flex-1">
        {segments.map((s) => {
          const share = Math.round((s.value / total) * 1000) / 10;
          return (
            <li key={s.key} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate text-ink">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                  style={{ background: s.color }}
                />
                <span className="truncate">{s.label}</span>
              </span>
              <span className="flex-shrink-0 text-ink-muted">
                {s.value.toLocaleString("en-IN")}
                <span className="ml-1 text-[10px]">· {share}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ───────────────────── Stacked SLA bar ─────────────────────

export interface StackedSegment {
  key: string;
  label: string;
  value: number;
  color: string;
  caption?: string;
}

export function StackedBar({
  segments,
  totalLabel
}: {
  segments: StackedSegment[];
  totalLabel?: string;
}) {
  const total = Math.max(
    1,
    segments.reduce((acc, s) => acc + s.value, 0)
  );
  return (
    <div>
      {totalLabel ? (
        <p className="mb-2 text-xs text-ink-muted">{totalLabel}</p>
      ) : null}
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {segments.map((s) => (
          <span
            key={s.key}
            className="h-full"
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color
            }}
            aria-label={`${s.label} ${s.value}`}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {segments.map((s) => (
          <li
            key={s.key}
            className="rounded-md border border-line bg-white px-2.5 py-2"
          >
            <div className="flex items-center gap-1.5 text-ink-muted">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              <span>{s.label}</span>
            </div>
            <p className="mt-0.5 text-base font-semibold text-ink">
              {s.value.toLocaleString("en-IN")}
            </p>
            {s.caption ? (
              <p className="text-[11px] text-ink-muted">{s.caption}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
