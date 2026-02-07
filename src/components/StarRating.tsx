"use client";

import { useId } from "react";

interface StarRatingProps {
  /** Supports half stars (e.g. 4.5) */
  value: number;
  max?: number;
  size?: "sm" | "md";
  /** When set, stars are clickable to set rating */
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const sizeClasses = { sm: "w-3.5 h-3.5", md: "w-5 h-5" };

export function StarRating({
  value,
  max = 5,
  size = "sm",
  onChange,
  readOnly = true,
}: StarRatingProps) {
  const s = sizeClasses[size];
  const clamped = Math.min(max, Math.max(0, value));
  const halfClipId = useId();
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${clamped} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = clamped >= starValue;
        const half = !filled && clamped > i && clamped < starValue;
        return (
          <span
            key={i}
            role={readOnly ? undefined : "button"}
            onClick={() => !readOnly && onChange?.(starValue)}
            className={!readOnly ? "cursor-pointer" : ""}
          >
            {filled ? (
              <StarFilled className={`${s} text-amber-400`} />
            ) : half ? (
              <StarHalf className={`${s} text-amber-400`} clipId={halfClipId + i} />
            ) : (
              <StarEmpty className={`${s} text-slate-500`} />
            )}
          </span>
        );
      })}
    </span>
  );
}

function StarFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function StarEmpty({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" opacity={0.4} />
    </svg>
  );
}

function StarHalf({ className, clipId }: { className?: string; clipId: string }) {
  const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="10" height="20" />
        </clipPath>
      </defs>
      <path fillRule="evenodd" d={starPath} clipRule="evenodd" opacity={0.35} />
      <path fillRule="evenodd" d={starPath} clipRule="evenodd" clipPath={`url(#${clipId})`} />
    </svg>
  );
}
