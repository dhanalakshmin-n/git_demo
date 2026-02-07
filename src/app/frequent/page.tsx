"use client";

import { useState, useEffect, useMemo } from "react";
import { BOOKMARK_LOGO_SIZE_PX } from "@/data/bookmarks";
import type { Bookmark } from "@/data/bookmarks";
import { StarRating } from "@/components/StarRating";
import { BookmarkLogo } from "@/components/BookmarkCard";
import { BookmarkCardActions } from "@/components/BookmarkCardActions";
import { EditBookmarkModal } from "@/components/EditBookmarkModal";
import { getRecentVisits, getLastActivityTime, recordVisit } from "@/lib/recentVisits";

const FREQUENT_ROW_HEIGHT_PX = 80;

export default function FrequentPage() {
  const [viewMode, setViewMode] = useState<"sort" | "list">("list");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const fetchBookmarks = () => {
    fetch("/api/bookmarks")
      .then((res) => (res.ok ? res.json() : []))
      .then(setBookmarks)
      .catch(() => setError("Failed to load"));
  };

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => (res.ok ? res.json() : []))
      .then(setBookmarks)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(b: Bookmark) {
    if (!confirm(`Delete "${b.name}"?`)) return;
    const res = await fetch(`/api/bookmarks/${b.id}`, { method: "DELETE" });
    if (res.ok) fetchBookmarks();
  }

  function handleEditSaved(updated: Bookmark) {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  }

  const frequentBookmarks = useMemo(() => {
    const visits = getRecentVisits();
    return [...bookmarks]
      .sort((a, b) => {
        const ta = getLastActivityTime(a.id, visits);
        const tb = getLastActivityTime(b.id, visits);
        return tb - ta;
      })
      .slice(0, 6);
  }, [bookmarks]);

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Frequent</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("sort")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              viewMode === "sort"
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Sort
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              viewMode === "list"
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            List
          </button>
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Your most visited bookmarks, always at hand
      </p>
      {frequentBookmarks.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">No recent visits</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Click &quot;Visit&quot; on any bookmark to see it here.
          </p>
        </div>
      ) : (
      <div className="space-y-2">
        {frequentBookmarks.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-4 py-3 px-4 bg-white dark:bg-[#252830] rounded-lg border border-slate-200 dark:border-slate-700/50"
            style={{ minHeight: FREQUENT_ROW_HEIGHT_PX }}
          >
            <BookmarkLogo bookmark={b} size={BOOKMARK_LOGO_SIZE_PX} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{b.category}</p>
              <h3 className="font-medium text-slate-800 dark:text-slate-200">{b.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{b.description}</p>
            </div>
            <StarRating value={b.rating} size="sm" readOnly />
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
