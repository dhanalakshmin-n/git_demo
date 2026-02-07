"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutWithSidebar } from "./LayoutWithSidebar";

const LOGIN_PATH = "/login";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const isLoginPage = pathname === LOGIN_PATH;

  useEffect(() => {
    if (isLoading) return;
    if (isLoginPage && isAuthenticated) {
      router.replace("/");
      return;
    }
    if (!isLoginPage && !isAuthenticated) {
      router.replace(LOGIN_PATH);
    }
  }, [isLoading, isLoginPage, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1117]">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
}
