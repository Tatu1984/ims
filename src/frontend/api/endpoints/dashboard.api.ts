import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getDashboardData() {
  return apiClient(API_ROUTES.DASHBOARD);
}
