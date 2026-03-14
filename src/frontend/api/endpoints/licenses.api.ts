import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getLicenses() {
  return apiClient(API_ROUTES.LICENSES);
}

export function getLicense(id: string) {
  return apiClient(`${API_ROUTES.LICENSES}/${id}`);
}

export function createLicense(data: Record<string, unknown>) {
  return apiClient(API_ROUTES.LICENSES, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateLicense(id: string, data: Record<string, unknown>) {
  return apiClient(`${API_ROUTES.LICENSES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteLicense(id: string) {
  return apiClient(`${API_ROUTES.LICENSES}/${id}`, { method: "DELETE" });
}
