# ⚑ Four things to review before launch

Everything below is drafted, live in the build, and easy to swap. Nothing is
locked. The four items you asked to sign off on are gathered here so you can
read them in one place.

All copy lives in **`src/data/content.js`**. The diagnosis prompt lives in
**`api/diagnose.js`**. The card visuals live in **`src/components/ShareCard.jsx`**.

---

## 1. Gift name ~ pick one

Currently shipping: **“The Mirror”** (set in `content.js` → `GIFT_NAME.active`).

| Option | Why it might be the one |
| --- | --- |
| **The Mirror** *(recommended)* | On-brand, matches the metaphor and the whole visual language, ages well, never promises a score. |
| **What AI Can’t Replace About You** | Plainer and more literal ~ strong for ads / cold traffic where the benefit needs to be obvious. |
| **The Clearing** | Whimsical ~ leans into the fog-that-clears motion. Softer, more poetic, less explanatory. |

To switch: change `GIFT_NAME.active` and `LANDING.title` in `content.js`.

> Note: we deliberately avoided “How futureproof are you?” ~ it promises a score
> the mirror will never give, and would break the *Mirror, never a score* constraint.

---

## 2. Question / cue wording

### Part 0 ~ Lens (the boundary)
Work · A project · Money · Health · Creative · Relationships
*(One lens at a time. Prevents the unbounded “whole future” overwhelm.)*

### Part A ~ The Gap (check any that ring true)
Worded as felt experiences, not diagnoses. Each maps to a canon failure mode
(shown to the model for grounding, never to the person):

1. I’m not even sure which part to look at.
2. It’s all moving too fast ~ I can’t keep up.
3. I save the tools, the posts, the courses ~ and nothing actually changes.
4. I know the world shifted ~ but I’m still working the way I always did.
5. I can feel something needs to change ~ but I only see one move.
6. I’m waiting until it all gets clearer.
7. I tried something ~ but I have no idea if it worked.
8. Lately this feels like who I am ~ not just what’s happening right now.

**Freshness check (open):** “What did you believe about *[your lens]* a year ago
that might not hold now?”

### Part B ~ The Signature
1. **Social mirror:** “What do people keep coming to you for ~ or keep saying
   about you ~ that you tend to wave off?”
2. **Self-compression catch:** “If you had to label yourself here in one word,
   what is it?” + “Now ~ name one real thing that word leaves out.”
3. **The residue:** “If AI did every task in *[your lens]* tomorrow ~ what’s the
   part that would still need you?”

To edit: `GAP_CUES`, `FRESHNESS`, and `SIGNATURE_PROMPTS` in `content.js`.

---

## 3. The diagnosis LLM system prompt

Full text lives in `api/diagnose.js` as `SYSTEM_PROMPT`. It:

- frames Claude as a **reflective mirror, not an assessor**;
- grounds gap + signature in the canon (without naming it to the person);
- hard-codes the five non-negotiables (no score, no types, refuse compression,
  one lens, no guarantees) **and** orientation-not-determination;
- enforces the voice (short lines, “ ~ ”, no “you’re not X, you’re Y”);
- returns strict JSON the UI renders into sections, including a single
  shareable **signatureLine** (the card hero).

It’s adapted from the signature-extraction prompt in the establish-content doc,
extended to also surface the gap and to output structured fields.

**Model:** defaults to `claude-sonnet-4-6` (good warmth/speed/cost for a free
public gift). Override with the `MIRROR_MODEL` env var.

> Worth a careful read-through for tone ~ it’s the voice of the whole gift.

---

## 4. The shareable card

A 340×340 luminous square in the violet palette, rendered from styled HTML to a
PNG client-side via `html-to-image` (free, no paid service). Structure:

- tiny “from The Mirror” watermark
- prelude line: “What AI can’t replace in me”
- **hero: the signature line** (the model’s `signatureLine`) ~ the gap is never
  on the card
- a small rotating whimsical line (“kept, not scored.”)
- footer: Chiibitsu Labs · more human, by design

To edit copy: `CARD` in `content.js`. To edit visuals: `.keepsake*` rules in
`styles.css` and `ShareCard.jsx`.

---

## Also worth setting before launch
- `RESULT.bridgeLink.href` in `content.js` → the real 10-week cohort URL (now `#cohort`).
- Env vars in Vercel: `ANTHROPIC_API_KEY` (required), optional `MIRROR_MODEL`,
  `GOOGLE_SHEET_WEBHOOK_URL`, `GOOGLE_SHEET_WEBHOOK_TOKEN` (see
  `docs/google-sheet-setup.md`).
