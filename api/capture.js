// ─────────────────────────────────────────────────────────────────────────
//  /api/capture ~ optional, after-the-gift opt-in.
//
//  Two independent, optional jobs (each runs only if its env vars are set):
//   1. Store the opt-in in YOUR Supabase database (SUPABASE_URL + SUPABASE_KEY).
//   2. Email the person what they ticked, via Resend (RESEND_API_KEY +
//      MIRROR_FROM_EMAIL), assembling the email from their chosen interests.
//
//  If nothing is configured, this resolves gracefully so the gift never breaks.
//  Returns { ok, captured, emailed } so the UI can tell the visitor the truth.
// ─────────────────────────────────────────────────────────────────────────

const TABLE = 'mirror_optins'
const COHORT_URL = 'https://futureproof.chiibitsu.com/cohort'
const MIRROR_URL = 'https://futureproof.chiibitsu.com/mirror'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      res.status(400).json({ error: 'Could not read submission.' })
      return
    }
  }
  body = body || {}

  const {
    lens = '',
    email = '',
    interests = [],
    cues = [],
    freshness = '',
    signature = {},
    signatureLine = '',
    reflection = null
  } = body

  const cleanEmail = String(email).trim().slice(0, 200)
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ? cleanEmail : ''
  const picks = Array.isArray(interests) ? interests.map(String) : []

  const captured = await storeInSupabase({ lens, safeEmail, picks, cues, freshness, signature, signatureLine })
  const emailed = await sendEmail({ safeEmail, picks, reflection, signatureLine })

  res.status(200).json({ ok: true, captured, emailed })
}

// ── Supabase ─────────────────────────────────────────────────────────────────
async function storeInSupabase({ lens, safeEmail, picks, cues, freshness, signature, signatureLine }) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) return false

  const row = {
    lens: cell(lens, 40),
    email: safeEmail,
    interests: cell(picks.join(', '), 200),
    cues: cell(Array.isArray(cues) ? cues.map((c) => c.tag || c.id || c).join(' | ') : '', 400),
    freshness: cell(freshness, 1500),
    social: cell(signature.social, 1500),
    label_word: cell(signature.labelWord, 200),
    label_leaves_out: cell(signature.labelLeavesOut, 1500),
    residue: cell(signature.residue, 1500),
    signature_line: cell(signatureLine, 600)
  }

  try {
    const r = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    })
    if (!r.ok) {
      console.error('Supabase insert error:', r.status, await r.text())
      return false
    }
    return true
  } catch (err) {
    console.error('Supabase insert failed:', err)
    return false
  }
}

// ── Resend email ───────────────────────────────────────────────────────────
async function sendEmail({ safeEmail, picks, reflection, signatureLine }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MIRROR_FROM_EMAIL
  if (!apiKey || !from || !safeEmail || picks.length === 0) return false

  const wantsReflection = picks.includes('reflection')
  const wantsCohort = picks.includes('cohort')
  const wantsTips = picks.includes('tips')

  const subject = wantsReflection
    ? 'What AI can’t replace about you'
    : wantsCohort
      ? 'Your next step ~ Futureproof Me'
      : 'You’re on the list ~ Chiibitsu Labs'

  const html = buildEmailHtml({ wantsReflection, wantsCohort, wantsTips, reflection, signatureLine })

  const payload = { from, to: [safeEmail], subject, html }
  // Optionally send a copy to chii so each opt-in can be followed up personally.
  const notify = process.env.MIRROR_NOTIFY_EMAIL
  if (notify) payload.bcc = [notify]

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })
    if (!r.ok) {
      console.error('Resend error:', r.status, await r.text())
      return false
    }
    return true
  } catch (err) {
    console.error('Resend send failed:', err)
    return false
  }
}

function buildEmailHtml({ wantsReflection, wantsCohort, wantsTips, reflection, signatureLine }) {
  const r = reflection && typeof reflection === 'object' ? reflection : {}
  const blocks = []

  if (wantsReflection) {
    const hero = esc(r.signatureLine || signatureLine || '')
    blocks.push(`
      <h2 style="font:600 13px/1.4 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ffb98a;margin:0 0 10px">${esc(r.signatureTitle || 'What stays yours')}</h2>
      ${hero ? `<p style="font:500 22px/1.35 Georgia,serif;color:#fff;margin:0 0 14px">“${hero}”</p>` : ''}
      ${para(r.signatureBody)}
      ${
        r.insight
          ? `<h2 style="font:600 13px/1.4 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#c4a7f0;margin:24px 0 10px">${esc(r.insightTitle || 'What you might not be seeing')}</h2>${para(r.insight)}${r.implication ? para(r.implication) : ''}`
          : ''
      }
      ${r.nextDecision ? `<p style="font:italic 16px/1.5 Georgia,serif;color:#fff;margin:18px 0 0">${esc(r.nextDecision)}</p>` : ''}
    `)
  }

  if (wantsCohort) {
    blocks.push(`
      <h2 style="font:600 13px/1.4 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ffb98a;margin:0 0 10px">Your next step</h2>
      <p style="font:400 16px/1.6 system-ui,sans-serif;color:#e9ddff;margin:0 0 16px">The 10-week Futureproof Me challenge is built to close exactly this gap ~ with you.</p>
      <a href="${COHORT_URL}" style="display:inline-block;background:#ffd7ad;color:#2a1450;font:600 15px system-ui,sans-serif;text-decoration:none;padding:13px 26px;border-radius:999px">See how the cohort works →</a>
    `)
  }

  if (wantsTips && !wantsReflection && !wantsCohort) {
    blocks.push(`<p style="font:400 16px/1.6 system-ui,sans-serif;color:#e9ddff;margin:0">You’re on the list ~ I’ll send the occasional note on futureproofing. Nothing noisy.</p>`)
  } else if (wantsTips) {
    blocks.push(`<p style="font:400 14px/1.6 system-ui,sans-serif;color:#a892d4;margin:0">I’ll also send the occasional note on futureproofing ~ nothing noisy.</p>`)
  }

  const sections = blocks
    .map(
      (b) =>
        `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:18px;padding:26px 24px;margin:0 0 16px">${b}</div>`
    )
    .join('')

  return `<!doctype html><html><body style="margin:0;background:#150726;padding:28px 16px">
    <div style="max-width:540px;margin:0 auto">
      <p style="font:400 12px system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#ffb98a;margin:0 0 4px">from The Mirror</p>
      <p style="font:400 15px/1.5 system-ui,sans-serif;color:#d6c8f2;margin:0 0 20px">Here’s what you asked me to send. \u{1F49C}</p>
      ${sections}
      <p style="font:400 13px/1.6 system-ui,sans-serif;color:#a892d4;text-align:center;margin:22px 0 0">
        Chiibitsu Labs ~ more human, by design<br/>
        <a href="${MIRROR_URL}" style="color:#c4a7f0;text-decoration:none">${MIRROR_URL.replace('https://', '')}</a>
      </p>
    </div>
  </body></html>`
}

// Render a newline-separated string as paragraphs of short lines.
function para(text) {
  if (!text) return ''
  return String(text)
    .split(/\n+/)
    .filter(Boolean)
    .map(
      (line) =>
        `<p style="font:400 16px/1.6 system-ui,sans-serif;color:#d6c8f2;margin:0 0 8px">${esc(line)}</p>`
    )
    .join('')
}

// Escape for safe inclusion in HTML email (model output is not trusted markup).
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Make a value safe for a spreadsheet/db cell: coerce to string, strip control
// characters (keep newline/tab), neutralize formula-leading chars, cap length.
function cell(value, max = 500) {
  let s = value == null ? '' : String(value)
  let out = ''
  for (const ch of s) {
    const code = ch.charCodeAt(0)
    if (code === 9 || code === 10 || code >= 32) out += ch
  }
  s = out.trim().slice(0, max)
  if (/^[=+\-@]/.test(s)) s = "'" + s
  return s
}
