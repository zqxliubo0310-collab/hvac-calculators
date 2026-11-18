# HVAC Sizing Tools

Screening calculators for US home heat pumps, mini-splits, airflow, duct size, and water heaters, plus a planning range for replacement cost and a quote request form.

The brand name and contact address live in [`src/config/site.ts`](src/config/site.ts). Change them there.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production check:

```bash
npm test
npm run build
npm start
```

## Routes

| Path | What it does |
| --- | --- |
| `/` | All tools |
| `/heat-pump-size-calculator` | Heating and cooling screen, nominal tons |
| `/mini-split-size-calculator` | Room-by-room ductless nameplates |
| `/air-changes-per-hour-calculator` | ACH, and ASHRAE 62.2 / IRC ventilation rates |
| `/duct-size-calculator` | Round metal diameter, velocity, rectangular equivalents |
| `/cfm-calculator` | Airflow from tons, sensible heat, or ACH |
| `/water-heater-size-calculator` | First-hour worksheet and tankless flow |
| `/hvac-replacement-cost-calculator` | Planning range and quote form |
| `/about`, `/contact`, `/privacy`, `/terms` | Site information |
| `/sitemap.xml`, `/robots.txt` | Generated from the host or `NEXT_PUBLIC_SITE_URL` |
| `POST /api/lead` | Validates and stores a quote request |

Results are estimates. They are not a Manual J, Manual D, a plumbing design, or a quote.

## Environment variables

Copy `.env.example` to `.env.local`. All of them are optional.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public `https` origin used for canonical URLs, Open Graph, sitemap, and robots. When it is set, pages can prerender with that origin. When it is empty, those URLs use the host that served the request, then `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher id (`ca-pub-…`). The ad script is not loaded until this is set. |
| `NEXT_PUBLIC_ADSENSE_SLOT` | Ad unit slot id. The ad placement renders nothing until both this and the client id are set. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification token. Emits the google-site-verification meta tag when set. |
| `LEAD_WEBHOOK_URL` | If set, each accepted lead is also POSTed as JSON to this URL. The request still succeeds when the file log works and the webhook fails; the failure is written to the server log. |

Leads are appended as one JSON object per line to `data/leads.jsonl` when that directory is writable, otherwise to `/tmp/hvac-sizing-tools/leads.jsonl`. Every lead is also written to stdout as `LEAD {…}`, which is the record you will see in Vercel function logs. The file is gitignored. On Vercel the filesystem copy is ephemeral, so set `LEAD_WEBHOOK_URL` if a person or system needs to receive the requests.

The rate limit is 5 submissions per network address per 15 minutes, kept in memory for that server instance. It is a basic throttle, not a global firewall.

## Deploy on Vercel

1. Import the Git repository.
2. Framework preset: **Next.js**. Do not override the build command (`npm run build`) or the output directory.
3. Add the environment variables above for Production (and Preview, if you want them there). Set `NEXT_PUBLIC_SITE_URL` to the `https://….vercel.app` URL once Vercel assigns it, so canonicals stay on that host.
4. Deploy.

No database and no third-party account are required for the calculators or the lead log.

## Before you send real traffic

- Replace `replace-me@example.com` in `src/config/site.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the live origin.
- Decide where leads go (`LEAD_WEBHOOK_URL`) and review the consent sentence with whoever will contact those people.
- Add AdSense and Search Console values only after those accounts exist.
- The planning cost bands are round budgeting figures, not a price survey. Edit the defaults in `src/lib/calc/replacement-cost.ts` if you want different starting numbers.
