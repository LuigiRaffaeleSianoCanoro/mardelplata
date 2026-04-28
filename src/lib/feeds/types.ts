export type FeedSourceKind =
  | "medium"
  | "substack"
  | "devto"
  | "hashnode"
  | "github-releases"
  | "youtube"
  | "rss";

export interface FeedSource {
  /** Stable key used as ID + URL slug for filters. */
  key: string;
  /** Human-readable label rendered as a badge on the card. */
  label: string;
  /** Source kind — drives the icon and visual accent. */
  kind: FeedSourceKind;
  /** Full RSS / Atom URL. */
  url: string;
  /** Hard cap of items per source after parsing. Defaults to 6. */
  max?: number;
}

export interface FeedItem {
  source: string;
  sourceLabel: string;
  sourceKind: FeedSourceKind;
  title: string;
  url: string;
  /** ISO 8601 string. */
  publishedAt: string;
  /** Plain text, capped at ~280 chars. */
  excerpt: string;
  author?: string;
}
