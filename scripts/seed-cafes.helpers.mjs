// Mapea un resultado de Google Places (Text Search) a una fila de cafes.
// Nota: campos exclusivos de Place Details (address_components → neighborhood, y url)
// NO vienen en Text Search; por eso neighborhood puede quedar null y maps_url usa el fallback.
export function placeToCafeRow(place) {
  if (!place || typeof place.place_id !== "string" || !place.name) {
    throw new Error("place inválido: faltan place_id o name");
  }
  const loc = place.geometry?.location ?? {};
  return {
    name: String(place.name).slice(0, 120),
    address: place.formatted_address ?? place.vicinity ?? null,
    neighborhood: extractNeighborhood(place) ?? null,
    lat: typeof loc.lat === "number" ? loc.lat : null,
    lng: typeof loc.lng === "number" ? loc.lng : null,
    google_place_id: place.place_id,
    google_rating: typeof place.rating === "number" ? place.rating : null,
    google_reviews_count:
      typeof place.user_ratings_total === "number" ? place.user_ratings_total : null,
    maps_url:
      place.url ?? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    source: "seed",
  };
}

// Intenta derivar el barrio de los address_components (sublocality / neighborhood).
export function extractNeighborhood(place) {
  const comps = Array.isArray(place.address_components) ? place.address_components : [];
  const match = comps.find(
    (c) =>
      Array.isArray(c.types) &&
      (c.types.includes("neighborhood") || c.types.includes("sublocality")),
  );
  return match ? match.long_name : null;
}
