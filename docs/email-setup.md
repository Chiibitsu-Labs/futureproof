# Sending email via Resend

When someone opts in, `/api/capture` emails them what they ticked (their
reflection, the cohort details, or both) through Resend. If the two env vars
below aren't set, no email is sent and the rest of the gift still works ~ the
opt-in just stores to Supabase.

## 1. Make a Resend account + verify your domain (≈10 min)
1. Sign up at **https://resend.com** (free tier is plenty to start).
2. **Domains → Add Domain →** `chiibitsu.com`.
3. Resend shows a few **DNS records** (SPF, DKIM, and usually a return-path).
   Add them wherever `chiibitsu.com`'s DNS is managed, then click **Verify**.
   (This is what lets email come *from you* and land in inboxes, not spam.)
   - Don't have domain access yet? You can test first with Resend's shared
     `onboarding@resend.dev` sender ~ just set `MIRROR_FROM_EMAIL` to that. Move
     to your own domain before launch.

## 2. Create an API key
**API Keys → Create API Key** → name it `mirror` → copy it (`re_…`).

## 3. Add two env vars in Vercel
Vercel → **futureproof-mirror** → **Settings → Environment Variables**, then
**Deployments → ⋯ → Redeploy**:

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | the `re_…` key |
| `MIRROR_FROM_EMAIL` | `The Mirror <hello@chiibitsu.com>` (a sender on your verified domain) |

That's it. Opt-ins that include an email + at least one ticked interest get a
warm, on-brand message assembled from their choices.

## What the email contains
- **My reflection** ticked → their signature + the inferred insight + next move.
- **The 10-week challenge details** ticked → a short invite + a button to
  `futureproof.chiibitsu.com/cohort`.
- **Occasional notes** ticked → a one-line "you're on the list".
- Any combination of the above, in one email.

## Get a copy of every opt-in (optional)
Set one more env var in Vercel and you'll be blind-copied on each email that
goes out, so you can follow up personally:

| Name | Value |
| --- | --- |
| `MIRROR_NOTIFY_EMAIL` | `chii@chiibitsu.com` (or wherever you want the copies) |

It's a **BCC**, so the visitor never sees it. If unset, no copy is sent.

## Notes
- The opt-in screen shows "check your inbox" **only when an email actually
  sent** ~ if Resend isn't configured yet, it falls back to "chii will be in
  touch", so the copy never lies.
