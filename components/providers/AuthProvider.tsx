"use client";
import { useRehydrateAuth } from "@/hooks/useRehydrateAuth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useRehydrateAuth();
  return <>{children}</>;
}
