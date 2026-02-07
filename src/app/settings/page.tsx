"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { StarRating } from "@/components/StarRating";
import { Toggle } from "@/components/Toggle";

export default function SettingsPage() {
  const { isDark, setTheme } = useTheme();
  const [autoFetch, setAutoFetch] = useState(true);
  const [defaultRating, setDefaultRating] = useState(3);
  const [importFileName, setImportFileName] = useState("No file chosen");
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/bookmarks/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "markflow-bookmarks.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  }

  async function handleClearAll() {
    if (!confirm("Clear all bookmarks you added? This cannot be undone. (DummyJSON data will remain.)")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/bookmarks/clear", { method: "DELETE" });
      if (res.ok) window.location.href = "/";
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        Settings
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Manage your app preferences
      </p>

      {/* 1. General Settings Card */}
      <section className="mb-6 p-5 rounded-xl bg-slate-200/80 dark:bg-[#252830] border border-slate-300 dark:border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Default category
            </label>
            <select className="w-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200">
              <option>Uncategorized</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Auto-fetch website data
            </label>
            <Toggle checked={autoFetch} onChange={setAutoFetch} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Default rating
            </label>
            <div className="flex items-center h-10">
              <StarRating
                value={defaultRating}
                size="md"
                readOnly={false}
                onChange={setDefaultRating}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Appearance Card */}
      <section className="mb-6 p-5 rounded-xl bg-slate-200/80 dark:bg-[#252830] border border-slate-300 dark:border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Dark Mode
            </label>
            <Toggle
              checked={isDark}
              onChange={(on) => setTheme(on ? "dark" : "light")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Language
            </label>
            <select className="w-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200">
              <option>English</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Bookmark Management Card */}
      <section className="p-5 rounded-xl bg-slate-200/80 dark:bg-[#252830] border border-slate-300 dark:border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Bookmark Management
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Export bookmarks
            </label>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg shadow-sm disabled:opacity-50"
            >
              <ExportIcon className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export data"}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Downloads your added bookmarks as .json
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Import bookmarks
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg cursor-pointer shadow-sm">
                <ImportIcon className="w-4 h-4" />
                Choose file
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setImportFileName(file ? file.name : "No file chosen");
                  }}
                />
              </label>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {importFileName}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg shadow-sm"
              >
                <ImportIcon className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Clear all bookmarks
            </label>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={clearing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
              {clearing ? "Clearing..." : "Clear all"}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Removes only the bookmarks you added. DummyJSON data stays.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ExportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14V4M10 4L6 8M10 4l4 4" />
      <path d="M4 12v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

function ImportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6v8M10 6L6 10M10 6l4 4" />
      <path d="M4 12v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
      <path d="M2 6h16M8 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2M8 10v4M12 10v4" />
    </svg>
  );
}
