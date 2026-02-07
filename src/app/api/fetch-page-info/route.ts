import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Decode common HTML entities in extracted text */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .trim();
}

/** Extract content from meta tag - handles content="..." or content='...' and attribute order */
function extractMetaContent(
  html: string,
  attr: "property" | "name",
  value: string
): string | null {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // property="og:description" content="..." or content="..." property="og:description"
  const patterns = [
    new RegExp(
      `${attr}=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `content=["']([^"']*)["'][^>]+${attr}=["']${escaped}["']`,
      "i"
    ),
    new RegExp(
      `${attr}=["']${escaped}["'][^>]+content=[']([^']*)[']`,
      "i"
    ),
    new RegExp(
      `content=[']([^']*)['][^>]+${attr}=["']${escaped}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return decodeHtmlEntities(m[1].trim());
  }
  return null;
}

/** GET ?url=... - Fetch URL server-side and return page title + meta description for Add Bookmark. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "url query is required" },
        { status: 400 }
      );
    }
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: "Invalid URL protocol" },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: 400 }
      );
    }
    const html = await res.text();

    let title = "";
    let description = "";

    // Title: <title>...</title> first
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = decodeHtmlEntities(
        titleMatch[1].replace(/<[^>]+>/g, "").trim()
      );
    }
    // Fallback: og:title
    if (!title) {
      const ogTitle = extractMetaContent(html, "property", "og:title");
      if (ogTitle) title = ogTitle;
    }
    if (!title) title = "Untitled";

    // Description: og:description first, then name="description", then twitter:description
    const ogDesc = extractMetaContent(html, "property", "og:description");
    if (ogDesc) description = ogDesc;
    if (!description) {
      const metaDesc = extractMetaContent(html, "name", "description");
      if (metaDesc) description = metaDesc;
    }
    if (!description) {
      const twDesc = extractMetaContent(html, "name", "twitter:description");
      if (twDesc) description = twDesc;
    }
    if (!description && title && title !== "Untitled") description = title;
    if (description && description.length > 500) {
      description = description.slice(0, 497).trim() + "...";
    }

    return NextResponse.json({
      title,
      description: description || "",
    });
  } catch (e) {
    console.error("fetch-page-info error:", e);
    const message =
      e instanceof Error ? e.message : "Could not fetch page info";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
