import { ExternalLink } from "lucide-react";
import type { FeedItem, FeedSourceKind } from "@/lib/feeds/types";

const KIND_ACCENT: Record<FeedSourceKind, string> = {
  medium: "rgb(120, 220, 200)",
  substack: "rgb(255, 140, 90)",
  devto: "rgb(59, 130, 246)",
  hashnode: "rgb(74, 144, 226)",
  "github-releases": "rgba(255, 255, 255, 0.55)",
  youtube: "rgb(255, 45, 80)",
  rss: "rgb(255, 176, 112)",
};

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const accent = KIND_ACCENT[item.sourceKind] ?? KIND_ACCENT.rss;
  const date = new Date(item.publishedAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-night p-5 block group transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="kicker text-white/45 flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
          {item.sourceLabel}
        </p>
        <span className="text-white/40 text-[0.7rem] font-light">{date}</span>
      </div>

      <h3 className="display-thin text-white text-xl mb-2 leading-tight line-clamp-2 group-hover:text-white">
        {item.title}
      </h3>
      {item.excerpt && (
        <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-3 mb-4">
          {item.excerpt}
        </p>
      )}

      <div className="flex items-center gap-2 text-[0.72rem]">
        {item.author && (
          <span className="text-white/55 font-light truncate">{item.author}</span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-white/55 group-hover:text-white transition-colors">
          leer en {item.sourceLabel} <ExternalLink size={11} />
        </span>
      </div>
    </a>
  );
}
