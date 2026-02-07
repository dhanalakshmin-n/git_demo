import { NextResponse } from "next/server";
import { getUserBookmarks } from "@/lib/store";

/** GET: Export user-added bookmarks as JSON (for .json download). */
export async function GET() {
  try {
    const userBookmarks = await getUserBookmarks();
    return NextResponse.json(
      { bookmarks: userBookmarks, exportedAt: new Date().toISOString() },
      { headers: { "Content-Disposition": 'attachment; filename="markflow-bookmarks.json"' } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to export bookmarks" },
      { status: 500 }
    );
  }
}
