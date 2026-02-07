"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to home
  if (isAuthenticated) {
    router.replace("/");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      router.replace("/");
    } else {
      setError(result.error ?? "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1117] px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Markflow"
            width={140}
            height={106}
            className="object-contain"
          />
        </div>
        <div className="bg-white dark:bg-[#252830] rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-xl">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-1">
            Sign in
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Use the dummy credentials to log in
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@markflow.com"
                required
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
            Demo: demo@markflow.com / demo123
          </p>
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
          © 2025 Markflow
        </p>
      </div>
    </div>
  );
}
