"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { SearchIcon } from "@/components/NavIcons";

type CategoryOption = { id: string; slug: string; name: string };

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M17 2l-4 4-3-3 4-4a2 2 0 0 1 3 3z" />
    </svg>
  );
}

export default function AddBookmarkPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [rating, setRating] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CategoryOption[]) => {
        setCategories(data);
        if (data.length && !data.some((c) => c.slug === category)) {
          setCategory(data[0].slug);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  function getFaviconUrl(urlString: string) {
    try {
      const u = new URL(urlString);
      return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=128`;
    } catch {
      return null;
    }
  }

  async function handleGetData() {
    const u = url?.trim();
    if (!u) {
      setError("Paste a URL first");
      return;
    }
    setError(null);
    setFetching(true);
    try {
      const res = await fetch(`/api/fetch-page-info?url=${encodeURIComponent(u)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setName("");
        setDescription("");
        const msg = data.error || "Could not fetch page info";
        setError(
          msg +
            ". Some sites block automated requests or load title/description with JavaScript—you can type name and description manually."
        );
        return;
      }
      setName(data.title ?? "");
      setDescription(data.description ?? "");
      setLogoUrl(getFaviconUrl(u));
    } catch {
      setError(
        "Could not fetch page info. Check the URL or enter name and description manually."
      );
    } finally {
      setFetching(false);
    }
  }

  const displayLogoUrl = logoUrl ?? (url?.trim() ? getFaviconUrl(url.trim()) : null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!url?.trim() || !name?.trim()) {
      setError("URL and name are required. Paste a URL and click Get data to fill name.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          name: name.trim(),
          description: description.trim(),
          categorySlug: category || undefined,
          category: category ? categories.find((c) => c.slug === category)?.name : undefined,
          rating,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save bookmark");
      }
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save bookmark");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        Add New Bookmark
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Save a new bookmark to your collection
      </p>
      {error && (
        <p className="mb-4 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            URL <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL here (e.g. https://example.com)"
              className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleGetData}
              disabled={fetching || !url?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span className="text-white [&_svg]:text-white">
                <SearchIcon />
              </span>
              {fetching ? "Fetching…" : "Get data"}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Paste a URL and click Get data to fill name and description from the page.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-500 dark:text-slate-400 p-2" aria-hidden>
              <PencilIcon className="w-5 h-5" />
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-500 dark:text-slate-400 p-2" aria-hidden>
              <PencilIcon className="w-5 h-5" />
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Logo
            </label>
            <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
              {displayLogoUrl ? (
                <img
                  src={displayLogoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-500 text-xs">Logo</span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bookmark Rating
            </label>
            <div className="h-14 flex items-center">
              <StarRating
                value={rating}
                size="md"
                readOnly={false}
                onChange={setRating}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-lg transition-colors shadow-sm border border-slate-200 dark:border-slate-600 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Bookmark"}
        </button>
      </form>
    </div>
  );
}
