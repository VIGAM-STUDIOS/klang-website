# KLANG website

The public sales page: a static site (HTML, CSS, JS) with no build step and no dependencies.

```
index.html   page content
styles.css   styling (dark + light themes, mobile layout)
site.js      config wiring, animated demo, theme toggle, signup form
config.js    links and prices: the only file you need to edit
favicon.svg  browser-tab icon
og-image.png preview image for links shared on social media/chat
```

## Preview locally

```bash
python -m http.server 4173 --directory apps/website
```

Then open http://127.0.0.1:4173.

## Before you launch: edit `config.js`

| Setting | What to put there | If left empty |
|---|---|---|
| `waitlistFormAction` | A form endpoint that accepts a POST with an `email` field (e.g. a free [Formspree](https://formspree.io) form URL) | The signup form says signups aren't connected. **Set this before you share the page.** |
| `downloadUrl` | Link to the Windows installer, e.g. a GitHub Releases asset | Every "Download" button becomes "Get early access" |
| `checkoutUrl` | Your Dodo Payments checkout link for Pro | The Pro card shows "Join early access" |
| `proPrice`, `earlyBirdPrice` | Prices in USD (set `earlyBirdPrice: null` to drop the offer) | — |
| `contactEmail` | A support address | No contact link is shown |

The page is built to grow with the product:

1. **Now (private beta):** only `waitlistFormAction` set → the page collects early-access emails.
2. **Beta download ready:** add `downloadUrl` → "Download free" buttons appear; Pro still collects interest.
3. **Pro on sale:** add `checkoutUrl` → "Buy Pro" goes to checkout.

## Deploy (free)

**Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git → pick this repo.
Framework preset: *None*. Build command: *(leave empty)*. Build output directory: `apps/website`.

**Vercel:** Add New → Project → import this repo. Framework: *Other*. Root directory: `apps/website`.
No build command.

Either way, every push to `main` redeploys the site. Add your custom domain in the dashboard.

## Also needed before selling

Payment providers (Dodo Payments) review your site before approving a store and expect
**Terms of Service, a Privacy Policy and a Refund Policy** to be linked. Those pages aren't
here yet because they're legal commitments you need to decide on (e.g. refund window).
