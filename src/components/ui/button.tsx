"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "success"
  | "warning"
  | "danger";

type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  block?: boolean;
}

const VARIANT_CLS: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300",
  secondary:
    "bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200 disabled:opacity-60",
  ghost:
    "bg-transparent text-ink hover:bg-surface-subtle active:bg-line-subtle disabled:opacity-50",
  outline:
    "bg-white text-ink border border-line hover:bg-surface-subtle active:bg-line-subtle disabled:opacity-50",
  success:
    "bg-success text-white hover:bg-success-600 active:bg-success-ink disabled:opacity-60",
  warning:
    "bg-warning text-white hover:bg-warning-600 active:bg-warning-ink disabled:opacity-60",
  danger:
    "bg-danger text-white hover:bg-danger-600 active:bg-danger-ink disabled:opacity-60"
};

const SIZE_CLS: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    block = false,
    className = "",
    disabled,
    children,
    type = "button",
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed ${SIZE_CLS[size]} ${VARIANT_CLS[variant]} ${block ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin-slow"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
});
