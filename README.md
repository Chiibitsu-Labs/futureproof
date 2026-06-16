# The Mirror ~ a free gift from Chiibitsu Labs

A free, self-run mirror. A person picks one lens of their life, answers a few
soft questions, and receives a warm, personal reflection of two things:

- their **gap** ~ where the world (often AI) is outpacing the way they work, and
- their **signature** ~ what AI can’t replace in them.

It ends with one next-decision to fill in and a boundary line. It’s the free
front door to the paid 10-week *Futureproof Me* cohort.

**Ethos:** more human, by design.

---

## The five hard constraints (never violated)
1. **Mirror, never a score.** No numbers, grades, or ranking.
2. **No types.** Never one label. Reflect multiple dimensions.
3. **Refuse compression.** Tell them plainly they are more than this reflection.
4. **One lens at a time.** Bounded, not “your whole future.”
5. **No guarantees.** No promises about outcomes.

The magic rule: **the gift is fully delivered before any ask, and every ask is
offered, never required.**

## The flow
Landing → pick a lens → the gap (8 cues + a freshness question) → the signature
(3 prompts) → the mirror fogs and clears → the reflection (on screen, complete)
→ a soft, skippable line about the cohort → a shareable keepsake card → one
optional email opt-in → a warm close.

## Tech
- **Frontend:** Vite + React, static. All copy in `src/data/content.js`.
- **`/api/diagnose.js`:** one serverless function. Sends answers to Claude with a
  mirror-logic system prompt, returns structured JSON. The API key is read
  server-side only and never reaches the client.
- **`/api/capture.js`:** optional. Writes the opt-in to your own Supabase
  database (`docs/supabase-setup.md`) and emails the person what they ticked via
  Resend (`docs/email-setup.md`). Both are independent and skip gracefully if
  unconfigured.
- **Card:** styled HTML → PNG client-side with `html-to-image`. No paid service.
- Everything portable: standard React/Node, keys in env vars.

## Run locally
```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npx vercel dev               # serves the app + /api functions together
```
`npm run dev` runs the Vite front end alone (the `/api` calls need `vercel dev`
or a deployment to respond).

## Deploy
**Not a coder? Start with [`docs/DEPLOY.md`](docs/DEPLOY.md)** ~ a click-by-click
walkthrough for connecting Vercel and seeing the site.

Push to a repo connected to Vercel. Set env vars in the Vercel dashboard:
- `ANTHROPIC_API_KEY` *(required)*
- `MIRROR_MODEL` *(optional, defaults to a current Claude model)*
- `SUPABASE_URL`, `SUPABASE_KEY` *(optional capture ~ see `docs/supabase-setup.md`)*
- `RESEND_API_KEY`, `MIRROR_FROM_EMAIL` *(optional email ~ see `docs/email-setup.md`)*

## Before launch ~ read this
**`docs/REVIEW.md`** gathers the four items flagged for sign-off: the gift name,
the question wording, the diagnosis system prompt, and the card design.
