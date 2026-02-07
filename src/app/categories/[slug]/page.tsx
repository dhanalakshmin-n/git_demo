"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BOOKMARK_LOGO_SIZE_PX } from "@/data/bookmarks";
import type { Bookmark } from "@/data/bookmarks";
import { BookmarkCardActions } from "@/components/BookmarkCardActions";
import { BookmarkLogo } from "@/components/BookmarkCard";
import { EditBookmarkModal } from "@/components/EditBookmarkModal";

function bookmarkMatchesCategory(b: Bookmark, slug: string): boolean {
  if (slug === "all") return true;
  const slugNorm = slug.toLowerCase().replace(/\s+/g, "-");
  return (
    b.categorySlug === slugNorm ||
    (!!b.category && b.category.toLowerCase().replace(/\s+/g, "-") === slugNorm)
  );
}

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch("/api/bookmarks").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/categories").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([bookmarksData, categoriesData]) => {
        setBookmarks(bookmarksData);
        setCategories(categoriesData);
      })
      .catch(() => setError("Failed to load"));
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/bookmarks").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/categories").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([bookmarksData, categoriesData]) => {
        if (!cancelled) {
          setBookmarks(bookmarksData);
          setCategories(categoriesData);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(b: Bookmark) {
    if (!confirm(`Delete "${b.name}"?`)) return;
    const res = await fetch(`/api/bookmarks/${b.id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  }

  function handleEditSaved(updated: Bookmark) {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  }

  const category = categories.find((c) => c.slug === slug);
  const displayName =
    category?.name ??
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  const categoryBookmarks = bookmarks.filter((b) => bookmarkMatchesCategory(b, slug));

  const filtered = categoryBookmarks.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
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

  const isEmpty = filtered.length === 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {displayName}
      </h1>
      {!isEmpty && (
      <input
        type="search"
        placeholder="Search bookmarks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mt-4 mb-6 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      )}
      {isEmpty ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-12 text-center mt-6">
          <p className="text-slate-600 dark:text-slate-400 mb-2">No bookmarks in this category</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
            Add a bookmark and assign it to {displayName} to see it here.
          </p>
          <a
            href="/add-bookmark"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg"
          >
            Add Bookmark
          </a>
        </div>
      ) : (
      <div className="space-y-2">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-4 py-3 px-4 bg-white dark:bg-[#252830] rounded-lg border border-slate-200 dark:border-slate-700/50"
            style={{ minHeight: 72 }}
          >
            <BookmarkLogo bookmark={b} size={BOOKMARK_LOGO_SIZE_PX} />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-800 dark:text-slate-200">{b.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{b.description}</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
              {b.category}
            </span>
            <BookmarkCardActions
              onEdit={() => setEditingBookmark(b)}
              onShare={() => {
                if (navigator.share) {
                  navigator.share({ title: b.name, text: b.description, url: b.url }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(b.url);
                }
              }}
              onDelete={() => handleDelete(b)}
              visitUrl={b.url}
              visitLabel="Visit"
              bookmarkId={b.id}
            />
          </div>
        ))}
      </div>
      )}

      <EditBookmarkModal
        key={editingBookmark?.id ?? "closed"}
        bookmark={editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSaved={handleEditSaved}
      />
    </div>
  );
}
