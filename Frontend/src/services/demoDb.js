// Demo In-Memory & LocalStorage Database for testing the Admin Console manually
import { destinations as seedDestinations } from "../data/destinations";

const STORAGE_KEY = "yatrio_demo_db_destinations";
const ANALYTICS_KEY = "yatrio_demo_db_analytics";

// Initialize initial dataset from seed destinations
function getInitialDestinations() {
  return seedDestinations.map((d, index) => ({
    id: `dest-${index + 1}`,
    name: d.name,
    title: `${d.name}: ${d.label || d.state}`,
    slug: d.slug,
    state: d.state || "",
    city: d.name,
    country: d.region === "Beyond" ? "International" : "India",
    region: d.region === "Beyond" ? "International" : d.region,
    label: d.label || "Curated",
    price: parseInt(String(d.price).replace(/[^0-9]/g, ""), 10) || 19500,
    duration_days: parseInt(String(d.duration).replace(/[^0-9]/g, ""), 10) || 6,
    season: d.season || "Year Round",
    description: d.description || "",
    highlights: Array.isArray(d.highlights) ? d.highlights : ["Curated stays", "Private driver", "Scenic trails"],
    image_url: d.image,
    is_published: index !== 10, // make Andaman a draft for testing published/draft toggling!
    featured: index < 3,
    created_at: new Date(Date.now() - (index * 86400000)).toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

// Load destinations from LocalStorage or initialize
export function loadDemoDestinations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load demo DB from localStorage, re-initializing:", err);
  }

  const initial = getInitialDestinations();
  saveDemoDestinations(initial);
  return initial;
}

// Save destinations to LocalStorage
export function saveDemoDestinations(destinations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
  } catch (err) {
    console.error("Failed to save demo DB to localStorage:", err);
  }
}

// Reset Demo DB to factory defaults
export function resetDemoDb() {
  const initial = getInitialDestinations();
  saveDemoDestinations(initial);
  localStorage.removeItem(ANALYTICS_KEY);
  return initial;
}

// Demo Database Query & Mutation Methods
export const demoDb = {
  // 1. Get Destinations with Search, Pagination, & Filter
  getDestinations({ page = 1, pageSize = 50, search = "", isPublished = null } = {}) {
    let list = loadDemoDestinations();

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.title?.toLowerCase().includes(q) ||
          d.state?.toLowerCase().includes(q) ||
          d.country?.toLowerCase().includes(q) ||
          d.region?.toLowerCase().includes(q) ||
          d.slug?.toLowerCase().includes(q)
      );
    }

    if (isPublished !== null && isPublished !== undefined && isPublished !== "") {
      const pubBool = isPublished === true || isPublished === "true";
      list = list.filter((d) => Boolean(d.is_published) === pubBool);
    }

    const total = list.length;
    const startIndex = (page - 1) * pageSize;
    const items = list.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total,
      page: Number(page),
      page_size: Number(pageSize),
      total_pages: Math.ceil(total / pageSize) || 1,
    };
  },

  // 2. Get Single Destination by ID
  getDestinationById(id) {
    const list = loadDemoDestinations();
    return list.find((d) => String(d.id) === String(id)) || null;
  },

  // 3. Get Single Destination by Slug
  getDestinationBySlug(slug) {
    const list = loadDemoDestinations();
    return list.find((d) => d.slug === slug) || null;
  },

  // 4. Create Destination
  createDestination(data) {
    const list = loadDemoDestinations();
    const newId = `dest-${Date.now()}`;
    const newSlug =
      data.slug ||
      (data.title || data.name || "trip")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newDest = {
      id: newId,
      name: data.name || data.title || "New Yatra",
      title: data.title || data.name || "New Yatra",
      slug: newSlug,
      state: data.state || "",
      city: data.city || data.name || "",
      country: data.country || "India",
      region: data.region || "North",
      label: data.label || "Curated",
      price: parseInt(String(data.price || "18500").replace(/[^0-9]/g, ""), 10) || 18500,
      duration_days: parseInt(String(data.duration_days || data.duration || "6").replace(/[^0-9]/g, ""), 10) || 6,
      season: data.season || "Year Round",
      description: data.description || "",
      highlights: Array.isArray(data.highlights)
        ? data.highlights
        : typeof data.highlights === "string"
        ? data.highlights.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Private transit", "Boutique stays"],
      image_url:
        data.image_url ||
        data.image ||
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
      is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
      featured: Boolean(data.featured),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    list.unshift(newDest);
    saveDemoDestinations(list);
    return newDest;
  },

  // 5. Update Destination
  updateDestination(id, data) {
    const list = loadDemoDestinations();
    const index = list.findIndex((d) => String(d.id) === String(id));

    if (index === -1) {
      throw new Error(`Destination with ID '${id}' not found in demo database.`);
    }

    const existing = list[index];
    const updated = {
      ...existing,
      ...data,
      highlights: Array.isArray(data.highlights)
        ? data.highlights
        : typeof data.highlights === "string"
        ? data.highlights.split(",").map((s) => s.trim()).filter(Boolean)
        : existing.highlights,
      price: data.price !== undefined ? parseInt(String(data.price).replace(/[^0-9]/g, ""), 10) || existing.price : existing.price,
      duration_days: data.duration_days !== undefined ? parseInt(String(data.duration_days).replace(/[^0-9]/g, ""), 10) || existing.duration_days : existing.duration_days,
      is_published: data.is_published !== undefined ? Boolean(data.is_published) : existing.is_published,
      updated_at: new Date().toISOString(),
    };

    list[index] = updated;
    saveDemoDestinations(list);
    return updated;
  },

  // 6. Delete Destination
  deleteDestination(id) {
    const list = loadDemoDestinations();
    const filtered = list.filter((d) => String(d.id) !== String(id));

    if (filtered.length === list.length) {
      throw new Error(`Destination with ID '${id}' not found.`);
    }

    saveDemoDestinations(filtered);
    return { success: true, message: `Destination ${id} deleted successfully.`, id };
  },

  // 7. Get Platform Analytics Overview
  getAnalytics() {
    const list = loadDemoDestinations();
    const published = list.filter((d) => d.is_published).length;
    const drafts = list.length - published;

    const regionsMap = {};
    list.forEach((d) => {
      const reg = d.region || "Other";
      regionsMap[reg] = (regionsMap[reg] || 0) + 1;
    });

    return {
      total_destinations: list.length,
      published_destinations: published,
      draft_destinations: drafts,
      total_inquiries: 148 + list.length * 3,
      active_whatsapp_chats: 32,
      confirmed_bookings_month: 27,
      total_users: 184,
      popular_regions: regionsMap,
      generated_at: new Date().toISOString(),
      is_demo_mode: true,
    };
  },

  // 8. Demo User Authentication
  getDemoAdminUser() {
    return {
      id: "demo-admin-id",
      email: "admin@yatrio.com",
      username: "admin",
      full_name: "Demo Admin",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
    };
  },

  getDemoTravelerUser() {
    return {
      id: "demo-user-id",
      email: "traveler@yatrio.com",
      username: "traveler",
      full_name: "Rahul Sharma",
      role: "user",
      is_active: true,
      created_at: new Date().toISOString(),
    };
  },
};
