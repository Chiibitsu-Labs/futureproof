# Putting the Mirror on `mirror.chiibitsu.com`

The Mirror shares its keepsake and link-preview from `mirror.chiibitsu.com`.
Until that subdomain points at the Vercel deployment, shared links show a bare
URL with no preview image (Facebook/X can't reach the page to read its tags).

This is a subdomain of `chiibitsu.com`, so it's two small steps: add it in
Vercel, then add one DNS record at GoDaddy. ~5 minutes + propagation.

> The cohort keeps `futureproof.chiibitsu.com` ~ this doesn't touch it. Each
> project owns its own domain, so there's no proxy and nothing to coordinate.

## 1. Add the domain in Vercel
Vercel → **futureproof-mirror** → **Settings → Domains** → add
`mirror.chiibitsu.com`. Vercel will show the exact DNS record to create ~ for a
subdomain it's almost always a **CNAME** pointing at `cname.vercel-dns.com`.

## 2. Add the DNS record at GoDaddy
GoDaddy → **My Products → `chiibitsu.com` → DNS → Add New Record**:

| Field | Value |
| --- | --- |
| Type | `CNAME` |
| Name | `mirror` |
| Value / Points to | `cname.vercel-dns.com` (use whatever Vercel showed) |
| TTL | default (1 hour) |

Save. Vercel verifies automatically once DNS propagates (minutes, occasionally
up to an hour). When it flips to **Valid**, the Mirror is live at
`https://mirror.chiibitsu.com` and `https://mirror.chiibitsu.com/og.png` resolves.

## 3. Refresh the social preview cache
Facebook/LinkedIn cache the first scrape of a URL. After the domain is live,
force a fresh read so the new card + image show:

- **Facebook:** https://developers.facebook.com/tools/debug/ → paste
  `https://mirror.chiibitsu.com` → **Scrape Again**. It also reports exactly what
  it sees (title, image, any errors) ~ the fastest way to confirm it's working.
- **LinkedIn:** https://www.linkedin.com/post-inspector/
- **X:** shares pick up the new tags on the next post (no manual cache tool).

## Why a subdomain, not `futureproof.chiibitsu.com/mirror`
One custom domain can only attach to one Vercel project. The Mirror and the
cohort are two separate projects, so a shared `futureproof.chiibitsu.com/...`
path would need one project to reverse-proxy the other ~ more moving parts, and
it couples the two deploys. Separate subdomains keep each project independent
and make the OG image reliably reachable.
