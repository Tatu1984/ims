"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/frontend/store/auth.store";
import { loginApi, logoutApi, getMeApi } from "@/frontend/api/endpoints/auth.api";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: clearAuth } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginApi(email, password);
      setUser(res.data.user);
      // Full page navigation ensures cookies are sent fresh (no stale router cache)
      window.location.href = "/";
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Cookie cleared by middleware redirect
    }
    clearAuth();
    window.location.href = "/login";
  }, [clearAuth]);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMeApi();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, [setUser, setLoading]);

  return { user, isAuthenticated, isLoading, login, logout, checkAuth };
}
