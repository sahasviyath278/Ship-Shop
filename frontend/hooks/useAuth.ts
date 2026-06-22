"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: string) {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) router.push("/login");
    else if (requiredRole && user?.role !== requiredRole) router.push("/");
  }, [accessToken, user, requiredRole, router]);

  return { user, isAuthenticated: !!accessToken };
}