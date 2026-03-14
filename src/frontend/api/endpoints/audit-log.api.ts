import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getAuditLogs(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiClient(`${API_ROUTES.AUDIT_LOG}${qs}`);
}
