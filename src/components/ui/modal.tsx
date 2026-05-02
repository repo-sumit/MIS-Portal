"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_CLS: Record<Size, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl"
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: Size;
  /** Footer renders a sticky bottom action bar */
  footer?: ReactNode;
  /** Right-aligned slot in the header (e.g. status badge) */
  headerAction?: ReactNode;
  /** Disable closing by Escape / overlay click — useful while a request is in flight */
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "lg",
  footer,
  headerAction,
  closeOnEscape = true,
  closeOnOverlay = true,
  children
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Mount-side guard so we can portal to document.body
  const isClient = typeof document !== "undefined";

  // Focus the close button when the modal opens, lock body scroll.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEscape, onClose]);

  // Lightweight focus trap: cycle Tab within the dialog
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("data-focus-trap-skip"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  if (!open || !isClient) return null;

  const titleId = "modal-title";
  const descId = description ? "modal-description" : undefined;

  const node = (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={() => {
          if (closeOnOverlay) onClose();
        }}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`relative z-10 flex w-full ${SIZE_CLS[size]} max-h-[92vh] flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-elevated sm:rounded-2xl`}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-line bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-ink">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-0.5 text-sm text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {headerAction}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-line bg-surface-muted px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
