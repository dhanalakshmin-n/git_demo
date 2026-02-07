"use client";

import { recordVisit } from "@/lib/recentVisits";

/**
 * Card actions per desired design: Edit, Share, Delete, Visit.
 * Small icon-only buttons in a row. Pass bookmarkId to track recent visits for Frequent.
 */
interface BookmarkCardActionsProps {
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  visitUrl?: string;
  visitLabel?: string;
  bookmarkId?: string;
}

const btnClass =
  "p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600/50 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500";

export function BookmarkCardActions({
  onEdit,
  onShare,
  onDelete,
  visitUrl,
  visitLabel = "Visit",
  bookmarkId,
}: BookmarkCardActionsProps) {
  const handleVisitClick = () => {
    if (bookmarkId) recordVisit(bookmarkId);
  };

  return (
    <div className="flex items-center gap-1">
      {onEdit != null && (
        <button type="button" onClick={onEdit} className={btnClass} title="Edit" aria-label="Edit bookmark">
          <EditIcon className="w-4 h-4" />
        </button>
      )}
      {onShare != null && (
        <button type="button" onClick={onShare} className={btnClass} title="Share" aria-label="Share bookmark">
          <ShareIcon className="w-4 h-4" />
        </button>
      )}
      {onDelete != null && (
        <button
          type="button"
          onClick={onDelete}
          className={`${btnClass} hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20`}
          title="Delete"
          aria-label="Delete bookmark"
        >
          <DeleteIcon className="w-4 h-4" />
        </button>
      )}
      {visitUrl && (
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleVisitClick}
          className={`${btnClass} text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300`}
          title={visitLabel}
        >
          <VisitIcon className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M17 2l-4 4-3-3 4-4a2 2 0 0 1 3 3z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15" cy="5" r="2.5" />
      <circle cx="5" cy="10" r="2.5" />
      <circle cx="15" cy="15" r="2.5" />
      <path d="M7.5 11l5-3M12.5 8.5l-5 3" />
    </svg>
  );
}

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
      <path d="M2 6h16M8 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2M8 10v4M12 10v4" />
    </svg>
  );
}

function VisitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4M14 4h4v4M10 10l4-4 4 4" />
    </svg>
  );
}
