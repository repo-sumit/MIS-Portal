import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-ink-muted">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden />}
      </div>
      <div>
        <p className="text-base font-semibold text-ink">{title}</p>
        {description ? (
          <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
