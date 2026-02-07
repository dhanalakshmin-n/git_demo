"use client";

import { useState } from "react";
import type { Bookmark } from "@/data/bookmarks";
import { StarRating } from "./StarRating";

interface EditBookmarkModalProps {
  bookmark: Bookmark | null;
  onClose: () => void;
  onSaved: (updated: Bookmark) => void;
}

export function EditBookmarkModal({
  bookmark,
  onClose,
  onSaved,
}: EditBookmarkModalProps) {
  const [rating, setRating] = useState(bookmark?.rating ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!bookmark) return null;

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update");
      }
      const updated = await res.json();
      onSaved(updated);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-xl bg-white dark:bg-[#252830] border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Edit bookmark
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-4">
          {bookmark.name}
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Star rating
          </label>
          <StarRating
            value={rating}
            size="md"
            readOnly={false}
            onChange={setRating}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 mb-3">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
