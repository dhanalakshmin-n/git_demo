"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SearchIcon, ListIcon } from "@/components/NavIcons";

type CategoryWithCount = { id: string; slug: string; name: string; count: number };

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories?withCounts=true");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-slate-500 dark:text-slate-400">Loading categories...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        Categories
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Organize your bookmarks by category
      </p>

      {/* Action bar: Add new +, Search categories..., List toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setAddCategoryOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Add new +
        </button>
        <div className="flex-1 min-w-[200px] max-w-md flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            viewMode === "list"
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500"
          }`}
        >
          <ListIcon />
          List
        </button>
      </div>

      <AddCategoryModal
        isOpen={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onAdded={() => {
          setAddCategoryOpen(false);
          fetchCategories();
        }}
      />

      {viewMode === "list" ? (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categories/${c.slug}`}
                className="flex items-center justify-between py-3 px-4 bg-white dark:bg-[#252830] rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon slug={c.slug} />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{c.name}</span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">{c.count} bookmarks</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-[#252830] rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{c.count} bookmarks</p>
              </div>
              <CategoryIcon slug={c.slug} />
            </Link>
          ))}
        </div>
      )}

      {/* Floating action button */}
      <button
        type="button"
        onClick={() => setAddCategoryOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center justify-center transition-colors z-40"
        aria-label="Add new category"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
