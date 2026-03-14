import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getReports() {
  return apiClient(API_ROUTES.REPORTS);
}

export function getReport(id: string) {
  return apiClient(`${API_ROUTES.REPORTS}/${id}`);
}

export function createReport(data: Record<string, unknown>) {
  return apiClient(API_ROUTES.REPORTS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteReport(id: string) {
  return apiClient(`${API_ROUTES.REPORTS}/${id}`, { method: "DELETE" });
}
