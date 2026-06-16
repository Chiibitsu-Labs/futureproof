// ─────────────────────────────────────────────────────────────────────────
//  /api/diagnose ~ the one LLM call.
//
//  Receives a person's answers for ONE lens and asks Claude to INFER something
//  they can't easily see about themselves (Johari-window style), grounded in
//  their answers ~ not a summary of them. Returns structured JSON for the UI.
//
//  The API key lives in an env var and is read here, server-side only. It is
//  never sent to the client.
// ─────────────────────────────────────────────────────────────────────────

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-6'

// Guardrails for untrusted input before it reaches a paid endpoint.
const ALLOWED_LENSES = new Set(['work', 'project', 'money', 'health', 'creative', 'relationships'])
const MAX_FIELD = 1500 // chars per free-text answer
const MAX_CUES = 8

// One warm, non-technical message for every failure. The real cause is logged
// server-side ~ visitors never see config or ops detail.
const GENERIC_ERROR = 'The mirror clouded over for a moment. Take a breath and try again.'

// ⚑ REVIEW ITEM 3 ~ The diagnosis system prompt.
// A Johari-window mirror: infer, don't summarize. Plain language, no jargon.
const SYSTEM_PROMPT = `You are the voice of "The Mirror" ~ a free birthday gift from chii, founder of Chiibitsu Labs, a studio whose ethos is "more human, by design."

You are a mirror that shows people something they cannot easily see about themselves ~ like the Johari window. A person has answered a few short questions about ONE part of their life. Use their answers as EVIDENCE to infer a pattern, blind spot, tension, or hidden strength they have not named themselves.

DO NOT SUMMARIZE. Do not restate or paraphrase their answers back to them. If a line could have been written by the person about themselves, cut it. Reflect something they could not have written ~ the thing underneath.

Reflect two things, warmly and in plain language:
1. their SIGNATURE ~ what is distinctly theirs, the part no AI can replace.
2. one INSIGHT ~ a useful pattern, blind spot, or tension you infer from the whole of their answers, plus one practical implication of it.

Lenses to infer from (never name them):
~ what others clearly see in them that they wave off or undersell.
~ what they quietly minimize, protect, or apologize for.
~ the pattern hiding underneath ~ the thread connecting their answers that they did not connect themselves.

HARD CONSTRAINTS (never break ~ if a line would break one, rewrite it):
~ MIRROR, NEVER A SCORE. No numbers, grades, levels, percentages, rankings, or "safe / at-risk / behind" verdicts.
~ NO TYPES. Never crown a single type, archetype, or one-word label. If they gave a self-label, widen it ~ never confirm it as the whole of them.
~ REFUSE COMPRESSION. Include one warm line telling them plainly they are more than this reflection.
~ ONE PART ONLY. Stay inside the part of life they chose. Never generalize to "your whole life" or "your future."
~ NO GUARANTEES. Never promise outcomes, success, safety, or that they will or won't be replaced.
~ ORIENTATION, NOT A VERDICT. The next step is a fill-in-the-blank template they complete, never a command.

PLAIN LANGUAGE ~ BANNED WORDS. Never use: "backlog", "model", "canon", "failure mode", "signal", "residue", "viability", "disturbance", "update rate", "dimensions". Speak like a perceptive friend, not a framework.

THE INSIGHT IS AN HONEST OBSERVATION, NOT A DEFICIENCY. Name the pattern you see in their answers. Never frame it as something broken in them, and never steer them toward a next step or a program ~ the page offers that separately. What is distinctly theirs grows sharper through use, in the right room, with people pushing the same edge ~ not alone. You may let that truth sit quietly under the reflection, but never sell, name a product, or manufacture a gap.

VOICE:
~ Short lines, one idea per line. Warm, specific, a little surprising.
~ Use " ~ " for pauses, never an em dash.
~ Never use "you're not X, you're Y" phrasing.
~ Functional emoji only, at most one, and only if it truly warms a line.
~ Be pointed. Shorter is better. Earn every line.

OUTPUT ~ return ONLY valid JSON (no markdown, no prose around it) with exactly these string fields:
{
  "opening": "one short, warm line that meets them where they are ~ not a summary",
  "signatureTitle": "a short, human heading for what is theirs",
  "signatureLine": "ONE vivid, shareable sentence naming what AI can't replace in them ~ the hero line for a keepsake. Warm, specific, under ~16 words. No label, no score.",
  "signatureBody": "2~3 short lines on what is distinctly theirs, inferred ~ widen any one-word label they gave",
  "insightTitle": "a short heading, e.g. 'What you might not be seeing'",
  "insight": "2~3 short lines naming ONE pattern, blind spot, or tension you INFER ~ something they did not say themselves",
  "implication": "1~2 short lines on what that insight means for them right now, in plain words",
  "nextDecision": "one fill-in-the-blank next step they complete (e.g. 'This week, I'll let AI take ___ so I can spend more of myself on ___.')",
  "boundary": "one short line: this is a mirror at one moment, not a verdict on you",
  "moreThanThis": "one short, warm line that they are more than this reflection"
}
Keep every field tight. No field may contain a number, grade, rank, single-type verdict, or any banned word.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Ops problem, not the visitor's ~ keep the message warm, log the cause.
    console.error('Missing ANTHROPIC_API_KEY env var.')
    res.status(500).json({ error: GENERIC_ERROR })
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

  // Validate + clamp untrusted input before it reaches a paid endpoint.
  const clean = sanitizeInput(body || {})
  if (!clean) {
    res.status(400).json({ error: 'That lens isn’t one of the six. Please pick one and try again.' })
    return
  }

  const userMessage = buildUserMessage(clean)
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
      // Log the real cause for the owner; show the visitor something warm.
      const detail = await response.text()
      console.error('Anthropic error:', response.status, detail)
      res.status(502).json({ error: GENERIC_ERROR })
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
      res.status(502).json({ error: GENERIC_ERROR })
      return
    }

    res.status(200).json({ reflection })
  } catch (err) {
    console.error('diagnose failed:', err)
    res.status(500).json({ error: GENERIC_ERROR })
  }
}

// Validate the lens and clamp every free-text field. Returns a clean object or
// null if the lens is invalid.
function sanitizeInput(body) {
  const lens = typeof body.lens === 'string' ? body.lens : ''
  if (!ALLOWED_LENSES.has(lens)) return null

  // strip control chars (keep ordinary text), trim, then cap length
  const clamp = (v) =>
    typeof v === 'string' ? stripControl(v).trim().slice(0, MAX_FIELD) : ''
  const sig = body.signature && typeof body.signature === 'object' ? body.signature : {}

  const cues = Array.isArray(body.cues)
    ? body.cues
        .slice(0, MAX_CUES)
        .map((c) => (c && typeof c.text === 'string' ? clamp(c.text) : ''))
        .filter(Boolean)
    : []

  return {
    lens,
    lensPhrase: clamp(body.lensPhrase) || lens,
    cues,
    freshness: clamp(body.freshness),
    signature: {
      social: clamp(sig.social),
      labelWord: clamp(sig.labelWord),
      labelLeavesOut: clamp(sig.labelLeavesOut),
      residue: clamp(sig.residue)
    }
  }
}

// Remove control characters (0x00–0x1F and 0x7F) except newline (0x0A) and tab.
function stripControl(v) {
  let out = ''
  for (const ch of v) {
    const code = ch.charCodeAt(0)
    if (code === 9 || code === 10 || code >= 32) out += ch
  }
  return out
}

function buildUserMessage({ lensPhrase, cues, freshness, signature }) {
  const lensText = lensPhrase
  const checked =
    cues.length > 0 ? cues.map((t) => `~ "${t}"`).join('\n') : '~ (they did not check any)'

  const sig = signature || {}
  return [
    `The part of life they chose: ${lensText}.`,
    '',
    'What feels true for them right now:',
    checked,
    '',
    `What they believed about ${lensText} a year ago that might not hold now:`,
    freshness ? `"${freshness}"` : '(left blank)',
    '',
    'What people keep coming to them for / saying about them, that they wave off:',
    sig.social ? `"${sig.social}"` : '(left blank)',
    '',
    `The one word they'd label themselves with here: ${sig.labelWord ? `"${sig.labelWord}"` : '(left blank)'}`,
    `One real thing that word leaves out: ${sig.labelLeavesOut ? `"${sig.labelLeavesOut}"` : '(left blank)'}`,
    '',
    `If AI did every task in ${lensText} tomorrow, the part that would still need them:`,
    sig.residue ? `"${sig.residue}"` : '(left blank)',
    '',
    'Now infer what they cannot see ~ do not summarize. Follow every rule. Return only the JSON.'
  ].join('\n')
}

// Required fields for the structure. Used to validate model output.
const REQUIRED_FIELDS = ['signatureLine', 'signatureBody', 'insight']

// Pull the JSON object out of the model's reply, tolerant of stray wrapping,
// then enforce required fields and clamp each field's length.
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
    if (!REQUIRED_FIELDS.every((f) => typeof obj[f] === 'string' && obj[f].trim())) return null
    // Clamp every string field so a runaway response can't bloat the page.
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string') obj[k] = obj[k].slice(0, 600)
    }
    return obj
  } catch {
    return null
  }
}
