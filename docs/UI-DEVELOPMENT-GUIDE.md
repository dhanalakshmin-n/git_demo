# MarkFlow UI – Development Guide (From Scratch)

This document describes how the MarkFlow bookmark manager UI was built and where to change each part of the application.

---

## 1. Overview & Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with `darkMode: "class"`
- **State:** React state + Context (Auth, Theme); no external state library
- **Data:** File-based store (`data/db.json`) + REST API routes; optional seed from DummyJSON

**Relevant config files:**
- `tailwind.config.ts` – Tailwind (dark mode, content paths, custom colors)
- `src/app/globals.css` – Base body styles and dark theme overrides
- `package.json` – Scripts: `npm run dev`, `npm run build`, `npm run start`

---

## 2. Project Structure

```
src/
├── app/                    # Next.js App Router (routes + layout)
│   ├── layout.tsx          # Root layout (providers, html/body)
│   ├── globals.css         # Global styles
│   ├── page.tsx            # Home (/)
│   ├── login/page.tsx      # Login (/login)
│   ├── add-bookmark/       # Add bookmark form (/add-bookmark)
│   ├── categories/         # Categories list + detail
│   │   ├── page.tsx        # /categories
│   │   └── [slug]/page.tsx # /categories/[slug]
│   ├── frequent/page.tsx   # Frequently/recently used (/frequent)
│   ├── explore/page.tsx    # Explore by category (/explore)
│   ├── settings/page.tsx   # Settings (/settings)
│   └── api/                # API routes
│       ├── auth/           # login, logout, session
│       ├── bookmarks/      # CRUD, clear, export
│       ├── categories/     # list + create
│       └── fetch-page-info/# fetch URL title/description
├── components/             # Reusable UI components
├── context/                # AuthContext, ThemeContext
├── data/                   # Bookmark type + constants (bookmarks.ts)
└── lib/                    # Store, categories, dummyjson, recentVisits
```

---

## 3. App Entry & Layout

### 3.1 Root layout – `src/app/layout.tsx`

- Wraps the app with **ThemeProvider** and **AuthProvider**.
- Renders **AuthGuard** around `children`; AuthGuard decides whether to show login, loading, or **LayoutWithSidebar** (main app).
- Inline script in `<head>` reads `markflow-theme` from `localStorage` and sets `dark` class on `<html>` before paint to avoid theme flash.

**To change:**
- App title/description: edit `metadata` in `layout.tsx`.
- Add a global provider: wrap `children` (or AuthGuard) inside `layout.tsx`.

### 3.2 Auth guard – `src/components/AuthGuard.tsx`

- Uses **useAuth()** and **usePathname()**.
- If not authenticated and not on `/login`, redirects to `/login`.
- If on `/login` and authenticated, redirects to `/`.
- Loading: shows a full-screen “Loading...” message.
- For authenticated users (and not on login), renders **LayoutWithSidebar** with `children` (the page for the current route).

**To change:**
- Login path: constant `LOGIN_PATH` in `AuthGuard.tsx`.
- Loading UI: the loading `return` block in `AuthGuard.tsx`.

### 3.3 Theme – `src/context/ThemeContext.tsx`

- Provides `theme`, `setTheme`, `isDark`.
- Persists theme in `localStorage` under `markflow-theme` and applies `dark` class on `document.documentElement`.
- Used by Settings “Dark Mode” toggle and any component that needs theme.

**To change:**
- Default theme: initial state in ThemeProvider (and the script in `layout.tsx` fallback).
- Storage key: `STORAGE_KEY` in `ThemeContext.tsx`.

### 3.4 Auth – `src/context/AuthContext.tsx`

- Provides `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`.
- Session is checked via `GET /api/auth/session`; login/logout call the corresponding API routes.

**To change:**
- Login/logout/session behavior: `AuthContext.tsx` and `src/app/api/auth/*`.

---

## 4. Layout & Navigation (Main App Shell)

### 4.1 Shell – `src/components/LayoutWithSidebar.tsx`

- **Sidebar (left):**
  - **MarkflowLogo** at top.
  - Nav links: Home, Categories, Frequent, Explore, Add Bookmark, Settings (from `navItems`).
  - Active link styling: indigo background for current route.
  - Footer: copyright text and “Log out” button (calls `logout()` and redirects to `/login`).
- **Main area:**
  - **Header:** search input (placeholder “Search anything...”) and “New Bookmark” button (links to `/add-bookmark`).
  - Content: `children` (the current page) in a scrollable area.

**To change:**
- Sidebar width: `w-56` on `<aside>`.
- Nav items: edit the `navItems` array (href, label, Icon).
- Header search: the search `<input>` and its placeholder in the header.
- “New Bookmark” button: the `<Link>` to `/add-bookmark` and its text.
- Footer text: the copyright and “Log out” paragraph/button.
- Sidebar/header/main colors: Tailwind classes on `aside`, `header`, and `main` (including `dark:` variants).

### 4.2 Logo – `src/components/MarkflowLogo.tsx`

- Renders the MarkFlow logo image and “MARKFLOW” text in the sidebar.

**To change:**
- Logo image: path used in `MarkflowLogo.tsx` (e.g. `/logo.png` in `public/`).
- Logo size: width/height or class on the logo element.
- Text: the label next to the logo in `MarkflowLogo.tsx`.

### 4.3 Nav icons – `src/components/NavIcons.tsx`

- Exports icon components used in sidebar and header: Home, Grid (Categories), Clock (Frequent), Compass (Explore), PlusCircle (Add Bookmark), Settings, Search, Plus, Sort, List, etc.

**To change:**
- Icon appearance: edit the SVG in the corresponding component in `NavIcons.tsx`.
- Using a different icon for a nav item: change the `Icon` in `navItems` in `LayoutWithSidebar.tsx`.

---

## 5. Pages & Routes (Where to Change What)

### 5.1 Home – `src/app/page.tsx`  
**Route:** `/`

- Fetches bookmarks from `GET /api/bookmarks` (with optional seed of 20 from DummyJSON when empty).
- **Sort:** Dropdown options – “Recently added” (default), “Rating: High/Low”, “Name: A–Z / Z–A”. Sorting is done in `sortBookmarks()` using either `getAddTime()` (from id) or rating/name.
- **View:** Grid (cards) or List (rows). Toggle buttons “Sort” and “List”.
- **Empty state:** Message + “Add Bookmark” link when there are no bookmarks.
- **Edit:** Opens **EditBookmarkModal** (star rating only).
- **Delete:** Confirmation then `DELETE /api/bookmarks/[id]` and refetch.
- **Share / Visit:** Share via Web Share or clipboard; Visit opens URL and records visit for Frequent.

**To change:**
- Default sort: `useState<SortOption>("recently-added")` and the first option in `SORT_OPTIONS`.
- Sort options: `SORT_OPTIONS` and `sortBookmarks()` in `page.tsx`.
- Card vs list layout: the grid and list blocks in `page.tsx`.
- Empty state copy: the empty-state div and link.
- Refetch after add: bookmarks are refetched on mount; after add you navigate from Add Bookmark page, so home refetches on next visit or you could add a refresh.

### 5.2 Login – `src/app/login/page.tsx`  
**Route:** `/login`

- Form: email, password; submit calls `login()` from AuthContext.
- Demo hint: “Demo: demo@markflow.com / demo123”.
- Redirects to `/` on success; shows error message on failure.
- Themed: uses `dark:` classes for background, card, inputs, and text.

**To change:**
- Layout/copy: JSX and text in `login/page.tsx`.
- Demo credentials: only in the hint text; actual check is in `src/app/api/auth/login/route.ts`.

### 5.3 Add Bookmark – `src/app/add-bookmark/page.tsx`  
**Route:** `/add-bookmark`

- **URL:** Required. “Get data” calls `GET /api/fetch-page-info?url=...` and fills name + description (and favicon).
- **Name, description:** Prefilled by “Get data” or manual.
- **Category:** Dropdown from `GET /api/categories` (default + user-created). Default selection “other”.
- **Rating:** Star rating component.
- **Logo:** Favicon from URL (or from fetched data).
- Submit: `POST /api/bookmarks` then redirect to `/`.

**To change:**
- Form fields/labels: the form and labels in `add-bookmark/page.tsx`.
- “Get data” behavior: `handleGetData()` and `src/app/api/fetch-page-info/route.ts`.
- Category default: initial `category` state and the first option in the categories dropdown.
- Success redirect: `router.push("/")` after POST.

### 5.4 Categories list – `src/app/categories/page.tsx`  
**Route:** `/categories`

- Fetches categories with counts: `GET /api/categories?withCounts=true`.
- View: Grid or List of category cards; each links to `/categories/[slug]`.
- “Add new +” and FAB open **AddCategoryModal**. On create, `POST /api/categories` and refetch categories.
- Search filters categories by name.

**To change:**
- Layout (grid/list): the two layouts and the List toggle in `categories/page.tsx`.
- Category card layout: the `<Link>` blocks and their content.
- FAB position: the fixed button’s classes (e.g. `bottom-8 right-8`).

### 5.5 Category detail – `src/app/categories/[slug]/page.tsx`  
**Route:** `/categories/[slug]`

- Fetches bookmarks and categories; filters bookmarks by `slug` (category).
- Search filters by name/description.
- Each row: logo, name, description, category label, Edit/Share/Delete/Visit (same as home list).
- Edit opens **EditBookmarkModal**; Delete calls `DELETE /api/bookmarks/[id]` and refetches.
- Empty state when no bookmarks in that category.

**To change:**
- Row layout: the row div and its children in `categories/[slug]/page.tsx`.
- How category is resolved: `category` from `categories.find` and `bookmarkMatchesCategory`.

### 5.6 Frequent – `src/app/frequent/page.tsx`  
**Route:** `/frequent`

- Fetches bookmarks; sorts by “last activity” (visit time from `recentVisits` or add time from bookmark id) and shows top 6.
- Visit is recorded in **recentVisits** (localStorage) when user clicks Visit on a bookmark.
- Same action bar (Edit/Share/Delete/Visit) and **EditBookmarkModal** as elsewhere.

**To change:**
- Number of items: the `.slice(0, 6)` in the `useMemo` that builds `frequentBookmarks`.
- Sort logic: `getLastActivityTime()` in `src/lib/recentVisits.ts` and the sort in `frequent/page.tsx`.

### 5.7 Explore – `src/app/explore/page.tsx`  
**Route:** `/explore`

- Fetches bookmarks and categories (default + user-created). Topic buttons = categories.
- Selecting one or more topics filters bookmarks that belong to any of those categories.
- List of filtered bookmarks: logo, category, name, description, rating; row links to bookmark URL.

**To change:**
- Topic list: comes from `GET /api/categories`; to add fixed topics, you could merge with a constant in the page.
- Filtering: `bookmarkMatchesTopic()` and the `filteredBookmarks` logic in `explore/page.tsx`.
- Row layout: the `<a>` and its children.

### 5.8 Settings – `src/app/settings/page.tsx`  
**Route:** `/settings`

- **General:** Default category dropdown, “Auto-fetch website data” toggle, default rating (star).
- **Appearance:** “Dark Mode” toggle (wired to ThemeContext), language dropdown.
- **Bookmark management:**
  - **Export:** `GET /api/bookmarks/export` and download as `markflow-bookmarks.json`.
  - **Import:** File input + “Import” button (UI only; no backend wired).
  - **Clear all:** Confirmation then `DELETE /api/bookmarks/clear`; redirects to `/`.

**To change:**
- Section order/labels: the three `<section>` blocks and their headings.
- Dark mode toggle: the Toggle that uses `isDark` and `setTheme` from `useTheme()`.
- Export filename/format: `Content-Disposition` and response body in `src/app/api/bookmarks/export/route.ts`.
- Clear behavior: the `handleClearAll` function and the clear API route.

---

## 6. Reusable Components

### 6.1 BookmarkCard – `src/components/BookmarkCard.tsx`

- Single bookmark card for grid view: logo, name, description, rating, category pill, actions (Edit, Share, Delete, Visit).
- Uses **BookmarkLogo** (or favicon fallback) and **BookmarkCardActions**.
- Fixed size: `BOOKMARK_CARD_WIDTH_PX`, `BOOKMARK_CARD_HEIGHT_PX` from `data/bookmarks.ts`.

**To change:**
- Card size: constants in `src/data/bookmarks.ts`.
- Layout inside card: the div structure and **StarRating** / **BookmarkCardActions** in `BookmarkCard.tsx`.

### 6.2 BookmarkLogo – `src/components/BookmarkCard.tsx` (exported)

- Shows `bookmark.logoUrl` if set (e.g. product image); otherwise Google favicon from `bookmark.faviconDomain`.
- On image error, falls back to favicon URL.

**To change:**
- Fallback favicon: the `onError` handler and the Google favicon URL pattern.
- Size: passed as `size` prop; default styling in `className`.

### 6.3 BookmarkCardActions – `src/components/BookmarkCardActions.tsx`

- Icon buttons: Edit, Share, Delete, Visit. Optional per callback; `bookmarkId` used to record visit for Frequent.
- Edit/Delete/Share behavior is passed from parent; Visit opens URL and calls **recordVisit** from `lib/recentVisits.ts`.

**To change:**
- Icons: the Edit/Share/Delete/Visit icon components at the bottom of the file.
- Button style: `btnClass` and overrides for delete/visit.

### 6.4 EditBookmarkModal – `src/components/EditBookmarkModal.tsx`

- Modal to edit only **star rating** of a bookmark. Shows bookmark name; Save calls `PATCH /api/bookmarks/[id]` with `{ rating }`.
- Used from Home, Category detail, and Frequent.

**To change:**
- Editable fields: currently only rating; to add name/description, extend the modal and the PATCH API.

### 6.5 AddCategoryModal – `src/components/AddCategoryModal.tsx`

- Modal: category name, icon grid, color picker. “Create Category” calls `POST /api/categories` with name, icon, color.
- Used from Categories page; on success, parent refetches categories.

**To change:**
- Icon set: `ICONS` array and the icon switch in `IconShape`.
- Colors: `COLORS` array.
- Validation: the check before `handleCreate()`.

### 6.6 StarRating – `src/components/StarRating.tsx`

- Displays or edits a 0–5 star rating. `readOnly` or `onChange` for edit mode; `size` for sm/md.

**To change:**
- Star count or scale: the component logic and the API (which expects 0–5).
- Appearance: the star SVG or classes.

### 6.7 Toggle – `src/components/Toggle.tsx`

- Checkbox-style toggle (e.g. Dark Mode, Auto-fetch). Used in Settings.

**To change:**
- Look: the wrapper and the input styling in `Toggle.tsx`.

### 6.8 CategoryIcon – `src/components/CategoryIcon.tsx`

- Maps category `slug` to an SVG icon (e.g. development, design, music). Used on category cards.

**To change:**
- Icons per slug: the `switch (slug)` and the SVG for each case; add a new `case` for new slugs.

---

## 7. Data, API & Store

### 7.1 Bookmark type – `src/data/bookmarks.ts`

- **Bookmark:** id, name, description, url, category, categorySlug, rating, faviconDomain, optional logoUrl.
- Constants: `BOOKMARK_CARD_WIDTH_PX`, `BOOKMARK_CARD_HEIGHT_PX`, `BOOKMARK_LOGO_SIZE_PX`.
- File also contains a legacy static `bookmarks` array (not used by the app; app uses API + store).

**To change:**
- Bookmark shape: the `Bookmark` interface; then update store, API, and any component that uses it.

### 7.2 Default categories – `src/lib/categories.ts`

- **DEFAULT_CATEGORIES:** list of `{ slug, name }` (e.g. design, development, productivity, …). Used by API and Add Bookmark dropdown.

**To change:**
- Add/remove/rename default categories: edit `DEFAULT_CATEGORIES` in `lib/categories.ts`.

### 7.3 Store – `src/lib/store.ts`

- Reads/writes **data/db.json** (userBookmarks, userCategories).
- Exposes: getUserBookmarks, addUserBookmark, addUserBookmarksBatch, clearUserBookmarks, updateUserBookmark, deleteUserBookmark, getUserCategories, addUserCategory.
- File path: `data/db.json` under project root.

**To change:**
- Persistence path: `getDbPath()` in `store.ts`.
- Shape of stored data: `UserData` and the read/write logic.

### 7.4 Recent visits – `src/lib/recentVisits.ts`

- **localStorage** key `markflow-recent-visits`: bookmark id → last visit ISO time.
- **recordVisit(id):** called when user clicks Visit.
- **getLastActivityTime(id, visits):** max of visit time and “add time” parsed from user id (for Frequent sort).

**To change:**
- Storage key: `STORAGE_KEY` in `recentVisits.ts`.
- How add time is derived: `getAddTimeFromId()` (id format `user-<timestamp>-<random>`).

### 7.5 DummyJSON – `src/lib/dummyjson.ts`

- Fetches products from `https://dummyjson.com/products` and maps to bookmark shape (productToBookmarkSeed).
- Maps product category to app category slug; uses product thumbnail as `logoUrl` when seeding.
- Used by **GET /api/bookmarks** when the store is empty (seed 20 bookmarks).

**To change:**
- Category mapping: `DUMMY_TO_OUR_CATEGORY` and `OUR_CATEGORY_NAMES` in `dummyjson.ts`.
- Seed count: the `limit` passed to `fetchDummyBookmarksForSeed` in the bookmarks API.

---

## 8. API Routes (Quick Reference)

| Route | Method | Purpose |
|-------|--------|--------|
| `/api/auth/login` | POST | Login (email/password); sets session cookie |
| `/api/auth/logout` | POST | Logout; clears session |
| `/api/auth/session` | GET | Returns current user if authenticated |
| `/api/bookmarks` | GET | List bookmarks; seeds 20 from DummyJSON if empty |
| `/api/bookmarks` | POST | Create bookmark (url, name, description, categorySlug, rating, etc.) |
| `/api/bookmarks/[id]` | PATCH | Update bookmark (e.g. rating only) |
| `/api/bookmarks/[id]` | DELETE | Delete one bookmark |
| `/api/bookmarks/clear` | DELETE | Remove all user bookmarks |
| `/api/bookmarks/export` | GET | Return user bookmarks as JSON (download) |
| `/api/categories` | GET | List categories (?withCounts=true for counts) |
| `/api/categories` | POST | Create category (name, icon, color) |
| `/api/fetch-page-info` | GET | ?url=... – fetch page title and meta description for “Get data” |

**To change:**
- Request/response shape: the route files under `src/app/api/`.
- Auth logic: `src/app/api/auth/login/route.ts` (e.g. demo credentials), session and logout routes.

---

## 9. Styling (Tailwind & Dark Mode)

### 9.1 Tailwind – `tailwind.config.ts`

- **darkMode: "class"** – dark theme when `<html>` has class `dark`.
- **content:** `src/pages`, `src/components`, `src/app`.
- **theme.extend.colors:** sidebar, card, accent (optional use).

**To change:**
- Dark mode strategy: only `class` is used; do not switch to `media` without updating ThemeContext and the layout script.
- New utility/colors: add under `theme.extend` in `tailwind.config.ts`.

### 9.2 Global CSS – `src/app/globals.css`

- Tailwind base/components/utilities.
- CSS variables (optional): `--sidebar-bg`, `--card-bg`, `--accent`, etc.
- **body:** light default (`bg-slate-50 text-slate-900`).
- **.dark body:** dark background and text (`bg-[#0f1117] text-slate-100`).

**To change:**
- Default body look: the `body` and `.dark body` rules.
- Global variables: the `:root` block.

### 9.3 Theming components

- Every UI that should support dark mode uses Tailwind **dark:** variants (e.g. `bg-white dark:bg-[#252830]`, `text-slate-900 dark:text-slate-100`).
- Toggle: Settings → Appearance → Dark Mode; state in ThemeContext and persisted in localStorage.

**To change:**
- Dark palette: replace `#0f1117`, `#1a1d24`, `#252830` and similar hexes in components and globals.
- Light palette: replace `slate-50`, `white`, etc., where used.

---

## 10. “Where to Change What” – Quick Map

| What you want to change | Where to go |
|------------------------|-------------|
| App title, meta description | `src/app/layout.tsx` (metadata) |
| Login page layout / copy | `src/app/login/page.tsx` |
| Login validation / demo user | `src/app/api/auth/login/route.ts` |
| Sidebar links / order | `src/components/LayoutWithSidebar.tsx` (navItems) |
| Sidebar width / colors | `src/components/LayoutWithSidebar.tsx` (aside classes) |
| Header search placeholder | `src/components/LayoutWithSidebar.tsx` (header input) |
| “New Bookmark” button | `src/components/LayoutWithSidebar.tsx` (Link in header) |
| Logo image / text | `src/components/MarkflowLogo.tsx` |
| Footer / “Log out” text | `src/components/LayoutWithSidebar.tsx` (footer) |
| Home sort options / default sort | `src/app/page.tsx` (SORT_OPTIONS, useState sortBy) |
| Home grid vs list layout | `src/app/page.tsx` (grid/list blocks) |
| Bookmark card size | `src/data/bookmarks.ts` (BOOKMARK_CARD_*_PX) |
| Bookmark card content / actions | `src/components/BookmarkCard.tsx`, `BookmarkCardActions.tsx` |
| Edit bookmark (rating only) | `src/components/EditBookmarkModal.tsx`; API: `src/app/api/bookmarks/[id]/route.ts` (PATCH) |
| Add bookmark form fields | `src/app/add-bookmark/page.tsx` |
| “Get data” (fetch title/description) | `src/app/api/fetch-page-info/route.ts`; button handler in `add-bookmark/page.tsx` |
| Default categories | `src/lib/categories.ts` (DEFAULT_CATEGORIES) |
| Categories list / grid | `src/app/categories/page.tsx` |
| Add category modal (icons, colors) | `src/components/AddCategoryModal.tsx` |
| Category detail list | `src/app/categories/[slug]/page.tsx` |
| Frequent “top 6” / sort logic | `src/app/frequent/page.tsx` (slice, sort); `src/lib/recentVisits.ts` |
| Explore topics (categories) | Fetched in `src/app/explore/page.tsx` from `/api/categories` |
| Settings sections / Export–Clear | `src/app/settings/page.tsx`; export/clear: `src/app/api/bookmarks/export/route.ts`, `clear/route.ts` |
| Dark mode default / persistence | `src/context/ThemeContext.tsx`; script in `src/app/layout.tsx` |
| Bookmark data shape | `src/data/bookmarks.ts` (Bookmark interface); then store + API |
| Where bookmarks are stored | `src/lib/store.ts` (writes to `data/db.json`) |
| Seed from DummyJSON (20 items) | `src/app/api/bookmarks/route.ts` (GET); mapping in `src/lib/dummyjson.ts` |
| Category icons (per slug) | `src/components/CategoryIcon.tsx` |

---

## 11. Client-Side vs Server-Side Files

### 11.1 Client-Side Components (Browser)

**All page components** (`src/app/*/page.tsx`) are **client-side** because they use:
- `"use client"` directive at the top
- React hooks (`useState`, `useEffect`, `useRouter`, `usePathname`)
- Browser APIs (`localStorage`, `navigator.share`, `fetch`)

**Files marked `"use client"`:**
- `src/app/page.tsx` (Home)
- `src/app/login/page.tsx`
- `src/app/add-bookmark/page.tsx`
- `src/app/categories/page.tsx`
- `src/app/categories/[slug]/page.tsx`
- `src/app/frequent/page.tsx`
- `src/app/explore/page.tsx`
- `src/app/settings/page.tsx`
- **All components** in `src/components/` (BookmarkCard, LayoutWithSidebar, AuthGuard, etc.)
- **All contexts** in `src/context/` (AuthContext, ThemeContext)

**Why client-side:**
- Need interactivity (clicks, form inputs, state)
- Need browser APIs (localStorage for theme/recent visits, navigator.share)
- Need client-side routing (Next.js `useRouter`, `usePathname`)

### 11.2 Server-Side Files (Node.js)

**All API routes** (`src/app/api/**/route.ts`) are **server-side**:
- No `"use client"` directive
- Use Node.js APIs (`fs`, `path`, `crypto` if needed)
- Export `GET`, `POST`, `PATCH`, `DELETE` functions that receive `Request` and return `NextResponse`

**Server-side files:**
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/session/route.ts`
- `src/app/api/bookmarks/route.ts`
- `src/app/api/bookmarks/[id]/route.ts`
- `src/app/api/bookmarks/clear/route.ts`
- `src/app/api/bookmarks/export/route.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/fetch-page-info/route.ts`

**Library files used by API routes** (run on server):
- `src/lib/store.ts` – uses Node.js `fs` to read/write `data/db.json`
- `src/lib/dummyjson.ts` – fetches from external API (`https://dummyjson.com`)
- `src/lib/categories.ts` – pure TypeScript constants (no side effects)

**Why server-side:**
- File system access (`fs.readFile`, `fs.writeFile` for `data/db.json`)
- Secure operations (auth, session cookies)
- External API calls (DummyJSON, fetch-page-info)
- Data validation and persistence

### 11.3 Hybrid Files

**Root layout** (`src/app/layout.tsx`):
- **Server component** (no `"use client"`)
- Renders providers and AuthGuard (which are client components)
- Contains inline script for theme restoration (runs in browser)

**To identify client vs server:**
- **Client:** Has `"use client"` at the top OR uses hooks/browser APIs
- **Server:** No `"use client"` AND uses Node.js APIs (`fs`, `path`) OR is an API route

---

## 12. Data Fetching Flow

### 12.1 How Client Pages Fetch Data

**Pattern:** Client pages use `useEffect` + `fetch()` to call API routes on mount or after mutations.

**Example (Home page):**
```typescript
// Client-side: src/app/page.tsx
useEffect(() => {
  fetch("/api/bookmarks")  // Calls server API route
    .then((res) => res.json())
    .then((data) => setBookmarks(data));
}, []);
```

**Flow:**
1. **Browser** → `fetch("/api/bookmarks")` → **Next.js API route** (`src/app/api/bookmarks/route.ts`)
2. **API route** → calls `getUserBookmarks()` from `src/lib/store.ts`
3. **Store** → reads `data/db.json` using Node.js `fs`
4. **Store** → returns array of bookmarks
5. **API route** → returns `NextResponse.json(bookmarks)`
6. **Browser** → receives JSON, updates React state, UI re-renders

### 12.2 Data Fetching Locations

| Page/Component | What it fetches | API endpoint | When |
|----------------|-----------------|--------------|------|
| **Home** (`page.tsx`) | Bookmarks | `GET /api/bookmarks` | On mount |
| **Categories** (`categories/page.tsx`) | Categories with counts | `GET /api/categories?withCounts=true` | On mount, after add category |
| **Category detail** (`categories/[slug]/page.tsx`) | Bookmarks + Categories | `GET /api/bookmarks`, `GET /api/categories` | On mount |
| **Frequent** (`frequent/page.tsx`) | Bookmarks | `GET /api/bookmarks` | On mount |
| **Explore** (`explore/page.tsx`) | Bookmarks + Categories | `GET /api/bookmarks`, `GET /api/categories` | On mount |
| **Add Bookmark** (`add-bookmark/page.tsx`) | Categories | `GET /api/categories` | On mount |
| **Add Bookmark** (`add-bookmark/page.tsx`) | Page title/description | `GET /api/fetch-page-info?url=...` | When user clicks "Get data" |
| **Settings** (`settings/page.tsx`) | Export data | `GET /api/bookmarks/export` | When user clicks "Export data" |

### 12.3 Mutations (Create/Update/Delete)

**Pattern:** Client calls API route with `fetch()` using POST/PATCH/DELETE, then refetches or updates local state.

**Examples:**

**Create bookmark:**
```typescript
// Client: src/app/add-bookmark/page.tsx
fetch("/api/bookmarks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, name, description, categorySlug, rating })
})
// Server: src/app/api/bookmarks/route.ts (POST)
// → calls addUserBookmark() from store.ts
// → writes to data/db.json
```

**Update rating:**
```typescript
// Client: src/components/EditBookmarkModal.tsx
fetch(`/api/bookmarks/${id}`, {
  method: "PATCH",
  body: JSON.stringify({ rating })
})
// Server: src/app/api/bookmarks/[id]/route.ts (PATCH)
// → calls updateUserBookmark() from store.ts
// → updates data/db.json
```

**Delete bookmark:**
```typescript
// Client: src/app/page.tsx (handleDelete)
fetch(`/api/bookmarks/${id}`, { method: "DELETE" })
// Server: src/app/api/bookmarks/[id]/route.ts (DELETE)
// → calls deleteUserBookmark() from store.ts
// → removes from data/db.json, saves file
```

**Clear all:**
```typescript
// Client: src/app/settings/page.tsx
fetch("/api/bookmarks/clear", { method: "DELETE" })
// Server: src/app/api/bookmarks/clear/route.ts
// → calls clearUserBookmarks() from store.ts
// → sets userBookmarks = [] in data/db.json
```

### 12.4 External API Calls

**DummyJSON seed** (server-side only):
- **When:** `GET /api/bookmarks` detects empty store
- **Where:** `src/app/api/bookmarks/route.ts` (GET handler)
- **How:** Calls `fetchDummyBookmarksForSeed(20)` from `src/lib/dummyjson.ts`
- **External API:** `https://dummyjson.com/products?limit=20`
- **Result:** 20 products mapped to bookmarks, saved to `data/db.json` via `addUserBookmarksBatch()`

**Fetch page info** (server-side):
- **When:** User clicks "Get data" on Add Bookmark page
- **Where:** `src/app/api/fetch-page-info/route.ts`
- **How:** Server-side `fetch(url)` with browser-like User-Agent, parses HTML for `<title>` and meta description
- **Result:** Returns `{ title, description }` to client, which fills form fields

---

## 13. Data Storage Locations

### 13.1 Persistent Storage (Server-Side)

**Primary storage:** `data/db.json` (project root)

**Structure:**
```json
{
  "userBookmarks": [
    {
      "id": "user-1738123456789-abc123",
      "name": "LinkedIn",
      "description": "...",
      "url": "https://linkedin.com",
      "category": "Business",
      "categorySlug": "business",
      "rating": 5,
      "faviconDomain": "linkedin.com",
      "logoUrl": "https://..." // optional, for product images
    },
    ...
  ],
  "userCategories": [
    {
      "id": "cat-travel-xyz",
      "name": "Travel",
      "slug": "travel",
      "icon": "compass",
      "color": "#3b82f6"
    },
    ...
  ]
}
```

**Read/Write:** `src/lib/store.ts`
- **readUserData():** Reads `data/db.json` using Node.js `fs.readFile`
- **writeUserData():** Writes `data/db.json` using Node.js `fs.writeFile`
- **Path:** `process.cwd() + "/data/db.json"` (created automatically if missing)

**When data is written:**
- **Create bookmark:** `POST /api/bookmarks` → `addUserBookmark()` → writes file
- **Update bookmark:** `PATCH /api/bookmarks/[id]` → `updateUserBookmark()` → writes file
- **Delete bookmark:** `DELETE /api/bookmarks/[id]` → `deleteUserBookmark()` → writes file
- **Clear all:** `DELETE /api/bookmarks/clear` → `clearUserBookmarks()` → writes file (empty arrays)
- **Add category:** `POST /api/categories` → `addUserCategory()` → writes file
- **Seed from DummyJSON:** `GET /api/bookmarks` (when empty) → `addUserBookmarksBatch()` → writes file

**To change storage location:**
- Edit `getDbPath()` in `src/lib/store.ts` (currently `data/db.json`)

### 13.2 Client-Side Storage (Browser)

**Theme preference:** `localStorage.getItem("markflow-theme")`
- **Read:** `src/context/ThemeContext.tsx` (`getStoredTheme()`)
- **Write:** `src/context/ThemeContext.tsx` (when `setTheme()` is called)
- **Values:** `"light"` or `"dark"`
- **Used by:** Theme toggle in Settings, initial theme restoration script in `layout.tsx`

**Recent visits:** `localStorage.getItem("markflow-recent-visits")`
- **Read:** `src/lib/recentVisits.ts` (`getRecentVisits()`)
- **Write:** `src/lib/recentVisits.ts` (`recordVisit()`)
- **Structure:** `{ "bookmark-id": "2025-02-05T12:34:56.789Z", ... }`
- **Used by:** Frequent page (sorts by last visit time or add time)

**To change localStorage keys:**
- Theme: `STORAGE_KEY` in `src/context/ThemeContext.tsx`
- Recent visits: `STORAGE_KEY` in `src/lib/recentVisits.ts`

### 13.3 Session Storage (Server-Side)

**Auth session:** HTTP-only cookie (set by API routes)
- **Set:** `src/app/api/auth/login/route.ts` (sets cookie on successful login)
- **Read:** `src/app/api/auth/session/route.ts` (reads cookie, returns user)
- **Clear:** `src/app/api/auth/logout/route.ts` (clears cookie)
- **Cookie name:** Managed by Next.js session handling (check login route implementation)

**To change session handling:**
- Edit `src/app/api/auth/login/route.ts`, `session/route.ts`, `logout/route.ts`

### 13.4 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENT (Browser)                                            │
│                                                             │
│  Pages (useEffect) → fetch("/api/bookmarks")               │
│  Forms → fetch("/api/bookmarks", { method: "POST" })       │
│  localStorage: theme, recentVisits                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ SERVER (Node.js)                                            │
│                                                             │
│  API Routes (route.ts)                                      │
│    ↓                                                        │
│  Store (lib/store.ts)                                       │
│    ↓                                                        │
│  File System: data/db.json                                 │
│                                                             │
│  External APIs:                                             │
│    - DummyJSON (dummyjson.ts)                               │
│    - Fetch page info (fetch-page-info/route.ts)             │
└─────────────────────────────────────────────────────────────┘
```

**Key points:**
- **Client never directly accesses `data/db.json`** – only via API routes
- **All persistence goes through `src/lib/store.ts`** – single source of truth
- **Client state (theme, recent visits)** is in `localStorage` for instant access
- **Server state (bookmarks, categories)** is in `data/db.json` and accessed via API

---

## 14. Running & Building

- **Development:** `npm run dev` – app at `http://localhost:3000`.
- **Production build:** `npm run build` then `npm run start`.
- **Lint:** `npm run lint`.

First load with no bookmarks triggers a one-time seed of 20 bookmarks from DummyJSON; they are written to `data/db.json` and can be edited/deleted like any other bookmark.

---

This guide covers the structure, all main UI areas, and where to change each part of the MarkFlow UI built from scratch.
