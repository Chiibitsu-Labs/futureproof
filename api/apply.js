// Serverless function (Vercel) ~ receives founding-cohort applications and
// forwards them to a Google Sheet.
//
// Setup (no heavy googleapis dependency needed):
//   1. In your Google Sheet: Extensions -> Apps Script.
//   2. Paste a doPost(e) that appends e.postData.contents as a row, then
//      Deploy -> New deployment -> Web app -> "Anyone" can access.
//   3. Copy the /exec URL into the SHEET_WEBHOOK_URL env var on Vercel.
//
// Env vars:
//   SHEET_WEBHOOK_URL  ~ the Apps Script web-app URL (required to persist).
//
// If SHEET_WEBHOOK_URL is unset, the function still returns 200 so the page
// works in preview ~ it just logs instead of writing. Set it before launch.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { name, email, segment, why, honeypot } = body

    // Honeypot: real people leave this hidden field empty.
    if (honeypot) return res.status(200).json({ ok: true })

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'A valid email is required.' })
    }

    const row = {
      name: (name || '').toString().slice(0, 200),
      email: email.toString().slice(0, 200),
      segment: (segment || '').toString().slice(0, 200),
      why: (why || '').toString().slice(0, 2000),
      source: 'futureproof-landing',
      submittedAt: new Date().toISOString(),
    }

    const webhook = process.env.SHEET_WEBHOOK_URL
    if (!webhook) {
      // No sheet wired up yet ~ don't lose the lead silently in dev.
      console.log('[apply] SHEET_WEBHOOK_URL not set. Application:', row)
      return res.status(200).json({ ok: true, stored: false })
    }

    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })

    if (!upstream.ok) {
      console.error('[apply] sheet webhook failed:', upstream.status)
      return res.status(502).json({ ok: false, error: 'Could not save right now.' })
    }

    return res.status(200).json({ ok: true, stored: true })
  } catch (err) {
    console.error('[apply] error:', err)
    return res.status(500).json({ ok: false, error: 'Something went wrong.' })
  }
}
