// ─────────────────────────────────────────────────────────────────────────
//  /api/capture ~ optional, after-the-gift opt-in.
//
//  Writes the opt-in (email + interests + their answers) to YOUR Supabase
//  database, so you own the data. Uses the Supabase REST API with credentials
//  from env vars, server-side only:
//    SUPABASE_URL  ~ e.g. https://abcd1234.supabase.co
//    SUPABASE_KEY  ~ the publishable / anon key (safe to use with insert-only RLS)
//  Table + policy: see docs/supabase-setup.md.
//
//  If those env vars are unset, this resolves gracefully so the gift never
//  breaks ~ capture is a nice-to-have, never a gate.
// ─────────────────────────────────────────────────────────────────────────

const TABLE = 'mirror_optins'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) {
    // Not configured yet ~ accept quietly so the experience stays whole.
    res.status(200).json({ ok: true, captured: false })
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

  const {
    lens = '',
    email = '',
    interests = [],
    cues = [],
    freshness = '',
    signature = {},
    signatureLine = ''
  } = body || {}

  const cleanEmail = String(email).trim().slice(0, 200)
  // Only store an email that actually looks like one.
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ? cleanEmail : ''

  const row = {
    lens: cell(lens, 40),
    email: safeEmail,
    interests: cell(Array.isArray(interests) ? interests.join(', ') : interests, 200),
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
      const detail = await r.text()
      console.error('Supabase insert error:', r.status, detail)
      // Don't alarm the visitor over a capture hiccup ~ the gift is already theirs.
      res.status(200).json({ ok: true, captured: false })
      return
    }
    res.status(200).json({ ok: true, captured: true })
  } catch (err) {
    console.error('capture failed:', err)
    res.status(200).json({ ok: true, captured: false })
  }
}

// Coerce to string, strip control characters (keep newline/tab), neutralize
// any formula-leading character, and cap length.
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
