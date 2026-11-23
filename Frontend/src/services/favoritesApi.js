import { request } from "./api";
import { normalizeDestination } from "./destinationsApi";

export async function getFavorites() {
  const favorites = await request("/users/me/favorites");
  if (!Array.isArray(favorites)) {
    throw new Error("The favorites API returned an invalid response.");
  }
  return favorites.map(normalizeDestination);
}

export function addFavorite(slug) {
  return request(`/users/me/favorites/${encodeURIComponent(slug)}`, { method: "PUT" });
}

export function removeFavorite(slug) {
  return request(`/users/me/favorites/${encodeURIComponent(slug)}`, { method: "DELETE" });
}
