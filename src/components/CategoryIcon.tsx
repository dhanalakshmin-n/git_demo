"use client";

const iconClass = "w-6 h-6 text-slate-400";

export function CategoryIcon({ slug }: { slug: string }) {
  const props = { className: iconClass, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (slug) {
    case "all":
      return <svg {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><path d="M12 11m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /></svg>;
    case "development":
      return <svg {...props}><rect x="2" y="4" width="20" height="14" rx="2" /><path d="M2 18h20" /><path d="M6 8h.01M10 8h.01" /></svg>;
    case "inspiration":
      return <svg {...props}><path d="M9 18h6M10 22h4M15 8a3 3 0 1 0-6 0c0 1.5.5 2.5 1 3.5.5 1 1 2 1 3.5v1H9v-1c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5z" /></svg>;
    case "entertainment":
      return <svg {...props}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M7 6v12M17 6v12M2 10h20M2 14h20" /></svg>;
    case "design":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a14 14 0 0 0 0 20 14 14 0 0 0 0-20" /><path d="M2 12h20" /></svg>;
    case "social-media":
      return <svg {...props}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>;
    case "ai-tool":
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /><path d="M9 12l1 1 2-2" /></svg>;
    case "music":
      return <svg {...props}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
    case "finance":
      return <svg {...props}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
    case "business":
      return <svg {...props}><path d="M3 3v18h18" /><path d="M18 9l-5-5-4 4-3-3" /><path d="M18 13v5" /></svg>;
    case "book":
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M8 7h8M8 11h8" /></svg>;
    default:
      return <svg {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
  }
}
