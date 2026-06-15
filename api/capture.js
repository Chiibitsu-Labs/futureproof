// ─────────────────────────────────────────────────────────────────────────
//  /api/capture ~ optional, after-the-gift opt-in.
//
//  Appends the person's answers + (optional) email + interests to a Google
//  Sheet, via a Google Apps Script web app whose URL lives in an env var.
//  See docs/google-sheet-setup.md.
//
//  If GOOGLE_SHEET_WEBHOOK_URL is unset, this resolves gracefully so the gift
//  never breaks ~ capture is a nice-to-have, never a gate.
// ─────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    // No sheet configured ~ accept quietly so the experience stays whole.
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
    timestamp: new Date().toISOString(),
    lens: cell(lens, 40),
    email: safeEmail,
    interests: cell(Array.isArray(interests) ? interests.join(', ') : interests, 200),
    cues: cell(Array.isArray(cues) ? cues.map((c) => c.tag || c.id || c).join(' | ') : '', 400),
    freshness: cell(freshness, 1500),
    social: cell(signature.social, 1500),
    labelWord: cell(signature.labelWord, 200),
    labelLeavesOut: cell(signature.labelLeavesOut, 1500),
    residue: cell(signature.residue, 1500),
    signatureLine: cell(signatureLine, 600),
    token: process.env.GOOGLE_SHEET_WEBHOOK_TOKEN || ''
  }

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row)
    })
    if (!r.ok) {
      const detail = await r.text()
      console.error('Sheet webhook error:', r.status, detail)
      // Still tell the client it's fine ~ we don't want to alarm them over a log.
      res.status(200).json({ ok: true, captured: false })
      return
    }
    res.status(200).json({ ok: true, captured: true })
  } catch (err) {
    console.error('capture failed:', err)
    res.status(200).json({ ok: true, captured: false })
  }
}

// Make a value safe for a spreadsheet cell: coerce to string, strip control
// characters, neutralize formula-leading characters (= + - @), and cap length.
function cell(value, max = 500) {
  let s = value == null ? '' : String(value)
  // remove control chars except newline/tab
  let out = ''
  for (const ch of s) {
    const code = ch.charCodeAt(0)
    if (code === 9 || code === 10 || code >= 32) out += ch
  }
  s = out.trim().slice(0, max)
  // a leading =, +, -, @ can trigger formula execution in spreadsheets
  if (/^[=+\-@]/.test(s)) s = "'" + s
  return s
}
