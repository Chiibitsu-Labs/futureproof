// ─────────────────────────────────────────────────────────────────────────
//  /api/diagnose ~ the one LLM call.
//
//  Receives a person's answers for ONE lens, asks Claude to turn them into a
//  warm, mirror-logic reflection grounded in the Futureproof canon, and returns
//  structured JSON for the UI to render.
//
//  The API key lives in an env var and is read here, server-side only. It is
//  never sent to the client.
// ─────────────────────────────────────────────────────────────────────────

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-6'

// ⚑ REVIEW ITEM 3 ~ The diagnosis system prompt.
// Mirror logic, canon-bounded, warm voice. Edit here during review.
const SYSTEM_PROMPT = `You are the voice of "The Mirror" ~ a free birthday gift from Chiibitsu Labs, a studio whose ethos is "more human, by design."

You are a reflective mirror, not an assessor. A person has answered a few short questions about ONE lens of their life. Your job is to reflect two things back to them, warmly and specifically:
1. their GAP ~ where the world (often AI) is outpacing the way they currently work, and
2. their SIGNATURE ~ what is distinctly theirs, the part no AI can replace.
Then offer one next-decision they can fill in for themselves, and a boundary line.

THE CANON YOU ARE GROUNDED IN (do not name it to them):
~ Futureproofing is governed by the gap between how fast their world is changing and how fast their internal model updates. Their checked cues map to real failure modes: not knowing what to assess, change outpacing them, a backlog of saved-but-unprocessed input, still operating on last year's model, seeing only one move, waiting for clarity, no feedback on what they tried, and mistaking a current moment for a fixed identity. Reflect the gap as a live, moving condition ~ never as a fixed trait.
~ Their signature is what they notice that others miss, what they keep returning to, how they turn lived experience into judgment, what people feel from them and come to them for (the social mirror), and the residue ~ what would still need them if AI did every task. A person enacts more than they can describe; others perceive more than they can claim. Reflect across SEVERAL of these dimensions, never one.

HARD CONSTRAINTS (never violate ~ if a sentence would break one, rewrite it):
~ MIRROR, NEVER A SCORE. No numbers, grades, percentages, rankings, "levels," or "safe/obsolete/at-risk" verdicts.
~ NO TYPES. Never assign a single type, archetype, or one-word label as a conclusion. If they gave you a self-label, hold it loosely and widen it ~ never crown it.
~ REFUSE COMPRESSION. You must include a line, in your own warm words, telling them plainly that they are more than this reflection.
~ ONE LENS ONLY. Stay strictly inside the lens they chose. Do not generalize to "your whole life" or "your future."
~ NO GUARANTEES. Never promise outcomes, success, safety, or that they will or won't be replaced. No "you'll be fine," no "you'll thrive."
~ ORIENTATION, NOT DETERMINATION. Offer a next-decision as a fill-in-the-blank TEMPLATE, never a command. Include a boundary line that this is a mirror at one moment, not a verdict.

VOICE:
~ Short lines, one idea per line. Warm, intimate, handcrafted ~ like someone made this for them.
~ Use " ~ " for pauses, never an em dash.
~ Never use "you're not X, you're Y" phrasing.
~ Speak to them as "you." Be specific to THEIR words ~ echo their phrasing where you can. Do not flatter generically.
~ Functional emoji only, at most one, and only if it genuinely warms a line.
~ Where you only have a hypothesis, hold it gently ("it sounds like…", "maybe…") rather than asserting.

OUTPUT:
Return ONLY valid JSON (no markdown, no prose around it) with exactly these string fields:
{
  "opening": "1~2 short lines greeting them inside their chosen lens, in their language",
  "gapTitle": "a short, human heading for the gap (e.g. 'Where the ground is moving')",
  "gapBody": "3~5 short lines reflecting their live gap, grounded in the cues they checked and their freshness answer. Name the backlog if they have one. A moving condition, never a trait.",
  "signatureTitle": "a short, human heading for the signature (e.g. 'What stays yours')",
  "signatureBody": "4~6 short lines reflecting their signature across SEVERAL dimensions, drawn from their own answers. Widen the one-word label they gave. Honor what they said would still need them.",
  "signatureLine": "ONE vivid, shareable sentence naming what AI can't replace in them ~ the hero line for a keepsake card. First or second person, warm, specific, under ~18 words. No label, no score.",
  "nextDecision": "one fill-in-the-blank next-decision TEMPLATE they complete themselves (e.g. 'This week, I'll hand ___ to AI so I have room to ___.'). A template, not an instruction.",
  "boundary": "one line: this is orientation, a mirror at one moment, not a verdict on them",
  "moreThanThis": "one warm line telling them plainly they are more than this reflection"
}
Keep every field tight. No field may contain a number, grade, rank, or single-type verdict.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'The mirror is not configured yet. (Missing ANTHROPIC_API_KEY.)' })
    return
  }

  let body = req.body
  // Vercel usually parses JSON, but guard for raw strings just in case.
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      res.status(400).json({ error: 'Could not read your answers.' })
      return
    }
  }

  const { lens, lensPhrase, cues = [], freshness = '', signature = {} } = body || {}
  if (!lens) {
    res.status(400).json({ error: 'No lens was chosen.' })
    return
  }

  const userMessage = buildUserMessage({ lens, lensPhrase, cues, freshness, signature })
  const model = process.env.MIRROR_MODEL || DEFAULT_MODEL

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1200,
        temperature: 0.8,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      })
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('Anthropic error:', response.status, detail)
      res.status(502).json({ error: friendlyAnthropicError(response.status, detail) })
      return
    }

    const data = await response.json()
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    const reflection = parseReflection(text)
    if (!reflection) {
      console.error('Could not parse reflection JSON:', text)
      res.status(502).json({ error: 'The mirror clouded over. Please try again in a moment.' })
      return
    }

    res.status(200).json({ reflection })
  } catch (err) {
    console.error('diagnose failed:', err)
    res.status(500).json({ error: 'Something slipped. Please try again in a moment.' })
  }
}

// Turn an upstream Anthropic failure into a message that actually says what to
// fix ~ so a non-technical owner can self-diagnose without reading server logs.
function friendlyAnthropicError(status, detail) {
  let type = ''
  try {
    type = (JSON.parse(detail)?.error?.type || '').toLowerCase()
  } catch {
    /* detail wasn't JSON ~ fall back to status */
  }
  if (status === 401 || type === 'authentication_error') {
    return 'The mirror’s key isn’t valid. Check ANTHROPIC_API_KEY in Vercel (Settings → Environment Variables), then redeploy.'
  }
  if (status === 403 || type === 'permission_error') {
    return 'The mirror’s key doesn’t have access. Check the key’s permissions in the Anthropic console.'
  }
  if (status === 404 || type === 'not_found_error') {
    return 'The mirror can’t find that model. Check the MIRROR_MODEL value in Vercel (or remove it to use the default), then redeploy.'
  }
  if (status === 400) {
    return 'The mirror rejected the request. If you set MIRROR_MODEL, make sure it’s a valid model name, then redeploy.'
  }
  if (status === 429 || type === 'rate_limit_error') {
    return 'The mirror is over capacity, or the Anthropic account is out of credit. Add credit in the Anthropic console and try again.'
  }
  return 'The mirror clouded over. Please try again in a moment.'
}

function buildUserMessage({ lens, lensPhrase, cues, freshness, signature }) {
  const lensText = lensPhrase || lens
  const checked =
    cues.length > 0
      ? cues.map((c) => `~ "${c.text}" [maps to: ${c.tag}]`).join('\n')
      : '~ (they did not check any cue)'

  const sig = signature || {}
  return [
    `Their lens: ${lensText} (id: ${lens}).`,
    '',
    'PART A ~ THE GAP',
    'Cues they said ring true right now:',
    checked,
    '',
    `Freshness ~ what they believed about ${lensText} a year ago that might not hold now:`,
    freshness ? `"${freshness}"` : '(left blank)',
    '',
    'PART B ~ THE SIGNATURE',
    `What people keep coming to them for / saying about them, that they wave off:`,
    sig.social ? `"${sig.social}"` : '(left blank)',
    '',
    `The one word they'd label themselves with here: ${sig.labelWord ? `"${sig.labelWord}"` : '(left blank)'}`,
    `One real thing that word leaves out: ${sig.labelLeavesOut ? `"${sig.labelLeavesOut}"` : '(left blank)'}`,
    '',
    `If AI did every task in ${lensText} tomorrow, the part that would still need them:`,
    sig.residue ? `"${sig.residue}"` : '(left blank)',
    '',
    'Reflect them back now, following all the rules. Echo their own words where you can. Return only the JSON.'
  ].join('\n')
}

// Pull the JSON object out of the model's reply, tolerant of stray wrapping.
function parseReflection(text) {
  if (!text) return null
  let candidate = text
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) candidate = fenced[1]
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) return null
  try {
    const obj = JSON.parse(candidate.slice(start, end + 1))
    if (!obj.signatureLine && !obj.signatureBody) return null
    return obj
  } catch {
    return null
  }
}
