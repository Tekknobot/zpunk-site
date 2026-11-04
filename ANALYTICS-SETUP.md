# ZPUNK site analytics and counters

## 1. Deploy the patched project

This is the full site, not just the blog folder. Keep `api/counters.js`, `site-counters.js`, and `scripts/build-gallery.mjs` at their existing paths. Deploy the repository to the existing Vercel project. The static site build continues to output to `dist` and the counter API is a Vercel Serverless Function.

## 2. Enable Vercel Web Analytics

In Vercel > your project > Analytics, enable Web Analytics if not already enabled. The site pages now load `/_vercel/insights/script.js` automatically. After deployment, visit the site and verify the Analytics dashboard receives traffic. This is separate from the public counters.

## 3. Connect a persistent Redis database (required for public counts)

In the Vercel project, open Storage / Marketplace and create or connect **Upstash Redis**. Link it to this project and ensure the following environment variables are available to **Production**:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

If Vercel offers the legacy `KV_REST_API_URL` / `KV_REST_API_TOKEN`, those also work. Redeploy after adding environment variables. Never place the token in public HTML or JavaScript.

## 4. Test

- Open `/api/counters` — expect JSON containing `visitors` and five `articles` entries, initially zero.
- Visit the homepage. Its footer should show `Unique visitors: 1` (or more).
- Open a blog article. Its reader count should increase by one for that browser.
- Reload the article. The count should **not** increase again.
- Try another browser/device to verify a new unique visitor and a new article reader.

If the database is not connected, the public counters intentionally display `—` rather than misleading zeros.

## Counting definition and limitations

- A unique visitor is one anonymous browser ID stored in that browser's local storage, counted once for the entire site.
- A reader is a browser ID that **opens** an article page, counted once per article; this does **not** prove they read the whole post.
- These are **all-time counters from activation**, not historical Vercel Analytics totals. Existing past traffic cannot be backfilled automatically.
- Clearing browser storage, using private browsing, or switching devices may count the same human again. Browsers blocking JavaScript/storage may not be counted. Bots that do not run JS will not increment these counts.
- The server stores only anonymous random browser identifiers for deduplication and aggregate counts; it does not store IP addresses or email addresses. A privacy notice should mention anonymous visit counting and browser storage.
- Counters are public, so determined visitors could manipulate them; they are engagement indicators, not audited statistics.
