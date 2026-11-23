import { request } from "./api";
import { destinations as localDestinations, regions as localRegions } from "../data/destinations";

export function normalizeDestination(d) {
  // Normalize both backend model format and local mock format
  const imageUrl =
    d.media && d.media.length > 0
      ? d.media[0].url
      : d.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

  const formattedPrice =
    typeof d.price === "number"
      ? `₹${Number(d.price).toLocaleString("en-IN")}`
      : d.price?.startsWith?.("₹")
      ? d.price
      : d.price
      ? `₹${d.price}`
      : "₹18,500";

  const formattedDuration =
    typeof d.duration_days === "number"
      ? `${d.duration_days - 1} nights / ${d.duration_days} days`
      : d.duration || "5 nights / 6 days";

  return {
    id: d.id,
    slug: d.slug || String(d.id),
    name: d.title || d.name,
    title: d.title || d.name,
    state: d.state || d.city || "",
    city: d.city || "",
    country: d.country || "India",
    region: d.region || "All regions",
    label: d.label || "Holiday handle",
    image: imageUrl,
    media: d.media || [],
    price: formattedPrice,
    rawPrice: typeof d.price === "number" ? d.price : parseInt(String(d.price).replace(/[^0-9]/g, ""), 10) || 0,
    duration: formattedDuration,
    durationDays: d.duration_days || 6,
    season: d.season || "Year-round",
    description: d.description || "",
    highlights: Array.isArray(d.highlights) && d.highlights.length > 0 ? d.highlights : ["Curated stays", "Local guide", "Tailored route"],
    bestFor: d.best_for || d.bestFor || "Relaxation & culture",
    rating: d.rating || "4.9",
    isPublished: d.is_published ?? true,
  };
}

function canUseLocalFallback(err) {
  return import.meta.env.DEV && !err?.status;
}

function getLocalDestinations({ search, region }) {
  let filtered = [...localDestinations].map(normalizeDestination);
  if (region && region !== "All regions") {
    filtered = filtered.filter((d) => d.region.toLowerCase() === region.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
    );
  }

  return {
    items: filtered,
    total: filtered.length,
    page: 1,
    pageSize: filtered.length,
    fromApi: false,
  };
}

export async function getDestinations({ page = 1, pageSize = 30, search = "", region = "" } = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (pageSize) params.append("page_size", pageSize);
    if (search) params.append("search", search);
    if (region && region !== "All regions") params.append("region", region);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await request(`/destinations${query}`);

    if (!res || !Array.isArray(res.items)) {
      throw new Error("The destinations API returned an invalid response.");
    }
    return {
      items: res.items.map(normalizeDestination),
      total: res.total,
      page: res.page,
      pageSize: res.page_size,
      fromApi: true,
    };
  } catch (err) {
    if (!canUseLocalFallback(err)) throw err;
    console.warn("API destination fetch fallback to local data:", err.message);
    return getLocalDestinations({ search, region });
  }
}

export async function getDestinationBySlug(slug) {
  try {
    const data = await request(`/destinations/${slug}`);
    if (!data || typeof data !== "object") {
      throw new Error("The destination API returned an invalid response.");
    }
    return normalizeDestination(data);
  } catch (err) {
    if (!canUseLocalFallback(err)) throw err;
    console.warn(`API detail fetch for ${slug} fallback to local:`, err.message);
    const local = localDestinations.find((d) => d.slug === slug);
    return local ? normalizeDestination(local) : null;
  }
}

export async function getRegions() {
  try {
    const regions = await request(`/destinations/regions`);
    if (!Array.isArray(regions)) {
      throw new Error("The regions API returned an invalid response.");
    }
    return regions;
  } catch (err) {
    if (!canUseLocalFallback(err)) throw err;
    console.warn("API regions fetch fallback to local data:", err.message);
    return localRegions;
  }
}
