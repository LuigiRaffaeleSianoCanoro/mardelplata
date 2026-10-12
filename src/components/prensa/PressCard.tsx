import Link from "next/link";
import type { PressItem } from "@/content/prensa/types";
import { PRESS_TYPE_LABELS } from "@/content/prensa/types";
import { hasArchive } from "@/content/prensa";
import { Badge } from "@/components/shadcn/badge";

function formatDate(iso: string): string {
  if (!iso || iso === "2026-01-01") return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PressCard({ item }: { item: PressItem }) {
  const archived = hasArchive(item);

  return (
    <article className="flex flex-col gap-2 rounded-xl border bg-card/70 p-4 transition-colors hover:bg-card">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
        <span className="truncate uppercase">{item.outlet}</span>
        <time dateTime={item.date} className="shrink-0">
          {formatDate(item.date)}
        </time>
      </div>

      <h2 className="text-[16px] font-semibold tracking-[-0.02em] leading-snug">
        <Link href={`/prensa/${item.id}`} className="hover:underline underline-offset-4">
          {item.title}
        </Link>
      </h2>

      {item.outletTitle ? (
        <p className="text-[12.5px] text-muted-foreground">Título del medio: «{item.outletTitle}»</p>
      ) : null}

      <p className="line-clamp-3 text-[13.5px] leading-snug text-muted-foreground">{item.excerpt}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <Badge variant="outline">{PRESS_TYPE_LABELS[item.type]}</Badge>
        {archived ? <Badge variant="outline">Archivo</Badge> : null}
      </div>
    </article>
  );
}
