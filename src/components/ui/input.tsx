import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

export interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export function FieldShell({
  label,
  hint,
  error,
  required,
  children,
  htmlFor
}: FieldShellProps) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-danger-ink" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
}

const baseInput =
  "h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-disabled hover:border-line-strong focus:border-primary-600";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = "", ...rest }, ref) {
    return <input ref={ref} className={`${baseInput} ${className}`} {...rest} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...rest }, ref) {
    return (
      <select ref={ref} className={`${baseInput} ${className}`} {...rest}>
        {children}
      </select>
    );
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full rounded-md border border-line bg-white p-3 text-sm text-ink placeholder:text-ink-disabled hover:border-line-strong focus:border-primary-600 ${className}`}
      {...rest}
    />
  );
});
