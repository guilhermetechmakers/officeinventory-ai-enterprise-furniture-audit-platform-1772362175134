# OfficeInventory AI – Enterprise Furniture Audit Platform

AI-powered furniture audit platform for inventory, assessment, and reporting across multi-site corporate portfolios.

## Features

- **Landing Page** – Hero, value propositions, feature highlights, CTA
- **Authentication** – Login, signup, password reset (Supabase-ready)
- **Dashboard** – KPIs, quick actions, recent activity, charts
- **Capture Upload** – Mobile-first photo capture with location picker
- **Bulk Upload Status** – Batch monitoring with filters
- **Audits** – Audit list and hierarchy management
- **Review Queue** – Low confidence, exceptions, duplicates tabs
- **Merge & Duplicates** – Duplicate resolution UI
- **Reports & Exports** – Templates, export history
- **Analytics** – Inventory by type, condition distribution
- **Admin** – Tenant settings, user management
- **Settings** – Inference thresholds, export schema, SLA

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router 6
- Tailwind CSS v3 + @tailwindcss/typography
- TanStack React Query
- React Hook Form + Zod
- Radix UI primitives
- Recharts
- Sonner (toasts)
- Supabase (optional)

## Getting Started

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL and anon key (optional)
npm run build
```

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Production build
- `npm run preview` – Preview production build

## Design System

Colors, typography, and components follow the OfficeInventory AI UI Guide:
- Primary: Lime green (#C9FF52)
- Background: Soft gray (#F5F6F8)
- Card: #E8E9EC
- Accents: Red (errors), Orange (warnings), Sky blue (info)

## Project Structure

```
src/
├── components/
│   ├── layout/     # Dashboard sidebar, header, auth layout
│   └── ui/         # Button, Card, Input, Badge, etc.
├── lib/            # utils, api, supabase
├── pages/          # Landing, auth, dashboard pages
└── routes/         # React Router config
```
