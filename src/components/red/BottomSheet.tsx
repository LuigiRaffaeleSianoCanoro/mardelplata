"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Optional sticky header (drag-handle, title, actions). */
  header?: ReactNode;
  /** Optional sticky bar below the header (typically tab triggers). */
  toolbar?: ReactNode;
  children?: ReactNode;
  ariaLabel?: string;
}

// Bottom sheet à la Aeterna estudio: slides up from the bottom, takes 90vh,
// has a sticky header + optional sticky toolbar (tabs) + scrollable content.
// Renders through a portal to document.body so it escapes the sidebar's
// backdrop-filter containing block.

export default function BottomSheet({
  open,
  onClose,
  header,
  toolbar,
  children,
  ariaLabel,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`bottom-sheet-root ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        tabIndex={open ? 0 : -1}
        className="bottom-sheet-backdrop"
      />
      <div className="bottom-sheet-panel">
        {header && (
          <div className="bottom-sheet-header">
            <div className="bottom-sheet-handle" aria-hidden />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="bottom-sheet-close"
            >
              <X size={16} />
            </button>
            <div className="relative pr-10">{header}</div>
          </div>
        )}
        {toolbar && <div className="bottom-sheet-toolbar">{toolbar}</div>}
        <div className="bottom-sheet-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
