# Workspace

## Overview

AI-powered hotel booking system built as a pnpm monorepo. Includes a luxury hotel frontend, a REST API backend, and an AI chat agent for guest queries.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS
- **UI**: shadcn/ui components, framer-motion animations

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (rooms, bookings, AI chat)
│   └── hotel-app/          # React + Vite hotel booking frontend
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

## Features

### Frontend (artifacts/hotel-app)
- **Home page**: Hero section, hotel highlights, featured rooms
- **Rooms page**: Grid of room cards with type, price, amenities, availability
- **Booking page**: Form with guest info, date selection, price calculation
- **Bookings page**: View all past bookings
- **AI Chat Widget**: Floating chat button — answers room queries via AI agent

### Backend (artifacts/api-server)
- `GET /api/rooms` — list all rooms
- `GET /api/rooms/:id` — get room by ID
- `POST /api/rooms` — create a room
- `GET /api/bookings` — list all bookings
- `POST /api/bookings` — create a booking (calculates total price)
- `POST /api/ai/chat` — AI agent chat (tool-based: check_room_availability, get_room_details)

### Database Schema (lib/db/src/schema/hotels.ts)
- **rooms**: id, name, type (standard/deluxe/suite/penthouse), pricePerNight, capacity, amenities[], available, description, imageUrl, timestamps
- **bookings**: id, roomId, guestName, guestEmail, checkIn, checkOut, totalPrice, status, timestamps

## AI Agent
Simple rule-based agent that detects intent and calls one of two tools:
- `check_room_availability` — returns available rooms list
- `get_room_details` — returns details about specific room types
- General queries — check-in/out times, cancellation policy, amenities

## Seeded Data
6 rooms pre-seeded: Garden Standard ($89), Ocean Deluxe ($159), Mountain View Deluxe ($179), Grand Suite ($299), Family Suite ($349), Royal Penthouse ($599, unavailable)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. Run `pnpm run typecheck` from root.

## Root Scripts

- `pnpm run build` — typecheck + build all packages
- `pnpm run typecheck` — full typecheck using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client + Zod schemas
- `pnpm --filter @workspace/db run push` — push schema changes to database
