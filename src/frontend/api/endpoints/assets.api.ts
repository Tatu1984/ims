import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getAssets(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiClient(`${API_ROUTES.ASSETS}${qs}`);
}

export function getAsset(id: string) {
  return apiClient(`${API_ROUTES.ASSETS}/${id}`);
}

export function createAsset(data: Record<string, unknown>) {
  return apiClient(API_ROUTES.ASSETS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAsset(id: string, data: Record<string, unknown>) {
  return apiClient(`${API_ROUTES.ASSETS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteAsset(id: string) {
  return apiClient(`${API_ROUTES.ASSETS}/${id}`, { method: "DELETE" });
}
