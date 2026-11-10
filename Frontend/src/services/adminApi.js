import { request } from "./api";

export async function getAdminDestinations({ page = 1, pageSize = 20, search = "", isPublished = null } = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("page_size", pageSize);
  if (search) params.append("search", search);
  if (isPublished !== null) params.append("is_published", isPublished);

  return request(`/admin/destinations?${params.toString()}`);
}

export async function createAdminDestination(formData) {
  return request("/admin/destinations", {
    method: "POST",
    body: formData,
  });
}

export async function updateAdminDestination(id, formData) {
  return request(`/admin/destinations/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteAdminDestination(id) {
  return request(`/admin/destinations/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminAnalytics() {
  return request("/admin/analytics/overview");
}

export async function getAdminUsers() {
  return request("/admin/users");
}
