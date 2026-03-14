import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getSoftware(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiClient(`${API_ROUTES.SOFTWARE}${qs}`);
}

export function getSoftwareById(id: string) {
  return apiClient(`${API_ROUTES.SOFTWARE}/${id}`);
}

export function createSoftware(data: Record<string, unknown>) {
  return apiClient(API_ROUTES.SOFTWARE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSoftware(id: string, data: Record<string, unknown>) {
  return apiClient(`${API_ROUTES.SOFTWARE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteSoftware(id: string) {
  return apiClient(`${API_ROUTES.SOFTWARE}/${id}`, { method: "DELETE" });
}
