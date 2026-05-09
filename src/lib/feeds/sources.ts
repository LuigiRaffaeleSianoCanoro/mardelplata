import type { FeedSource } from "./types";

// Catálogo de feeds que la red de mar del plata republica en /blog.
// Cualquiera de éstos se puede cambiar / quitar libremente — el agregador
// los toma como suelen estar (RSS 2.0 o Atom). El feed cae sin pánico:
// si una source falla, el resto sigue mostrándose.
//
// Cómo conseguir tu URL:
//   • Medium tag o user → https://medium.com/feed/tag/<tag>
//                       o https://medium.com/feed/@<usuario>
//                       o https://medium.com/feed/<publication-slug>
//   • Substack          → https://<sub>.substack.com/feed
//   • Dev.to            → https://dev.to/feed/<usuario>  (o /feed/ para el global)
//   • Hashnode          → https://<sub>.hashnode.dev/rss.xml
//   • GitHub releases   → https://github.com/<owner>/<repo>/releases.atom
//   • YouTube channel   → https://www.youtube.com/feeds/videos.xml?channel_id=<UCxxxx>
//   • Cualquier blog    → muchos exponen /rss.xml, /feed.xml, /index.xml

export const FEED_SOURCES: FeedSource[] = [
  {
    key: "medium-webdev",
    label: "Medium",
    kind: "medium",
    url: "https://medium.com/feed/tag/web-development",
    max: 6,
  },
  {
    key: "devto",
    label: "Dev.to",
    kind: "devto",
    url: "https://dev.to/feed/",
    max: 6,
  },
  {
    key: "github-next",
    label: "Next.js releases",
    kind: "github-releases",
    url: "https://github.com/vercel/next.js/releases.atom",
    max: 4,
  },
  // Ejemplos que podés descomentar y adaptar a tus propios canales:
  // {
  //   key: "substack-mardelplata",
  //   label: "Substack mar del plata",
  //   kind: "substack",
  //   url: "https://mardelplata.substack.com/feed",
  // },
  // {
  //   key: "youtube-canal",
  //   label: "YouTube",
  //   kind: "youtube",
  //   url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCxxxxxxxxxxxxxxxxxxxxx",
  // },
];

/** Tiempo de cache del fetch (segundos). 30 min es un punto medio razonable
 *  para feeds editoriales — Substack y Medium publican por hora a lo sumo. */
export const FEED_REVALIDATE_SECONDS = 1800;
