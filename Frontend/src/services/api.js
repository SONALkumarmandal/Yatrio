const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

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

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.detail || data?.message || "An unexpected error occurred";
    const error = new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
