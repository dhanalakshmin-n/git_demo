"use client";

import type { Bookmark } from "@/data/bookmarks";
import {
  BOOKMARK_CARD_WIDTH_PX,
  BOOKMARK_CARD_HEIGHT_PX,
  BOOKMARK_LOGO_SIZE_PX,
} from "@/data/bookmarks";
import { StarRating } from "./StarRating";
import { BookmarkCardActions } from "./BookmarkCardActions";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (bookmark: Bookmark) => void;
  onShare?: (bookmark: Bookmark) => void;
  onDelete?: (bookmark: Bookmark) => void;
}

function Favicon({ domain, size }: { domain: string; size: number }) {
  const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="rounded-lg flex-shrink-0 object-cover bg-slate-200 dark:bg-slate-700"
      loading="lazy"
    />
  );
}

/** Bookmark logo: uses logoUrl when set (e.g. product image), otherwise favicon from domain */
export function BookmarkLogo({
  bookmark,
  size,
  className = "rounded-lg flex-shrink-0 object-cover bg-slate-200 dark:bg-slate-700",
}: {
  bookmark: Bookmark;
  size: number;
  className?: string;
}) {
  if (bookmark.logoUrl) {
    return (
      <img
        src={bookmark.logoUrl}
        alt=""
        width={size}
        height={size}
        className={className}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.faviconDomain)}&sz=${size}`;
        }}
      />
    );
  }
  return <Favicon domain={bookmark.faviconDomain} size={size} />;
}

export function BookmarkCard({ bookmark, onEdit, onShare, onDelete }: BookmarkCardProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: bookmark.name, text: bookmark.description, url: bookmark.url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(bookmark.url);
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#252830] rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
      style={{
        width: BOOKMARK_CARD_WIDTH_PX,
        minWidth: BOOKMARK_CARD_WIDTH_PX,
        height: BOOKMARK_CARD_HEIGHT_PX,
        minHeight: BOOKMARK_CARD_HEIGHT_PX,
      }}
    >
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-start gap-3 mb-2">
          <BookmarkLogo
            bookmark={bookmark}
            size={BOOKMARK_LOGO_SIZE_PX}
            className="rounded-lg flex-shrink-0 object-cover bg-slate-200 dark:bg-slate-700"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {bookmark.name}
            </h3>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
          {bookmark.description}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <StarRating value={bookmark.rating} readOnly />
          <span className="inline-block px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium">
            {bookmark.category}
          </span>
        </div>
        <div className="flex items-center justify-end gap-1 mt-2">
          <BookmarkCardActions
            onEdit={onEdit ? () => onEdit(bookmark) : undefined}
            onShare={handleShare}
            onDelete={onDelete ? () => onDelete(bookmark) : undefined}
            visitUrl={bookmark.url}
            visitLabel="Visit"
            bookmarkId={bookmark.id}
          />
        </div>
      </div>
    </div>
  );
}
