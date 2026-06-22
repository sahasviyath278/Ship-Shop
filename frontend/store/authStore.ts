import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: { email: string; fullName: string; role: string } | null;
  setAuth: (tokens: { accessToken: string; refreshToken: string; email: string; fullName: string; role: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: ({ accessToken, refreshToken, email, fullName, role }) =>
        set({ accessToken, refreshToken, user: { email, fullName, role } }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: "auth-storage" }
  )
);