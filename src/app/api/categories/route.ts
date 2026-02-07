import { NextResponse } from "next/server";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { getUserCategories, addUserCategory, getUserBookmarks } from "@/lib/store";

/** Categories = default ~10 + user-created. With counts from user bookmarks only. */
async function getMergedCategories(withCounts: boolean) {
  const [userCats, userBookmarks] = await Promise.all([
    getUserCategories(),
    withCounts ? getUserBookmarks() : Promise.resolve([]),
  ]);

  const defaultSlugs = new Set<string>(DEFAULT_CATEGORIES.map((c) => c.slug));
  const list = [
    ...DEFAULT_CATEGORIES.map((c) => ({ id: c.slug, slug: c.slug, name: c.name })),
    ...userCats.filter((u) => !defaultSlugs.has(u.slug)),
  ];

  if (!withCounts) {
    return list.map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
  }

  return list.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    count: userBookmarks.filter(
      (b) =>
        b.categorySlug === c.slug ||
        (b.category && b.category.toLowerCase().replace(/\s+/g, "-") === c.slug)
    ).length,
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get("withCounts") === "true";
    const categories = await getMergedCategories(withCounts);
    return NextResponse.json(categories);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color } = body as {
      name?: string;
      icon?: string;
      color?: string;
    };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const category = await addUserCategory({
      name: name.trim(),
      icon: typeof icon === "string" ? icon : undefined,
      color: typeof color === "string" ? color : undefined,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
