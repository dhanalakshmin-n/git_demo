"use client";

import { useState } from "react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

const ICONS = [
  "laptop",
  "brain",
  "briefcase",
  "mobile",
  "dollar",
  "globe",
  "music",
  "documents",
  "books",
  "brain2",
  "camera",
  "gallery",
  "gamepad",
  "lightbulb",
  "mic",
  "compass",
];

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#84cc16", // light green
  "#14b8a6", // teal
  "#22c55e", // bright green
  "#3b82f6", // blue
  "#a855f7", // purple
  "#6b7280", // gray
  "#1e3a8a", // navy
];

function IconShape({ name, selected }: { name: string; selected: boolean }) {
  const base = "w-9 h-9 rounded-lg flex items-center justify-center border transition-colors " + (selected ? "bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-slate-400 dark:border-slate-500 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-400");
  const Icon = () => {
    switch (name) {
      case "laptop":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2" /><path d="M2 18h20" /></svg>;
      case "brain":
      case "brain2":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /><path d="M9 12c-2 1-3 3-3 5a4 4 0 0 0 8 0c0-2-1-4-3-5" /></svg>;
      case "briefcase":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
      case "mobile":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>;
      case "dollar":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
      case "globe":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" /></svg>;
      case "music":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
      case "documents":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
      case "books":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
      case "camera":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
      case "gallery":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>;
      case "gamepad":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01M17 16H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" /></svg>;
      case "lightbulb":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M15 8a3 3 0 1 0-6 0c0 1.5.5 2.5 1 3.5.5 1 1 2 1 3.5v1H9v-1c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5z" /></svg>;
      case "mic":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>;
      case "compass":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>;
      default:
        return <span className="text-xs">?</span>;
    }
  };
  return <div className={base}><Icon /></div>;
}

export function AddCategoryModal({ isOpen, onClose, onAdded }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>(ICONS[2]);
  const [selectedColor, setSelectedColor] = useState(COLORS[6]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create category");
      }
      setName("");
      onAdded?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg bg-slate-100 dark:bg-[#252830] rounded-xl shadow-xl p-6 text-slate-900 dark:text-slate-100">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          Add New Category
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Create a new category to organize your bookmarks
        </p>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category Name <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name..."
              className="w-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className="focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-200 rounded-lg"
                >
                  <IconShape name={icon} selected={selectedIcon === icon} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Choose color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full border-2 transition-transform focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-200"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#3b82f6" : "transparent",
                    boxShadow: selectedColor === color ? "0 0 0 2px white, 0 0 0 4px #3b82f6" : undefined,
                    transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
                  }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCreate}
            disabled={submitting}
            className="w-full py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Category"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-200 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
