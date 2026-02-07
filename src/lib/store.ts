import { promises as fs } from "fs";
import path from "path";
import type { Bookmark } from "@/data/bookmarks";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface UserData {
  userBookmarks: Bookmark[];
  userCategories: Category[];
}

function getDbPath(): string {
  return path.join(process.cwd(), "data", "db.json");
}

async function ensureDataDir(): Promise<void> {
  const dir = path.join(process.cwd(), "data");
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // ignore
  }
}

async function readUserData(): Promise<UserData> {
  await ensureDataDir();
  const filePath = getDbPath();
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as UserData;
    if (!Array.isArray(data.userBookmarks)) data.userBookmarks = [];
    if (!Array.isArray(data.userCategories)) data.userCategories = [];
    return data;
  } catch {
    return { userBookmarks: [], userCategories: [] };
  }
}

async function writeUserData(data: UserData): Promise<void> {
  await ensureDataDir();
  const filePath = getDbPath();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getUserBookmarks(): Promise<Bookmark[]> {
  const data = await readUserData();
  return data.userBookmarks;
}

export async function addUserBookmark(bookmark: Omit<Bookmark, "id">): Promise<Bookmark> {
  const data = await readUserData();
  const id = "user-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  const newBookmark: Bookmark = { ...bookmark, id };
  data.userBookmarks.push(newBookmark);
  await writeUserData(data);
  return newBookmark;
}

/** Add multiple bookmarks in one write (e.g. for seeding). */
export async function addUserBookmarksBatch(
  bookmarks: Omit<Bookmark, "id">[]
): Promise<Bookmark[]> {
  if (bookmarks.length === 0) return [];
  const data = await readUserData();
  const now = Date.now();
  const newOnes: Bookmark[] = bookmarks.map((b, i) => ({
    ...b,
    id: "user-" + (now + i) + "-" + Math.random().toString(36).slice(2, 9),
  }));
  data.userBookmarks.push(...newOnes);
  await writeUserData(data);
  return newOnes;
}

export async function clearUserBookmarks(): Promise<void> {
  const data = await readUserData();
  data.userBookmarks = [];
  await writeUserData(data);
}

export async function updateUserBookmark(
  id: string,
  updates: { rating?: number }
): Promise<Bookmark | null> {
  const data = await readUserData();
  const index = data.userBookmarks.findIndex((b) => b.id === id);
  if (index === -1) return null;
  if (typeof updates.rating === "number" && updates.rating >= 0 && updates.rating <= 5) {
    data.userBookmarks[index] = { ...data.userBookmarks[index], rating: updates.rating };
  }
  await writeUserData(data);
  return data.userBookmarks[index];
}

export async function deleteUserBookmark(id: string): Promise<boolean> {
  const data = await readUserData();
  const len = data.userBookmarks.length;
  data.userBookmarks = data.userBookmarks.filter((b) => b.id !== id);
  if (data.userBookmarks.length === len) return false;
  await writeUserData(data);
  return true;
}

export async function getUserCategories(): Promise<Category[]> {
  const data = await readUserData();
  return data.userCategories;
}

export async function addUserCategory(input: {
  name: string;
  icon?: string;
  color?: string;
}): Promise<Category> {
  const data = await readUserData();
  const slug =
    input.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "uncategorized";
  const existingSlug = data.userCategories.some((c) => c.slug === slug);
  const finalSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug;
  const id = "cat-" + finalSlug + "-" + Math.random().toString(36).slice(2, 8);
  const category: Category = {
    id,
    name: input.name.trim(),
    slug: finalSlug,
    icon: input.icon,
    color: input.color,
  };
  data.userCategories.push(category);
  await writeUserData(data);
  return category;
}
