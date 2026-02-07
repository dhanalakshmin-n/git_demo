import { NextResponse } from "next/server";
import { updateUserBookmark, deleteUserBookmark } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const { rating } = body as { rating?: number };
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "rating must be a number 0–5" },
        { status: 400 }
      );
    }
    const updated = await updateUserBookmark(id, { rating });
    if (!updated) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const deleted = await deleteUserBookmark(id);
    if (!deleted) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
