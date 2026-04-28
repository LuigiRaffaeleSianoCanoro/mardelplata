import { Rss } from "lucide-react";
import FeedCard from "@/components/blog/FeedCard";
import { getAggregatedFeed } from "@/lib/feeds/fetch";
import { FEED_SOURCES } from "@/lib/feeds/sources";

// Server component — la timeline de blog la calcula el server con cache de
// 30 min (configurable en sources.ts). El cliente solo recibe HTML estático
// con los cards. Cero peso para el bundle JS.

export const revalidate = 1800;

export const metadata = {
  title: "Lectura · mardelplata.dev",
  description:
    "Un feed editorial agregado de Medium, Substack, Dev.to y otras voces que la red de mar del plata sigue leyendo.",
};

export default async function BlogPage() {
  const items = await getAggregatedFeed();

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
          Un feed editorial agregado — sin almacenar nada, traemos en vivo posts y
          releases desde {FEED_SOURCES.length} fuente{FEED_SOURCES.length === 1 ? "" : "s"} y los
          ordenamos por fecha. Click te lleva al original.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-10 text-center">
          <p className="text-white/65 font-light mb-2">
            No pudimos traer las fuentes en este momento.
          </p>
          <p className="text-white/40 text-sm font-light">
            Probá de nuevo en unos minutos. Las fuentes externas a veces tardan.
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
        <span>actualizado cada 30 min · sin DB</span>
        <span className="hidden sm:inline">
          fuentes: {FEED_SOURCES.map((s) => s.label).join(" · ")}
        </span>
      </footer>
    </main>
  );
}
