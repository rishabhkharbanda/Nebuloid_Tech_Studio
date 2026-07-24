# Nebuloid Tech Studio

Premium creative agency website for **Nebuloid Tech Studio LLP** — built with Next.js, TypeScript, and Tailwind CSS.

**Your Vision. Our Mission.**

## Features

- Cinematic hero with synced text + image carousel
- Editorial services, work, testimonials, and journal sections
- Smooth scrolling (Lenis) and premium motion (Framer Motion, GSAP)
- Fully responsive, SEO-ready layout
- Custom branding with Nebuloid logo and favicon

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://gsap.com/)
- [Lenis](https://lenis.darkroom.engineering/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contact form → Google Sheet + email

Submissions post to `/api/contact`, which:

1. Emails **NebuloidTechStudio@gmail.com** (via the Apps Script webhook, and optionally Resend)
2. Appends a row when `GOOGLE_SHEETS_WEBHOOK_URL` is set

### Google Sheet + Gmail (required)

1. Create a Google Sheet and paste `scripts/google-sheets-contact-webhook.gs` into Apps Script
2. Run `setupSheet()`, authorize mail access when prompted, then deploy as a Web app (Execute as: Me, Who has access: Anyone)
3. Set the web app URL:

```bash
# .env.local (not committed)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

```bash
vercel env add GOOGLE_SHEETS_WEBHOOK_URL
```

### Optional Resend (extra reliability)

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL="Nebuloid Contact <onboarding@resend.dev>"
```

If Resend sends successfully, the Apps Script skips its email to avoid duplicates.

## Admin CMS

Secure content admin at `/admin` for blogs, full digital experience case studies, media, and SEO scoring.

- **Blogs & digital experiences**: draft / publish / unpublish, secret preview links (`/preview/...`), Zod-validated APIs
- **Roles**: editors can create and edit; only **admins** can delete blogs, digital experiences, and media
- **Public site**: CMS-first with static fallback when the database is empty or unavailable

### Setup

1. Create a Neon Postgres database and Vercel Blob store
2. Copy `.env.example` → `.env.local` and fill:

```bash
DATABASE_URL=postgresql://...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
BLOB_ACCESS=private
ADMIN_SESSION_SECRET=use-a-long-random-secret-32chars-min
ADMIN_EMAIL=admin@nebuloidtechstudio.com
ADMIN_PASSWORD=your-strong-password
```

`BLOB_ACCESS` must match your Vercel Blob store mode (`private` or `public`). Stores cannot be converted after creation — for public marketing images, prefer a **public** store.
3. Push schema and seed admin + digital case studies:

```bash
npm run cms:push
npm run cms:seed
```

4. Open `/admin/login`

### Scripts

| Command | Description |
| --- | --- |
| `npm run cms:push` | Push Drizzle schema to Postgres |
| `npm run cms:generate` | Generate SQL migrations |
| `npm run cms:migrate` | Run migrations |
| `npm run cms:seed` | Create/update admin user and seed digital case studies |

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
| `npm run cms:push` | Sync CMS database schema |
| `npm run cms:seed` | Seed CMS admin user |

## Project Structure

```
src/
├── app/              # Next.js app router, public pages, /admin CMS
├── components/
│   ├── site/         # Public page sections
│   ├── admin/        # CMS UI
│   └── ui/           # Reusable UI primitives
├── db/               # Drizzle schema + client
└── lib/              # Content, auth, SEO, CMS helpers
```

## Contact

**Nebuloid Tech Studio LLP**

- **Address:** House No. 944, Block - C, Sushant Lok 1, Gurugram, Haryana, India 122001
- **Phone:** +91 7303922260
- **Email:** NebuloidTechStudio@gmail.com

## Licence

Private — © Nebuloid Tech Studio LLP. All rights reserved.
