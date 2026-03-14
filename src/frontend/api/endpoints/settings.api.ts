import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getSettings(category?: string) {
  const qs = category ? `?category=${category}` : "";
  return apiClient(`${API_ROUTES.SETTINGS}${qs}`);
}

export function updateSetting(key: string, value: string, category?: string) {
  return apiClient(API_ROUTES.SETTINGS, {
    method: "PATCH",
    body: JSON.stringify({ key, value, category }),
  });
}
