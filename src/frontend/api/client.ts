import { useAuthStore } from "@/frontend/store/auth.store";

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth", { method: "PUT", credentials: "include" });
    return res.ok;
  } catch {
    return false;
  }
}

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
    // Try refresh token before giving up
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = attemptRefresh();
    }

    const refreshed = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshed) {
      // Retry the original request with new token
      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
      });

      if (retryResponse.ok) {
        return retryResponse.json();
      }
    }

    // Refresh failed — log out
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
