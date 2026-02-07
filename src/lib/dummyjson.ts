/**
 * DummyJSON API client - https://dummyjson.com/
 * Products are mapped to our Bookmark shape for the app.
 */
import type { Bookmark } from "@/data/bookmarks";

const BASE = "https://dummyjson.com";

export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  thumbnail?: string;
  brand?: string;
  price?: number;
  [key: string]: unknown;
}

export interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyCategoryItem {
  slug: string;
  name: string;
  url?: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") || "uncategorized";
}

function categoryName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Map DummyJSON product category to our app category slug */
const DUMMY_TO_OUR_CATEGORY: Record<string, string> = {
  laptops: "development",
  tablets: "development",
  smartphones: "development",
  "mobile-accessories": "development",
  beauty: "design",
  fragrances: "design",
  "skin-care": "design",
  sunglasses: "design",
  "sports-accessories": "entertainment",
  vehicle: "entertainment",
  motorcycle: "entertainment",
  furniture: "business",
  "mens-shirts": "business",
  "mens-shoes": "business",
  "mens-watches": "business",
  tops: "business",
  "womens-shoes": "business",
  "womens-watches": "business",
  "womens-bags": "inspiration",
  "womens-dresses": "inspiration",
  "womens-jewellery": "inspiration",
  "home-decoration": "inspiration",
  "kitchen-accessories": "productivity",
  groceries: "other",
};

const OUR_CATEGORY_NAMES: Record<string, string> = {
  development: "Development",
  design: "Design",
  entertainment: "Entertainment",
  business: "Business",
  inspiration: "Inspiration",
  productivity: "Productivity",
  finance: "Finance",
  music: "Music",
  "social-media": "Social Media",
  other: "Other",
};

/** Map a DummyJSON product to our Bookmark type (no id - for seeding) */
export function productToBookmarkSeed(p: DummyProduct): Omit<Bookmark, "id"> {
  const rawSlug = (p.category || "other").toLowerCase().replace(/\s+/g, "-");
  const categorySlug = DUMMY_TO_OUR_CATEGORY[rawSlug] ?? "other";
  const category = OUR_CATEGORY_NAMES[categorySlug] ?? "Other";
  const url = `https://dummyjson.com/products/${p.id}`;
  const faviconDomain = "dummyjson.com";
  const rating = typeof p.rating === "number" ? Math.min(5, Math.max(0, p.rating)) : 0;
  const logoUrl =
    typeof p.thumbnail === "string" && p.thumbnail
      ? p.thumbnail
      : Array.isArray(p.images) && (p.images[0] as string)
        ? (p.images[0] as string)
        : undefined;
  return {
    name: p.title || "Untitled",
    description: (p.description || "").slice(0, 200),
    url,
    category,
    categorySlug,
    rating,
    faviconDomain,
    logoUrl,
  };
}

/** Map a DummyJSON product to our Bookmark type (with dummy id) */
export function productToBookmark(p: DummyProduct): Bookmark {
  const seed = productToBookmarkSeed(p);
  return { ...seed, id: `dummy-${p.id}` };
}

/** Fetch up to 20 products from DummyJSON for seeding; returns bookmarks without id */
export async function fetchDummyBookmarksForSeed(
  limit: number = 20
): Promise<Omit<Bookmark, "id">[]> {
  const res = await fetch(`${BASE}/products?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch DummyJSON products");
  const data = (await res.json()) as DummyProductsResponse;
  const products = Array.isArray(data.products) ? data.products.slice(0, limit) : [];
  return products.map(productToBookmarkSeed);
}

/** Fetch all products from DummyJSON (limit=0 to get all) and return as bookmarks */
export async function fetchDummyBookmarks(): Promise<Bookmark[]> {
  const res = await fetch(`${BASE}/products?limit=0`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch DummyJSON products");
  const data = (await res.json()) as DummyProductsResponse;
  const products = Array.isArray(data.products) ? data.products : [];
  return products.map(productToBookmark);
}

/** Fetch product categories from DummyJSON */
export async function fetchDummyCategories(): Promise<{ slug: string; name: string }[]> {
  const res = await fetch(`${BASE}/products/categories`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch DummyJSON categories");
  const data = (await res.json()) as DummyCategoryItem[];
  const list = Array.isArray(data) ? data : [];
  return list.map((c) => ({
    slug: c.slug || slugify(c.name || ""),
    name: c.name || categoryName(c.slug || ""),
  }));
}

/** Simulate adding a product (DummyJSON does not persist; returns mock response) */
export async function addDummyProduct(body: {
  title: string;
  description?: string;
  category?: string;
  rating?: number;
  brand?: string;
}): Promise<DummyProduct> {
  const res = await fetch(`${BASE}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: body.title,
      description: body.description ?? "",
      category: body.category ?? "uncategorized",
      rating: body.rating ?? 0,
      brand: body.brand ?? "MarkFlow",
    }),
  });
  if (!res.ok) throw new Error("DummyJSON add product failed");
  return res.json();
}
