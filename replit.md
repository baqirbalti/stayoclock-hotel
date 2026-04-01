# Workspace

## Overview

AI-powered luxury hotel booking system called "The Grand" — built as a pnpm monorepo. Includes a React+Vite luxury frontend, an Express+PostgreSQL backend, AI chat agent, admin panel, dining menu, room image carousel, and configurable settings.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS
- **UI**: shadcn/ui components, framer-motion animations
- **Storage**: Object Storage (GCS presigned URL flow)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── hotel-app/          # React + Vite hotel booking frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec (openapi.yaml) + Orval codegen
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## Frontend Pages (artifacts/hotel-app/src/pages)

- `/` — **Home**: Hero, highlights, featured rooms CTA
- `/rooms` — **Accommodations**: Room cards with image carousel (hover arrows, photo count badge)
- `/book/:roomId` — **Booking form**: Guest info, dates, price calculator
- `/bookings` — **My Bookings**: Guest booking history with cancel option
- `/dining` — **Dining**: Michelin-starred menu by category (breakfast/lunch/dinner/drinks/dessert)
- `/admin` — **Admin Panel**: Full CRUD for Rooms (+ image upload), Dining items, Hotel Settings
- `/privacy` — **Privacy Policy**
- `/terms` — **Terms of Service**
- `/cancellation` — **Cancellation Policy**

## Admin Panel Features (`/admin`)

- **Rooms tab**: List all rooms, add/edit/delete, manage multiple photos per room (file upload or URL)
- **Dining tab**: List/add/edit/delete menu items with category, price, availability
- **Settings tab**: Social media links (Facebook/Twitter/Instagram), contact info, hotel name — live preview

## Backend Routes (artifacts/api-server/src/routes)

| Route | Description |
|---|---|
| `GET /api/rooms` | List all rooms with images |
| `GET /api/rooms/:id` | Get room by ID |
| `POST /api/rooms` | Create room |
| `PUT /api/rooms/:id` | Update room |
| `DELETE /api/rooms/:id` | Delete room |
| `GET /api/rooms/:id/images` | List images for a room |
| `POST /api/rooms/:id/images` | Add image to room |
| `DELETE /api/rooms/:id/images/:imageId` | Delete room image |
| `GET /api/bookings` | List all bookings |
| `POST /api/bookings` | Create booking |
| `DELETE /api/bookings/:id` | Cancel booking |
| `GET /api/dining` | List all dining items |
| `POST /api/dining` | Create dining item |
| `PUT /api/dining/:id` | Update dining item |
| `DELETE /api/dining/:id` | Delete dining item |
| `GET /api/settings` | Get hotel settings |
| `PUT /api/settings` | Update hotel settings |
| `POST /api/ai/chat` | AI chat agent |
| `POST /api/storage/uploads/request-url` | Get presigned URL for object storage |

## Database Schema (lib/db/src/schema/hotels.ts)

- **rooms**: id, name, type, pricePerNight, capacity, amenities[], available, description, imageUrl, timestamps
- **room_images**: id, roomId→rooms, imageUrl, altText, displayOrder, createdAt
- **bookings**: id, roomId→rooms, guestName, guestEmail, checkIn, checkOut, totalPrice, status, timestamps
- **dining_items**: id, name, description, category, price, imageUrl, available, displayOrder, timestamps
- **hotel_settings**: id, key, value, updatedAt

## Image Upload Flow

Admin panel uses presigned URL upload:
1. POST `/api/storage/uploads/request-url` → `{ uploadURL, objectPath }`
2. PUT directly to `uploadURL` with the file binary
3. POST `/api/rooms/:id/images` with `imageUrl: /api/storage${objectPath}`
4. Images served at `/api/storage${objectPath}`

## Seeded Data

- **Rooms**: 6 rooms — Garden Standard ($89), Ocean Deluxe ($159), Mountain View Deluxe ($179), Grand Suite ($299), Family Suite ($349), Royal Penthouse ($599, unavailable)
- **Dining**: 15 items across breakfast/lunch/dinner/drinks/dessert categories

## Root Scripts

- `pnpm run build` — typecheck + build all packages
- `pnpm run typecheck` — full typecheck
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client + Zod schemas
- `pnpm --filter @workspace/db run push` — push schema changes to DB
