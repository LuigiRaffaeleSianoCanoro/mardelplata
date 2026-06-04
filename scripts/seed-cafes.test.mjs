import { test } from "node:test";
import assert from "node:assert/strict";
import { placeToCafeRow, extractNeighborhood } from "./seed-cafes.helpers.mjs";

test("placeToCafeRow mapea campos básicos", () => {
  const row = placeToCafeRow({
    place_id: "abc123",
    name: "Café Test",
    formatted_address: "Av. Colón 1234, Mar del Plata",
    rating: 4.5,
    user_ratings_total: 200,
    geometry: { location: { lat: -38.0, lng: -57.5 } },
  });
  assert.equal(row.google_place_id, "abc123");
  assert.equal(row.name, "Café Test");
  assert.equal(row.google_rating, 4.5);
  assert.equal(row.google_reviews_count, 200);
  assert.equal(row.lat, -38.0);
  assert.equal(row.source, "seed");
  assert.match(row.maps_url, /place_id:abc123|maps/);
});

test("placeToCafeRow prefiere place.url cuando está presente", () => {
  const row = placeToCafeRow({
    place_id: "abc123",
    name: "Café Test",
    url: "https://maps.google.com/?cid=99",
  });
  assert.equal(row.maps_url, "https://maps.google.com/?cid=99");
});

test("placeToCafeRow tira si falta place_id", () => {
  assert.throws(() => placeToCafeRow({ name: "x" }));
});

test("extractNeighborhood lee sublocality", () => {
  const hood = extractNeighborhood({
    address_components: [
      { long_name: "Playa Grande", types: ["sublocality", "political"] },
    ],
  });
  assert.equal(hood, "Playa Grande");
});

test("extractNeighborhood devuelve null sin match", () => {
  assert.equal(extractNeighborhood({ address_components: [] }), null);
});
