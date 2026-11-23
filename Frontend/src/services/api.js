import { demoDb } from "./demoDb";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

function parseBody(body) {
  if (!body) return {};
  if (body instanceof FormData) {
    const obj = {};
    body.forEach((val, key) => {
      try {
        obj[key] = JSON.parse(val);
      } catch {
        obj[key] = val;
      }
    });
    return obj;
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function formatApiError(data) {
  const detail = data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc)
          ? item.loc.filter((part) => !["body", "query", "path"].includes(part)).pop()
          : null;
        const label = {
          email: "Email",
          username: "Username",
          password: "Password",
          full_name: "Full name",
        }[field] || field;
        const message = (item.msg || "Invalid value").replace(/^Value error,\s*/, "");
        return label ? `${label}: ${message}` : message;
      })
      .join("; ");
  }
  if (typeof detail === "string") return detail;
  if (typeof data?.message === "string") return data.message;
  return "An unexpected error occurred";
}

// In-browser mock handler for offline / manual testing with demoDb
function handleDemoDbRequest(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const urlObj = new URL(`http://dummy${endpoint}`);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // 1. Auth Login
  if (pathname === "/auth/login" && method === "POST") {
    const body = parseBody(options.body);
    const isAdmin =
      body.email?.toLowerCase().includes("admin") ||
      body.password === "Admin12345!" ||
      body.password === "admin";
    const user = isAdmin ? demoDb.getDemoAdminUser() : demoDb.getDemoTravelerUser();
    return {
      access_token: `demo-token-${isAdmin ? "admin" : "user"}`,
      token_type: "bearer",
      user,
    };
  }

  // 2. Auth Register
  if (pathname === "/auth/register" && method === "POST") {
    const body = parseBody(options.body);
    const user = {
      ...demoDb.getDemoTravelerUser(),
      email: body.email || "traveler@yatrio.com",
      full_name: body.full_name || body.fullName || "New Traveler",
    };
    return {
      access_token: "demo-token-user",
      token_type: "bearer",
      user,
    };
  }

  // 3. Current User Me
  if (pathname === "/users/me" && method === "GET") {
    const token = localStorage.getItem("yatrio_token") || "";
    const savedUser = localStorage.getItem("yatrio_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {}
    }
    return token.includes("admin") ? demoDb.getDemoAdminUser() : demoDb.getDemoTravelerUser();
  }

  // 4. Logout
  if (pathname === "/auth/logout") {
    return { success: true };
  }

  // 5. Admin Analytics Overview
  if (pathname === "/admin/analytics/overview") {
    return demoDb.getAnalytics();
  }

  // 6. Admin Destinations List / Public Destinations List
  if ((pathname === "/admin/destinations" || pathname === "/destinations") && method === "GET") {
    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("page_size") || searchParams.get("pageSize") || 50;
    const search = searchParams.get("search") || "";
    const isPublished = searchParams.get("is_published");
    return demoDb.getDestinations({ page, pageSize, search, isPublished });
  }

  // 7. Admin Create Destination
  if (pathname === "/admin/destinations" && method === "POST") {
    const data = parseBody(options.body);
    return demoDb.createDestination(data);
  }

  // 8. Admin Update / Delete Destination (/admin/destinations/:id)
  const adminDestMatch = pathname.match(/^\/admin\/destinations\/([^/]+)$/);
  if (adminDestMatch) {
    const id = adminDestMatch[1];
    if (method === "PUT") {
      const data = parseBody(options.body);
      return demoDb.updateDestination(id, data);
    }
    if (method === "DELETE") {
      return demoDb.deleteDestination(id);
    }
    if (method === "GET") {
      return demoDb.getDestinationById(id);
    }
  }

  // 9. Single Destination by Slug (/destinations/:slug)
  const pubDestMatch = pathname.match(/^\/destinations\/([^/]+)$/);
  if (pubDestMatch && method === "GET") {
    const slug = pubDestMatch[1];
    const dest = demoDb.getDestinationBySlug(slug);
    if (!dest) {
      const error = new Error(`Destination '${slug}' not found`);
      error.status = 404;
      throw error;
    }
    return dest;
  }

  // Fallback
  return { message: "Demo mock response", endpoint, method };
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("yatrio_token");
  const headers = {
    ...options.headers,
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if not sending FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(formatApiError(data));
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (import.meta.env.DEV && !err?.status) {
      console.info(`[Demo DB Active] Handling '${options.method || "GET"} ${endpoint}' via local demoDb:`, err.message);
      return handleDemoDbRequest(endpoint, options);
    }
    throw err;
  }
}
