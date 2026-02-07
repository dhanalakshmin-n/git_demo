import { NextResponse } from "next/server";
import { getUserBookmarks, addUserBookmark, addUserBookmarksBatch } from "@/lib/store";
import { fetchDummyBookmarksForSeed } from "@/lib/dummyjson";

function getFaviconDomain(urlString: string): string {
  try {
    const u = new URL(urlString);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "example.com";
  }
}

/** GET: Return user bookmarks. If none exist, seed 20 from DummyJSON then return. */
export async function GET() {
  try {
    let bookmarks = await getUserBookmarks();
    if (bookmarks.length === 0) {
      try {
        const seed = await fetchDummyBookmarksForSeed(20);
        if (seed.length > 0) {
          await addUserBookmarksBatch(seed);
          bookmarks = await getUserBookmarks();
        }
      } catch (seedErr) {
        console.error("Seed from DummyJSON failed:", seedErr);
      }
    }
    return NextResponse.json(bookmarks);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load bookmarks" },
      { status: 500 }
    );
  }
}

/** POST: Add a bookmark (to selected category). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      url,
      name,
      description,
      categorySlug,
      category,
      rating,
    } = body as {
      url?: string;
      name?: string;
      description?: string;
      categorySlug?: string;
      category?: string;
      rating?: number;
    };

    if (!url || typeof url !== "string" || !name || typeof name !== "string") {
      return NextResponse.json(
        { error: "URL and name are required" },
        { status: 400 }
      );
    }

    const slug =
      typeof categorySlug === "string" && categorySlug
        ? categorySlug
        : typeof category === "string" && category
          ? category.toLowerCase().trim().replace(/\s+/g, "-")
          : "other";

    const faviconDomain = getFaviconDomain(url);
    const categoryName =
      typeof category === "string" && category ? category : slug.replace(/-/g, " ");

    const newBookmark = await addUserBookmark({
      url: url.trim(),
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      category: categoryName,
      categorySlug: slug,
      rating: typeof rating === "number" && rating >= 0 && rating <= 5 ? rating : 0,
      faviconDomain,
    });

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}
