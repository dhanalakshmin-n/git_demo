"use client";

import { useState, useEffect } from "react";
import type { Bookmark } from "@/data/bookmarks";
import { BOOKMARK_LOGO_SIZE_PX } from "@/data/bookmarks";
import { BookmarkLogo } from "@/components/BookmarkCard";
import { StarRating } from "@/components/StarRating";

type CategoryOption = { id: string; slug: string; name: string };

function bookmarkMatchesTopic(b: Bookmark, topicName: string, topicSlug: string): boolean {
  const nameMatch = b.category === topicName;
  const slugMatch = b.categorySlug === topicSlug;
  return nameMatch || slugMatch;
}

export default function ExplorePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookmarks").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/categories").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([bookmarksData, categoriesData]) => {
        setBookmarks(bookmarksData);
        setCategories(categoriesData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (topicSlug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topicSlug)) next.delete(topicSlug);
      else next.add(topicSlug);
      return next;
    });
  };

  const selectedSlugs = [...selected];
  const filteredBookmarks =
    selectedSlugs.length === 0
      ? []
      : bookmarks.filter((b) =>
          selectedSlugs.some((slug) => {
            const cat = categories.find((c) => c.slug === slug);
            return cat ? bookmarkMatchesTopic(b, cat.name, cat.slug) : false;
          })
        );

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Explore
        </h1>
        <h1 className="text-2xl font-semibold text-slate-500 dark:text-slate-400">
          Your Interest
        </h1>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Select topics to see only bookmarks in those categories
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggle(cat.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected.has(cat.slug)
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading bookmarks...</p>
      ) : selected.size === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Select one or more topics above to see bookmarks in those categories
          </p>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No bookmarks in the selected categories yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBookmarks.map((b) => (
            <a
              key={b.id}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 py-3 px-4 bg-white dark:bg-[#252830] rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <BookmarkLogo bookmark={b} size={BOOKMARK_LOGO_SIZE_PX} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {b.category}
                </p>
                <h3 className="font-medium text-slate-800 dark:text-slate-200">
                  {b.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {b.description}
                </p>
              </div>
              <StarRating value={b.rating} size="sm" readOnly />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
