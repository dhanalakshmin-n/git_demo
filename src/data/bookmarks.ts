export interface Bookmark {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  categorySlug: string;
  /** 1–5 star rating */
  rating: number;
  /** Domain for favicon (e.g. "slack.com") */
  faviconDomain: string;
  /** Optional direct image URL for the bookmark logo (e.g. product thumbnail) */
  logoUrl?: string;
}

/** Fixed card size to match PDF (same for every box) */
export const BOOKMARK_CARD_WIDTH_PX = 280;
export const BOOKMARK_CARD_HEIGHT_PX = 224;
/** Logo size inside card (PDF) */
export const BOOKMARK_LOGO_SIZE_PX = 40;

export const bookmarks: Bookmark[] = [
  { id: "1", name: "Slack", description: "Team communication and collaboration platform", url: "https://slack.com", category: "Productivity", categorySlug: "productivity", rating: 4.5, faviconDomain: "slack.com" },
  { id: "2", name: "Paypal", description: "Secure online payments and money transfers", url: "https://www.paypal.com", category: "Finance", categorySlug: "finance", rating: 5, faviconDomain: "paypal.com" },
  { id: "3", name: "Pinterest", description: "Discover and save creative ideas visually", url: "https://www.pinterest.com", category: "Inspiration", categorySlug: "inspiration", rating: 4.5, faviconDomain: "pinterest.com" },
  { id: "4", name: "Chatgpt", description: "AI-powered chatbot for conversation and assistance", url: "https://chat.openai.com", category: "Ai Tool", categorySlug: "ai-tool", rating: 5, faviconDomain: "chat.openai.com" },
  { id: "5", name: "Spotify", description: "Stream millions of songs and podcasts", url: "https://www.spotify.com", category: "Music", categorySlug: "music", rating: 5, faviconDomain: "spotify.com" },
  { id: "6", name: "Instagram", description: "Share photos, videos, and stories", url: "https://www.instagram.com", category: "Social Media", categorySlug: "social-media", rating: 4, faviconDomain: "instagram.com" },
  { id: "7", name: "Figma", description: "Cloud-based UI/UX design tool", url: "https://www.figma.com", category: "Design", categorySlug: "design", rating: 5, faviconDomain: "figma.com" },
  { id: "8", name: "Adobe", description: "Creative software for design, photo, and video", url: "https://www.adobe.com", category: "Creative Tools", categorySlug: "creative-tools", rating: 4, faviconDomain: "adobe.com" },
  { id: "9", name: "Netflix", description: "Watch movies, TV shows, and originals", url: "https://www.netflix.com", category: "Entertainment", categorySlug: "entertainment", rating: 5, faviconDomain: "netflix.com" },
  { id: "10", name: "Linkedin", description: "Professional networking and career growth", url: "https://www.linkedin.com", category: "Business", categorySlug: "business", rating: 4, faviconDomain: "linkedin.com" },
  { id: "11", name: "Reddit", description: "Community-driven discussions on any topic", url: "https://www.reddit.com", category: "Forum", categorySlug: "forum", rating: 4, faviconDomain: "reddit.com" },
  { id: "12", name: "3D icon", description: "Free high-quality 3D icons for design", url: "https://www.google.com", category: "Design Resources", categorySlug: "design-resources", rating: 3, faviconDomain: "google.com" },
];

/** Category list (counts are computed from bookmarks via getCategoriesWithCounts) */
export const categoryList = [
  { slug: "all", name: "All" },
  { slug: "development", name: "Development" },
  { slug: "inspiration", name: "Inspiration" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "design", name: "Design" },
  { slug: "social-media", name: "Social Media" },
  { slug: "ai-tool", name: "Ai Tool" },
  { slug: "music", name: "Music" },
  { slug: "finance", name: "Finance" },
  { slug: "business", name: "Business" },
  { slug: "book", name: "Book" },
] as const;

export type CategorySlug = (typeof categoryList)[number]["slug"];

export function bookmarkMatchesCategory(bookmark: Bookmark, slug: string): boolean {
  if (slug === "all") return true;
  const slugNorm = slug.toLowerCase().replace(/\s+/g, "-");
  return (
    bookmark.categorySlug === slugNorm ||
    bookmark.category.toLowerCase().replace(/\s+/g, "-") === slugNorm
  );
}

/** Returns categories with counts derived from actual bookmarks (same logic as category detail page). */
export function getCategoriesWithCounts(bookmarksList: Bookmark[]) {
  return categoryList.map(({ slug, name }) => ({
    slug,
    name,
    count: bookmarksList.filter((b) => bookmarkMatchesCategory(b, slug)).length,
  }));
}

/** @deprecated Use getCategoriesWithCounts(bookmarks) for accurate counts */
export const categories = getCategoriesWithCounts(bookmarks);

export const exploreTopics = [
  "Development", "Inspiration", "Entertainment", "Design", "Social Media", "Ai Tool",
  "Music", "Finance", "Fitness", "Travel", "Book", "Business",
];
