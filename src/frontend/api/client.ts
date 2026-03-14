import { useAuthStore } from "@/frontend/store/auth.store";

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !skipAuth) {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || "Request failed",
      errors: data.errors,
    };
  }

  return data;
}
