"use client";

import { useCallback, useState } from "react";

type ShareButtonProps = {
  listingId: string;
  title: string;
};

export default function ShareButton({ listingId, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/bolsa?id=${listingId}`
      : "";

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  const nativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: title, url: shareUrl });
      } catch {
        /* user cancelled or error */
      }
    }
  }, [shareUrl, title]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="bolsa-btn-secondary text-xs px-3 py-1.5"
      >
        Compartir
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] cursor-default"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-[61] mt-1 min-w-[180px] rounded-xl border border-ocean-200 bg-white py-1 shadow-lg shadow-ocean-900/10">
            <button
              type="button"
              onClick={() => {
                void copyLink();
              }}
              className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-ocean-50"
            >
              {copied ? "¡Copiado!" : "Copiar link"}
            </button>
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                type="button"
                onClick={() => {
                  void nativeShare();
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-ocean-50"
              >
                Compartir…
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
