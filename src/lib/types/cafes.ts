export type CafeSource = "seed" | "community";

export interface Cafe {
  id: string;
  name: string;
  address: string | null;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  maps_url: string | null;
  source: CafeSource;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CafeScore {
  cafe_id: string;
  net_votes: number;
  up_count: number;
  down_count: number;
  votes_count: number;
  wifi_count: number;
  power_count: number;
  seating_count: number;
  quiet_count: number;
}

export const EMPTY_SCORE: Omit<CafeScore, "cafe_id"> = {
  net_votes: 0,
  up_count: 0,
  down_count: 0,
  votes_count: 0,
  wifi_count: 0,
  power_count: 0,
  seating_count: 0,
  quiet_count: 0,
};

export interface CafeWithScore extends Cafe {
  score: Omit<CafeScore, "cafe_id">;
}

// La fila de voto del miembro actual (su propio voto + chips + comentario).
export interface CafeVote {
  cafe_id: string;
  user_id: string;
  vote: 1 | -1;
  has_wifi: boolean | null;
  has_power: boolean | null;
  good_seating: boolean | null;
  is_quiet: boolean | null;
  comment: string | null;
}

// Comentario de la comunidad mostrado en el detalle.
export interface CafeComment {
  user_id: string;
  vote: 1 | -1;
  comment: string;
  author_name: string | null;
}

export const CAFE_NAME_MAX = 120;
export const CAFE_COMMENT_MAX = 600;

// Definición de los chips de comodidades. La key matchea columnas de cafe_votes
// y de cafe_scores (con sufijo _count).
export const CAFE_AMENITIES = [
  { key: "has_wifi", countKey: "wifi_count", label: "WiFi", emoji: "📶" },
  { key: "has_power", countKey: "power_count", label: "Enchufes", emoji: "🔌" },
  { key: "good_seating", countKey: "seating_count", label: "Mesas/estadía", emoji: "🪑" },
  { key: "is_quiet", countKey: "quiet_count", label: "Tranquilo", emoji: "🔇" },
] as const;

export type AmenityKey = (typeof CAFE_AMENITIES)[number]["key"];
