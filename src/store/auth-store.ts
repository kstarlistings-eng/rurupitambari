import { getMeService, loginService } from "@/services/auth-services";
import type { AuthState } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ACCESS_TOKEN_CONSTANT, REFRESH_TOKEN_CONSTANT } from "@/config/constants";
import { createToken, deleteToken, getToken } from "@/utils/token";

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      refreshTokenPromise: null,
      accessToken: null,
      refreshToken: null,

      getMe: async () => {
        return await getMeService();
      },

      login: async (loginInput: LoginInput) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginService(loginInput);
          set({
            isAuthenticated: true,
            isLoading: false,
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });
          return data.user;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || "Login failed",
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        deleteToken(ACCESS_TOKEN_CONSTANT);
        deleteToken(REFRESH_TOKEN_CONSTANT);
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          refreshTokenPromise: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      getUser: async (isLoading = true) => {
        set({ isLoading: isLoading, error: null });
        try {
          const accessToken = getToken(ACCESS_TOKEN_CONSTANT);
          if (!accessToken) {
            throw new Error("No access token");
          }
          const user = await get().getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            accessToken,
          });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || "Failed to fetch user data",
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      clear: () => set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        refreshTokenPromise: null,
        accessToken: null,
        refreshToken: null,
      }),

      refreshTokenFn: async () => {
        const refreshToken = getToken(REFRESH_TOKEN_CONSTANT);
        if (!refreshToken) {
          get().logout();
          return null;
        }
        try {
          const response = await fetch(
            import.meta.env.VITE_API_URL + "/api/auth/refresh",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Refresh failed");
          createToken(ACCESS_TOKEN_CONSTANT, data.access_token);
          set({ accessToken: data.access_token });
          return data.access_token;
        } catch {
          get().logout();
          return null;
        }
      },

      checkAuth: () => {
        const { user, isAuthenticated } = get();
        return isAuthenticated && !!user;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
