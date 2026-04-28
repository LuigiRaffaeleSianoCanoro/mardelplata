import { parseFeed } from "./parse";
import { FEED_SOURCES, FEED_REVALIDATE_SECONDS } from "./sources";
import type { FeedItem } from "./types";

// Trae todas las sources en paralelo, las merge cronológicamente y devuelve
// la timeline. Cualquier source que falle se descarta silenciosamente — el
// resto sigue mostrándose. Se cachea en el server vía la opción `next.revalidate`.

export async function getAggregatedFeed(): Promise<FeedItem[]> {
  const tasks = FEED_SOURCES.map(async (source) => {
    try {
      const res = await fetch(source.url, {
        next: { revalidate: FEED_REVALIDATE_SECONDS },
        headers: {
          // Algunos feeds bloquean user-agents vacíos.
          "User-Agent": "mardelplata.dev RSS aggregator (+https://mardelplata.dev)",
          Accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8",
        },
      });
      if (!res.ok) return [] as FeedItem[];
      const xml = await res.text();
      return parseFeed(xml, source);
    } catch {
      return [] as FeedItem[];
    }
  });

  const results = await Promise.all(tasks);
  return results
    .flat()
    .filter((item) => item.title && item.url)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 30);
}
