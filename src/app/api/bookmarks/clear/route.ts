import { NextResponse } from "next/server";
import { clearUserBookmarks } from "@/lib/store";

/** DELETE: Clear only user-added bookmarks (DummyJSON data remains). */
export async function DELETE() {
  try {
    await clearUserBookmarks();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to clear bookmarks" },
      { status: 500 }
    );
  }
}
