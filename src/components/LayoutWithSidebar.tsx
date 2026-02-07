"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MarkflowLogo } from "./MarkflowLogo";
import { useAuth } from "@/context/AuthContext";
import {
  HomeIcon,
  GridIcon,
  ClockIcon,
  CompassIcon,
  PlusCircleIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,
} from "./NavIcons";

const navItems = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/categories", label: "Categories", Icon: GridIcon },
  { href: "/frequent", label: "Frequent", Icon: ClockIcon },
  { href: "/explore", label: "Explore", Icon: CompassIcon },
  { href: "/add-bookmark", label: "Add Bookmark", Icon: PlusCircleIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f1117]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-[#1a1d24] border-r border-slate-200 dark:border-slate-700/50 flex flex-col">
        <MarkflowLogo />
        <div className="p-4 flex-1">
          <nav className="space-y-0.5">
            {navItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-600/20 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
          <p className="text-xs text-slate-500">© 2025 Markflow. Zakaria Zyami</p>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex-shrink-0 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#15171c] flex items-center justify-between px-6 gap-4">
          <div className="flex-1 min-w-0 max-w-xl flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600/50 rounded-lg px-3 py-2">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search anything..."
              className="flex-1 min-w-0 bg-transparent text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <Link
            href="/add-bookmark"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <PlusIcon />
            New Bookmark
          </Link>
        </header>

        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
