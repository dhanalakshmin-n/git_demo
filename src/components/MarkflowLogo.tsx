"use client";

import Link from "next/link";

/**
 * Markflow logo – fixed size 140×106.
 */
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 106;

export function MarkflowLogo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-start px-4 pt-4 pb-3 border-b border-slate-700/50 mb-2 w-full"
      aria-label="Markflow Home"
    >
      <img
        src="/logo.png"
        alt="Markflow"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="object-contain object-left flex-shrink-0"
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT, minWidth: LOGO_WIDTH, minHeight: LOGO_HEIGHT, maxWidth: LOGO_WIDTH, maxHeight: LOGO_HEIGHT }}
      />
    </Link>
  );
}
