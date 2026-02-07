"use client";

const iconClass = "w-5 h-5 flex-shrink-0";

export function HomeIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l7-7 7 7v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z" />
      <path d="M8 12h4" />
    </svg>
  );
}

export function GridIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="5" rx="0.5" />
      <rect x="12" y="3" width="5" height="5" rx="0.5" />
      <rect x="3" y="12" width="5" height="5" rx="0.5" />
      <rect x="12" y="12" width="5" height="5" rx="0.5" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 2" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M12 8l-2 4-2-1 2-4 2 1z" />
    </svg>
  );
}

export function PlusCircleIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v8M6 10h8" />
    </svg>
  );
}

export function SettingsIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2v2M10 16v2M17.66 4.34l-1.42 1.42M3.76 14.24l-1.42 1.42M18 10h2M0 10h2M16.24 4.76l1.42-1.42M3.76 5.76L2.34 4.34" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5" />
      <path d="M14 14l4 4" />
    </svg>
  );
}

export function SortIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8l4-4 4 4M6 12l4 4 4-4" />
    </svg>
  );
}

export function ListIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h12M4 10h12M4 15h12" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}
