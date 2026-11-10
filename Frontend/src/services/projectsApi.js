import { request } from "./api";

export async function getProjects() {
  return request("/projects");
}

export async function createProject({ name, description = "", status = "draft", data = {} }) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description, status, data }),
  });
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, {
    method: "DELETE",
  });
}
