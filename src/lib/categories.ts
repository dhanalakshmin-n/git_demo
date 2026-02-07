/** Default categories (~10). User can add more via Settings/Categories. */
export const DEFAULT_CATEGORIES = [
  { slug: "design", name: "Design" },
  { slug: "development", name: "Development" },
  { slug: "productivity", name: "Productivity" },
  { slug: "finance", name: "Finance" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "music", name: "Music" },
  { slug: "social-media", name: "Social Media" },
  { slug: "inspiration", name: "Inspiration" },
  { slug: "business", name: "Business" },
  { slug: "other", name: "Other" },
] as const;

export type DefaultCategorySlug = (typeof DEFAULT_CATEGORIES)[number]["slug"];
