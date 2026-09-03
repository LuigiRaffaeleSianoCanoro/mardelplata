import Link from "next/link";
import type { PressItem } from "@/content/prensa/types";
import { PRESS_EVENT_LABELS, PRESS_TYPE_LABELS } from "@/content/prensa/types";
import { hasArchive } from "@/content/prensa";

function formatDate(iso: string): string {
  if (!iso || iso === "2026-01-01") return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TYPE_FLAVOR: Record<PressItem["type"], string> = {
  reportaje: "violet",
  gacetilla: "cyan",
  institucional: "amber",
};

export default function PressCard({ item }: { item: PressItem }) {
  const archived = hasArchive(item);

  return (
    <article className="prensa-x-card">
      <div className="prensa-x-card-meta">
        <span className="prensa-x-card-outlet">{item.outlet}</span>
        <time className="prensa-x-card-date" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      </div>

      <h2 className="prensa-x-card-title">
        <Link href={`/prensa/${item.id}`}>{item.title}</Link>
      </h2>

      {item.outletTitle && (
        <p className="prensa-x-card-outlet-title">
          Título del medio: «{item.outletTitle}»
        </p>
      )}

      <p className="prensa-x-card-excerpt">{item.excerpt}</p>

      <div className="prensa-x-card-tags">
        <span className={`shell-tag shell-tag--${TYPE_FLAVOR[item.type]}`}>
          {PRESS_TYPE_LABELS[item.type]}
        </span>
        {item.events.map((tag) => (
          <span key={tag} className="shell-tag shell-tag--emerald">
            {PRESS_EVENT_LABELS[tag]}
          </span>
        ))}
        {item.pendingSource && (
          <span className="shell-tag shell-tag--rose">Sin fuente</span>
        )}
        {item.primarySource && (
          <span className="shell-tag shell-tag--amber">Fuente primaria</span>
        )}
      </div>

      <div className="prensa-x-card-actions">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="prensa-x-link prensa-x-link--external"
          >
            Nota original
          </a>
        ) : (
          <span className="prensa-x-link prensa-x-link--muted">Sin URL</span>
        )}
        <Link href={`/prensa/${item.id}`} className="prensa-x-link">
          {archived ? "Ver archivo" : "Ver ficha"}
        </Link>
      </div>
    </article>
  );
}
