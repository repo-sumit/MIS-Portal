import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-line bg-white shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}

export function CardHeader({ title, description, action, eyebrow }: CardHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-subtle px-5 py-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
