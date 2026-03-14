import { apiClient } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants/routes";

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      department: string;
      initials: string;
    };
  };
}

interface MeResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiClient<LoginResponse>(API_ROUTES.AUTH, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

export async function logoutApi(): Promise<void> {
  await apiClient(API_ROUTES.AUTH, { method: "DELETE" });
}

export async function getMeApi(): Promise<MeResponse> {
  return apiClient<MeResponse>(API_ROUTES.AUTH);
}
