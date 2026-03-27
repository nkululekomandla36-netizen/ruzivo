# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (backend), expo-sqlite + AsyncStorage (mobile)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── ruzivo/             # RUZIVO mobile app (Expo)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## RUZIVO Mobile App (`artifacts/ruzivo`)

An offline-first plant knowledge app for African botanical education.

### Features
- **Home screen**: Hero layout with Scan Plant + Plant Library CTAs
- **Scan screen**: Camera/gallery image picker for plant identification (online only)
- **Plant Library**: Searchable, filterable list of plants (All / Medicinal / Toxic / Food)
- **Plant Detail**: Full plant info, safety badge, uses, warnings, traditional uses, local names (Shona, Zulu, etc.)
- **Result screen**: Post-scan result with offline fallback + quick plant links

### Tech
- Expo SDK 54, Expo Router (file-based routing)
- SQLite (expo-sqlite) for native, AsyncStorage fallback for web
- Dark theme: dark green (#0B3D2E), gold (#C9A227), black (#000000)
- 5 seed plants: Aloe Vera, Moringa, Neem, Rooibos, African Potato

### Screens
- `app/index.tsx` — Home
- `app/scan.tsx` — Scan (camera/gallery)
- `app/library.tsx` — Plant Library
- `app/plant/[id].tsx` — Plant Detail
- `app/result.tsx` — Scan Result

### Data
- `lib/database.ts` — SQLite (native) + AsyncStorage (web) with CRUD for plants/scans
- `context/DatabaseContext.tsx` — DB init provider
- `components/PlantCard.tsx` — Plant list item
- `components/SafetyBadge.tsx` — Safe/Caution/Toxic badge
