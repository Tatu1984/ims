import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getUsers(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiClient(`${API_ROUTES.USERS}${qs}`);
}

export function getUser(id: string) {
  return apiClient(`${API_ROUTES.USERS}/${id}`);
}

export function createUser(data: Record<string, unknown>) {
  return apiClient(API_ROUTES.USERS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateUser(id: string, data: Record<string, unknown>) {
  return apiClient(`${API_ROUTES.USERS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: string) {
  return apiClient(`${API_ROUTES.USERS}/${id}`, { method: "DELETE" });
}
