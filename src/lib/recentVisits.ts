/** Track recently visited bookmark IDs for the Frequent page (client-side only). */
const STORAGE_KEY = "markflow-recent-visits";

export type RecentVisits = Record<string, string>; // id -> ISO timestamp

export function getRecentVisits(): RecentVisits {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as RecentVisits;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function recordVisit(bookmarkId: string): void {
  if (typeof window === "undefined") return;
  const visits = getRecentVisits();
  visits[bookmarkId] = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    // ignore
  }
}

/** Sort bookmark IDs by most recently visited first (unknown ids at end). */
export function sortIdsByRecent(ids: string[], visits: RecentVisits): string[] {
  return [...ids].sort((a, b) => {
    const ta = visits[a] ? new Date(visits[a]).getTime() : 0;
    const tb = visits[b] ? new Date(visits[b]).getTime() : 0;
    return tb - ta;
  });
}

/** Get add-time from user- timestamp id (e.g. user-1738123456789-abc). */
export function getAddTimeFromId(id: string): number {
  const m = id.match(/^user-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/** Get "last activity" time for a bookmark: most recent of visit time or add time. */
export function getLastActivityTime(bookmarkId: string, visits: RecentVisits): number {
  const visitTime = visits[bookmarkId] ? new Date(visits[bookmarkId]).getTime() : 0;
  const addTime = getAddTimeFromId(bookmarkId);
  return Math.max(visitTime, addTime);
}
