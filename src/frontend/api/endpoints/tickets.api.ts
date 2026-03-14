import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

export function getTickets(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiClient(`${API_ROUTES.TICKETS}${qs}`);
}

export function getTicket(id: string) {
  return apiClient(`${API_ROUTES.TICKETS}/${id}`);
}

export function createTicket(data: Record<string, unknown>) {
  return apiClient(API_ROUTES.TICKETS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTicket(id: string, data: Record<string, unknown>) {
  return apiClient(`${API_ROUTES.TICKETS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTicket(id: string) {
  return apiClient(`${API_ROUTES.TICKETS}/${id}`, { method: "DELETE" });
}
