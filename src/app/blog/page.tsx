import { Rss } from "lucide-react";
import FeedCard from "@/components/blog/FeedCard";
import type { FeedItem } from "@/lib/feeds/types";

// Server component. Por ahora hay solo dos lecturas curadas — items
// hardcodeados aca. Cuando haya mas voces locales republicando volvemos
// al agregador (getAggregatedFeed + FEED_SOURCES).

export const revalidate = 1800;

export const metadata = {
  title: "Lectura · mardelplata.dev",
  description:
    "Lecturas curadas de la red de mar del plata.",
};

const ITEMS: FeedItem[] = [
  {
    source: "xmcp",
    sourceLabel: "xmcp",
    sourceKind: "rss",
    title: "How to build an MCP App",
    url: "https://xmcp.dev/blog/mcp-apps",
    publishedAt: "2026-04-15T00:00:00.000Z",
    excerpt:
      "Learn how to build an MCP app using xmcp out-of-the-box support.",
  },
  {
    source: "luigipavla",
    sourceLabel: "Substack",
    sourceKind: "substack",
    title:
      "Pavla: la plataforma argentina que está transformando la gestión clínica de psicólogos con IA",
    url: "https://luigipavla.substack.com/p/pavla-la-plataforma-argentina-que",
    publishedAt: "2026-04-10T00:00:00.000Z",
    excerpt:
      "En un contexto donde los profesionales de la salud mental enfrentan cada vez más carga administrativa, Pavla emerge como una solución tecnológica diseñada para optimizar el tiempo clínico de psicólog@s y permitirles concentrarse en lo que realmente importa.",
    author: "Luigi Pavla",
  },
];

export default async function BlogPage() {
  const items = ITEMS;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <header className="mb-10 sm:mb-14 max-w-2xl">
        <p className="kicker text-white/45 mb-3 flex items-center gap-2">
          <Rss size={11} className="text-[#FFB070]" />
          lectura · feed
        </p>
        <h1 className="display-thin text-white text-4xl sm:text-5xl leading-[1.05] tracking-[-0.01em] mb-4">
          Lo que la red{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-white/95 to-[#FF2DAA]">
            está leyendo
          </span>
          .
        </h1>
        <p className="text-white/60 font-light leading-relaxed">
          Lecturas curadas de la red. Click te lleva al original.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-10 text-center">
          <p className="text-white/65 font-light mb-2">
            Por ahora no hay lecturas curadas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <FeedCard key={`${item.source}:${item.url}`} item={item} />
          ))}
        </div>
      )}

      <footer className="mt-14 pt-6 border-t border-white/[0.06] flex items-center justify-between gap-4 text-[0.72rem] text-white/45 font-light">
        <span>{items.length} lecturas curadas</span>
      </footer>
    </main>
  );
}
