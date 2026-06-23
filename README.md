# Student Registration System

MVP university enrollment system built with Next.js App Router, TypeScript, Supabase Auth, Supabase PostgreSQL, Supabase Storage, Tailwind CSS, and shadcn-style UI components.

## MVP Features

- Public university information pages
- Applicant signup/login with Supabase Auth
- Applicant dashboard
- Multi-step enrollment form with React Hook Form and Zod validation
- Document uploads to private Supabase Storage
- Application status tracking
- Reviewer dashboard and application review queue
- Accept/reject workflow
- Student record creation after acceptance
- Basic admin management for departments, programs, and admission periods

## Prerequisites

- Node.js LTS
- pnpm
- Supabase project

Use pnpm only for this project.

```bash
pnpm install
```

## Environment

Create `.env.local` from `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never add a Supabase service role key to frontend environment variables.

## Supabase Setup

1. Open Supabase SQL Editor.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/seed/seed.sql`.
4. Enable email/password auth in Supabase Authentication settings.
5. Add `http://localhost:3000` to Supabase Auth URL configuration.

The migration creates:

- PostgreSQL tables
- helper functions and review RPCs
- profile creation trigger
- RLS policies
- private `application-documents` storage bucket
- storage object policies

## Promote Admin or Reviewer

Create an account through the app, then promote it in Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

For a reviewer:

```sql
update public.profiles
set role = 'reviewer'
where email = 'reviewer-email@example.com';
```

## Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Verification

```bash
pnpm lint
pnpm type-check
pnpm build
```

## Route Map

- `/`, `/about`, `/programs`, `/admission`, `/faq`, `/contact`
- `/register`, `/login`
- `/applicant/dashboard`, `/applicant/application`, `/applicant/documents`, `/applicant/status`
- `/reviewer/dashboard`, `/reviewer/applications`, `/reviewer/applications/[id]`
- `/admin/programs`, `/admin/admission-periods`
