"use client";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  useAuth(requiredRole);
  return <>{children}</>;
}