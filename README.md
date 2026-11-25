# Perseus Lab website

The public site for Perseus Lab: the Home page and the `/build` configurator.
Plain HTML, CSS and JavaScript with no build step. Hosted on Cloudflare Pages at buildperseus.com.

## Files

| Path | What it is |
|---|---|
| `index.html` | Home page (short) |
| `homes/index.html` | For homes: every use case and benefit, by category |
| `business/index.html` | For business: AI Quick Start offer, example assistants, 2027 waitlist, FAQ, book-a-call form |
| `privacy/index.html` | Privacy page (**draft**, needs Logan's approval) |
| `terms/index.html` | Terms page (**draft**, needs Logan's approval) |
| `pricing/index.html` | Three ways to buy, starting points, how pricing works |
| `how-it-works/index.html` | Steps, install standards, FAQ |
| `quote/index.html` | Quote request form |
| `build/index.html` | The configurator at `/build` |
| `assets/catalog.js` | **Every part and price.** The only file to edit when prices change |
| `assets/build.js` | Configurator logic: needs → recommended build, swaps, warnings, totals |
| `assets/quote.js` | One handler for every form (quote, build, Quick Start call, business waitlist). Not connected yet |
| `assets/site.css` | Shared styles |
| `assets/site.js` | Sideways card rows (arrows, swipe, keys) |
| `_headers` | Security headers for Cloudflare Pages |

## Updating prices

1. Open `assets/catalog.js`.
2. Change `low` and `high` on the part, and `priceDate` in `rules`.
3. Commit. Cloudflare redeploys in about a minute.

Done-for-you prices are calculated as parts (low end) + 15% sourcing + setup ($1,500, or $3,500 with a large AI box).

## Deploying to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Framework preset: **None**. Build command: *(leave empty)*. Build output directory: `/`.
3. Save and deploy, then add the custom domain `buildperseus.com` under the project's Custom domains tab.

## Rules for this repo

- This repo is **public**. No API keys, client data, lead lists or passwords in it, ever. Secrets go in Cloudflare environment variables.
- Store links are plain links. Before any link becomes an affiliate link, the program must approve us and a disclosure goes right next to it.
- Deposit checkout stays off until the LLC, EIN, business bank account and written refund terms exist.
- No health claims, no "unhackable", no guaranteed savings, and never claim a local AI matches Claude or ChatGPT.

## Not done yet

- Forms: need a Cloudflare Pages Function at `/api/quote` that emails the lead, then set `QUOTE_ENDPOINT` in `assets/quote.js`. Business forms send a hidden `type` (`quick-start` or `business-waitlist`); no `type` means a home quote.
- `/privacy` and `/terms` are drafts. Set `LEGAL_PAGES_APPROVED = true` in `assets/quote.js` only after Logan approves both. Until then no form sends anything.
- Photos from real installs.
