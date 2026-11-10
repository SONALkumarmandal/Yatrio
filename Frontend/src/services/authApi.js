import { request } from "./api";

export async function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register({ email, username, fullName, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      username,
      full_name: fullName,
      password,
    }),
  });
}

export async function getMe() {
  return request("/users/me");
}

export async function logout() {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch (err) {
    console.warn("Logout request failed:", err.message);
  } finally {
    localStorage.removeItem("yatrio_token");
    localStorage.removeItem("yatrio_user");
  }
}
