# Futureproof Me ~ founding cohort landing page

The sales page for **Futureproof Me**, a 10-week founding cohort from Chiibitsu Labs.
This is the page the free Mirror gift's result screen points to.

> more human, by design

Lives in `/cohort` so it can share this repo with the Mirror gift (which lives
at the repo root) while deploying as its own separate Vercel project.

## Stack

- **Vite + React** static page → builds to `dist/`
- **Intake:** an embedded **Tally** form (submissions + notifications handled by
  Tally ~ no serverless function, no API keys, no Google Sheet to wire up).
- Deploys on **Vercel** (private repo is fine). No database, no auth, no env vars required.

## Run locally

```bash
cd cohort
npm install
npm run dev        # http://localhost:5173
npm run build      # static build → cohort/dist
npm run preview    # preview the production build
```

## Deploy on Vercel

Two separate projects from one repo:

| Project | Root Directory | What |
| --- | --- | --- |
| Mirror gift | `/` (repo root) | the free diagnostic |
| Cohort landing | `cohort` | this page |

For this page: New Project → import the repo → set **Root Directory** to
`cohort` → Framework auto-detects as Vite → Deploy. No env vars needed.

## The Tally form

The application form is live and embedded on the page:
**https://tally.so/r/xX6z2v**

- Edit the form (questions, notifications, integrations) in Tally directly.
- To point the page at a different form, change `apply.formId` in
  [`src/content.js`](src/content.js).
- Submissions live in Tally; connect Tally → Google Sheets / email / Slack there
  if you want them mirrored elsewhere.

## 🚩 Before you launch ~ things to set (don't ship the placeholders)

All copy lives in [`src/content.js`](src/content.js). The remaining flagged items:

1. **Testimonials** — `proof.slots`. **Real client quotes only.** Until you fill
   at least one, the page shows clearly-marked placeholder cards. Delete any
   slots you don't fill (3–5 total).
2. **Founder note** — `founder`. Drafted from your story (compression season →
   rebirth). Personalize it before launch.

Already set: **founding price** is ₱25,000 (`pilot.price`), and the **CTA /
intake** is the embedded Tally form above.

## Editing copy

Everything is in `src/content.js`, in the house voice: short lines, one idea per
line, `~` not em dashes, functional emoji only. Hard rules baked in: no
guarantees, no identity-as-motivation, no "you're not X, you're Y", and the
precise "AI can simulate many human outputs…" framing for what AI can't replace.
