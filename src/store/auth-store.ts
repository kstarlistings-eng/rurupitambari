import { loginService } from "@/services/auth-services";
import type { AuthState } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type LoginInput = any;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      refreshTokenPromise: null,

      getMe: async () => {
        // Simulated API call to get user data
        return new Promise((resolve) => {
          setTimeout(() => {
            const user = {
              id: 1,
              name: "John Doe",
              email: "john.doe@example.com",
            };
            resolve(user);
          }, 1000);
        });
      },

      login: async (loginInput: LoginInput) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginService(loginInput);
          set({
            isAuthenticated: true,
            isLoading: false,
            user: data.user,
          });
          return data.user;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
            isAuthenticated: false,
          });
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          refreshTokenPromise: null,
        });
      },
      getUser: async (isLoading = true) => {
        set({ isLoading: isLoading, error: null });
        try {
          const user = await get().getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch user data",
            isAuthenticated: false,
            user: null,
          });

          return false;
        }
      },

      clearError: () => set({ error: null }),

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
    },
  ),
);
