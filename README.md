# Pixhup — starter backend

What this does, right now: sign in with an email link, upload a photo, spend a
credit to restore it with AI, buy more credits with a real Stripe payment.
Everyone starts with 3 free credits.

## What's real vs. not yet

Real: sign-in, the AI restore call, credit tracking, real payments.
Not yet: the other 8 tools from the marketing site, the full landing page
design — this is deliberately just enough to prove the core loop works.

## Getting your keys

**Supabase** — your project → Settings → API. Copy the Project URL and the
`anon public` key. Then Settings → API → below that, reveal and copy the
`service_role` key too (keep this one secret — never put it in code that
reaches the browser).

Then: SQL Editor → New query → paste everything from `supabase-schema.sql`
in this folder → Run. That creates the table that tracks credits.

**OpenAI** — platform.openai.com → API keys → Create new secret key.

**Stripe** — dashboard.stripe.com → Developers → API keys → copy the
**Secret key** (starts with `sk_test_` while in test mode — that's correct,
test mode doesn't charge real cards).

The webhook secret needs one more step, after this app is deployed:
Developers → Webhooks → Add endpoint → URL is
`https://pixhup.com/api/webhook` → select event `checkout.session.completed`
→ Add endpoint → click into it → reveal the **Signing secret**.

## Running it

1. Copy `.env.example` to a new file called `.env.local`, fill in the keys above
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## Deploying

Push this folder to a GitHub repo, then import that repo in Vercel. Add the
same variables from `.env.local` in Vercel's project settings (Settings →
Environment Variables) — Vercel doesn't read your local `.env.local` file.
