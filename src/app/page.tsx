"use client";

import { useState, useRef, useEffect } from "react";
import type { Bookmark } from "@/data/bookmarks";
import { BOOKMARK_LOGO_SIZE_PX } from "@/data/bookmarks";
import { BookmarkCard, BookmarkLogo } from "@/components/BookmarkCard";
import { StarRating } from "@/components/StarRating";
import { BookmarkCardActions } from "@/components/BookmarkCardActions";
import { EditBookmarkModal } from "@/components/EditBookmarkModal";
import { SortIcon, ListIcon } from "@/components/NavIcons";

type SortOption = "recently-added" | "rating-desc" | "rating-asc" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recently-added", label: "Recently added" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

/** Get add-time from user- timestamp id (e.g. user-1738123456789-abc) for sorting. */
function getAddTime(bookmark: Bookmark): number {
  const m = bookmark.id.match(/^user-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function sortBookmarks(bookmarks: Bookmark[], sort: SortOption): Bookmark[] {
  const list = [...bookmarks];
  switch (sort) {
    case "recently-added":
      return list.sort((a, b) => getAddTime(b) - getAddTime(a));
    case "rating-desc":
      return list.sort((a, b) => b.rating - a.rating);
    case "rating-asc":
      return list.sort((a, b) => a.rating - b.rating);
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return list;
  }
}

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("recently-added");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const fetchBookmarks = () => {
    fetch("/api/bookmarks")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Bookmark[]) => setBookmarks(data))
      .catch(() => setBookmarks([]));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/bookmarks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load bookmarks");
        return res.json();
      })
      .then((data: Bookmark[]) => {
        if (!cancelled) setBookmarks(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
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
    if (res.ok) fetchBookmarks();
  }

  function handleEditSaved(updated: Bookmark) {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  }

  const sortedBookmarks = sortBookmarks(bookmarks, sortBy);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-slate-500 dark:text-slate-400">Loading bookmarks...</p>
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

  const isEmpty = sortedBookmarks.length === 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Home</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">Effortless Bookmark Management</p>
        </div>
        {!isEmpty && (
        <div className="flex gap-2 items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setSortDropdownOpen((o) => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                sortDropdownOpen
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <SortIcon />
              Sort
            </button>
            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 py-1 w-52 bg-white dark:bg-[#252830] border border-slate-300 dark:border-slate-600 rounded-lg shadow-xl z-10">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      sortBy === opt.value
                        ? "text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-600/20"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
              viewMode === "list"
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ListIcon />
            List
          </button>
        </div>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">No bookmarks yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
            Add your first bookmark to get started.
          </p>
          <a
            href="/add-bookmark"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg"
          >
            Add Bookmark
          </a>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedBookmarks.map((b) => (
            <BookmarkCard
              key={b.id}
              bookmark={b}
              onEdit={() => setEditingBookmark(b)}
              onShare={() => {}}
              onDelete={() => handleDelete(b)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedBookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#252830] rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 px-4 py-3"
              style={{ minHeight: 72 }}
            >
              <BookmarkLogo bookmark={b} size={BOOKMARK_LOGO_SIZE_PX} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{b.category}</p>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {b.name}
                </h3>
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
