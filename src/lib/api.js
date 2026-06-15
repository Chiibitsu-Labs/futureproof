// Thin client for the two serverless functions. Keeps fetch details out of the UI.

export async function diagnose(payload) {
  const res = await fetch('/api/diagnose', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'The mirror clouded over. Please try again.')
  }
  const { reflection } = await res.json()
  return reflection
}

// Capture is best-effort ~ it must never block or break the gift.
export async function capture(payload) {
  try {
    const res = await fetch('/api/capture', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return await res.json().catch(() => ({ ok: true }))
  } catch {
    return { ok: false }
  }
}
