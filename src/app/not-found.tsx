import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-subtle p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
        Error 404
      </p>
      <h1 className="text-3xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-md text-sm text-ink-muted">
        The page you are looking for does not exist on the HP Higher Education
        MIS portal.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
