# Shivayogi Jnana Mandir — Health Tracker

Offline-first health management for residential school students. Record visits, view history, and manage treatment — all stored locally in the browser (no server required).

## Quick start

**Requires Node.js 18+** (20 LTS recommended). Check with `node -v`.

```bash
cd student-tracker
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### `npm run dev` fails with ERR_REQUIRE_ESM?

Your terminal is using an **old Node** (12/14). Vite needs Node 18+.

1. Install [Node.js 20 LTS](https://nodejs.org/)
2. **Close and reopen** your terminal (or Cursor)
3. Run `node -v` — must show `v18` or higher
4. Run `npm run dev` again

The project includes `scripts/dev.cjs` which tries `C:\Program Files\nodejs\node.exe` on Windows if PATH is wrong.

### Other commands

```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## Demo tips

1. **Returning student:** Search `SJM-001` or `Arjun` — see previous visits, then add a new record.
2. **New student:** Enter a new name and fill details — first visit creates their profile.
3. **Refresh the page** — data persists (IndexedDB).
4. **Offline:** Chrome DevTools → Network → Offline — app still works.

### Seed students (for testing)

| Admission | Name |
|-----------|------|
| SJM-001 | Arjun Patil (has visit history) |
| SJM-002 | Priya Kulkarni |
| SJM-003 | Rahul Deshmukh (injury — urgent) |
| SJM-004 | Ananya Joshi |
| SJM-005 | Karthik Rao |

## Features

- **Record Visit** — single form: student lookup, history, issue, treatment
- **Previous visits** — shown when selecting an existing student
- **Recent / Students / Dashboard / Reports**
- **Export / Import** JSON backup in Settings
- **Mobile-first** — bottom navigation on phones, sidebar on desktop

## Architecture

```
UI (pages, components, hooks)
  → Services (business logic)
    → Repositories (CRUD, search, filter)
      → StorageProvider (interface)
        → IndexedDBProvider (Dexie.js)
```

React components **never** import Dexie directly. To add a cloud backend later, implement `ApiProvider` and swap it in `StorageContext.jsx`.

### Folder structure

```
src/
  components/   UI + visit form
  pages/        Route pages
  layouts/      MainLayout
  hooks/        useVisitEntry, useStudentHistory
  services/     visitEntryService, studentService, …
  repositories/ BaseRepository + entity repos
  providers/    StorageContext, IndexedDBProvider
  db/           Dexie schema, seed data
  utils/        constants, validators, sync helpers
```

### Sync-ready fields

All records include: `localId`, `cloudId`, `createdAt`, `updatedAt`, `syncStatus` — prepared for future cloud sync.

## Future backend integration

1. Create `ApiProvider extends StorageProvider` with REST/GraphQL calls.
2. Add auth + `schoolId` tenant from login (already on entities).
3. Swap provider in `src/providers/StorageContext.jsx`.
4. Add `SyncService` to push `syncStatus: pending` records.
5. Repositories and services stay unchanged.

## Tech stack

- React 19 + Vite 6
- Tailwind CSS 4
- Dexie.js (IndexedDB)
- React Router 7
- vite-plugin-pwa (offline app shell)

## School

**Shivayogi Jnana Mandir** — single-school mode in v1.
