This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Content Management (Admin + Supabase)

All public content (projects, services, gallery, brands) is managed from the admin panel at `/admin` and stored in **Supabase**.

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in your Supabase dashboard and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the four content tables (with RLS enabled) and seeds them with the bundled data.
3. Copy your project URL and service role key from *Project Settings → API* into `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ```

4. Restart the dev server. Content is now read from and written to Supabase.

> Until these variables are set, the site falls back to reading the bundled seed files in `data/content/*.json` (read-only — admin edits require Supabase to be configured).

The service role key is used server-side only (`lib/supabase.ts`) and never exposed to the browser; all writes go through the cookie-protected admin API routes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
