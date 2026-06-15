# Futureproof Me ~ founding cohort landing page

The sales page for **Futureproof Me**, a 10-week founding cohort from Chiibitsu Labs.
This is the page the free Mirror gift's result screen points to.

> more human, by design

## Stack

- **Vite + React** static page → builds to `/dist`
- **One serverless function** (`/api/apply`) → forwards applications to a Google Sheet
- Deploys on **Vercel** (private repo is fine). No database, no auth.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static build → /dist
npm run preview    # preview the production build
```

## Deploy on Vercel

1. Import the repo on Vercel (framework auto-detects as Vite).
2. Add the env vars below (Project → Settings → Environment Variables).
3. Deploy. The `/api/apply` function is picked up automatically.

## Environment variables

| Var | Where | What |
| --- | --- | --- |
| `SHEET_WEBHOOK_URL` | Server | Google Apps Script web-app `/exec` URL that appends applications to your Sheet. See `api/apply.js` for the 3-step setup. If unset, the form still works but logs instead of saving. |
| `VITE_APPLY_URL` | Build | Optional. A DM link or external form. If set, the apply buttons open it instead of the on-page form. Leave empty to use the built-in form. |

### Wiring the Google Sheet (no keys, no googleapis)

1. In your Sheet: **Extensions → Apps Script**.
2. Paste:
   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSheet();
     sheet.appendRow([d.submittedAt, d.name, d.email, d.segment, d.why, d.source]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment → Web app** → execute as you, access "Anyone".
   Copy the `/exec` URL into `SHEET_WEBHOOK_URL`.

## 🚩 Before you launch ~ things to set (don't ship the placeholders)

All copy lives in [`src/content.js`](src/content.js). The four flagged items:

1. **Testimonials** — `proof.slots` in `content.js`. **Real client quotes only.**
   Until you fill at least one, the page shows clearly-marked placeholder cards.
   Delete any slots you don't fill (3–5 total).
2. **Founding price** — `pilot.price.placeholder` in `content.js`. Set the
   founding rate (not the SRP).
3. **Founder note** — `founder` in `content.js`. It's drafted from your story
   (compression season → rebirth). Personalize it before launch.
4. **CTA destination** — either keep the built-in apply form (wired to the
   Sheet) or set `VITE_APPLY_URL` to a DM / external form link.

## Editing copy

Everything is in `src/content.js`, written in the house voice: short lines,
one idea per line, `~` not em dashes, functional emoji only. Hard rules baked in:
no guarantees, no identity-as-motivation, no "you're not X, you're Y", and the
precise "AI can simulate many human outputs…" framing for what AI can't replace.
