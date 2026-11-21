"use client";

import { Share } from "lucide-react";
import { Button } from "./button";
import { ICON_STROKE } from "./event-card";

export function MobileDock({
  nextUrl,
  onCalendar,
  onShare,
}: {
  nextUrl?: string | null;
  onCalendar: () => void;
  onShare: () => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 border-t bg-background/85 px-3 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-4 lg:hidden">
      {nextUrl ? (
        <Button href={nextUrl} target="_blank" size="xl" className="min-w-0 w-full">
          Anotarme al próximo
        </Button>
      ) : (
        <Button size="xl" className="min-w-0 w-full" onClick={onCalendar}>
          Ver calendario
        </Button>
      )}
      <Button variant="outline" size="icon-xl" aria-label="Compartir" className="shrink-0" onClick={onShare}>
        <Share className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
      </Button>
    </div>
  );
}
