"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Check } from "lucide-react";

interface QrDialogProps {
  open: boolean;
  onClose: () => void;
  qrCode: string | null;
  fullName: string | null;
  email: string | null;
  memberSince?: string | null;
  /** Vertical screen Y of the trigger button (its center). The popover
   *  anchors next to the sidebar at this Y so it reads as an extension
   *  of the button — no full-screen modal. */
  anchorY?: number | null;
}

export default function QrDialog({
  open,
  onClose,
  qrCode,
  fullName,
  email,
  memberSince,
  anchorY,
}: QrDialogProps) {
  const [copied, setCopied] = useState(false);
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
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Anchor the popover beside the sidebar (76px = 68px rail + 8px gap) and
  // center it vertically on the trigger button when we know its Y. Clamp to
  // viewport so the popover never spills off-screen.
  const POPOVER_H = qrCode ? 460 : 220;
  const safeAnchor = anchorY ?? 120;
  const top = Math.max(
    16,
    Math.min(safeAnchor - POPOVER_H / 2, (typeof window !== "undefined" ? window.innerHeight : 800) - POPOVER_H - 16),
  );
  const arrowTop = Math.max(20, Math.min(safeAnchor - top, POPOVER_H - 20));

  const qrValue = qrCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/miembro?code=${qrCode}`
    : "";

  const copyLink = async () => {
    if (!qrValue) return;
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const memberDate = memberSince
    ? new Date(memberSince).toLocaleDateString("es-AR", { year: "numeric", month: "long" })
    : null;

  // Render through a portal to document.body so the popover escapes the
  // sidebar's containing block (the sidebar's backdrop-filter traps
  // position: fixed for descendants).
  return createPortal(
    <div
      className="fixed inset-0 z-[200] pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label="Mi código QR"
    >
      {/* Click-outside catcher — invisible but pointer-events-auto */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute inset-0 pointer-events-auto cursor-default"
        tabIndex={-1}
      />

      {/* Popover anchored to the right of the sidebar */}
      <div
        className="qr-popover absolute pointer-events-auto"
        style={{ left: 76, top, width: 360 }}
      >
        <span className="qr-popover-arrow" style={{ top: arrowTop }} aria-hidden />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <p className="kicker text-white/40 mb-3 flex items-center gap-2">
          <span className="dot-amber" />
          carnet · miembro
        </p>

        <h2 className="display-thin text-white text-2xl mb-1">{fullName || "Sin nombre"}</h2>
        {email && <p className="text-white/55 text-[0.85rem] font-light mb-5">{email}</p>}

        {qrCode ? (
          <div className="flex flex-col items-center gap-5">
            <div className="qr-frame">
              <QRCodeSVG
                value={qrValue}
                size={244}
                bgColor="rgba(255,255,255,0)"
                fgColor="#FFFFFF"
                level="M"
                marginSize={2}
              />
              <div className="qr-frame-corners" aria-hidden />
            </div>

            <div className="w-full flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[0.7rem] text-white/65 font-mono truncate">
                {qrCode}
              </code>
              <button
                type="button"
                onClick={copyLink}
                className="grid place-items-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label={copied ? "Link copiado" : "Copiar link"}
                title={copied ? "Copiado" : "Copiar link de carnet"}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <p className="coord-line text-white/45 text-center w-full">
              ATLÁNTICO SUR <span className="sep">·</span>
              <span className="num">38°00&apos;S 057°33&apos;W</span>
              {memberDate && (
                <>
                  <span className="sep">·</span>
                  <span className="num uppercase">{memberDate}</span>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="text-white/55 text-sm py-10 text-center">
            QR no disponible — completá tu perfil para generarlo.
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
