# How to put The Mirror online (no coding ~ promise)

You don't need to touch code. You'll connect the project to **Vercel** (a free
hosting service), give it one secret key, and it gives you a live web address.
About 15 minutes, mostly clicking.

There are two short setup jobs:
- **A.** Get an Anthropic API key (this is what writes the reflections).
- **B.** Connect the project to Vercel and paste that key in.

Do A first, then B.

---

## A. Get your Anthropic API key (~5 min)

This key lets the gift talk to Claude. It stays secret on the server ~ visitors
never see it.

1. Go to **https://console.anthropic.com** and sign in (or sign up).
2. Add a payment method + a little credit: **Billing** → add a card → add, say,
   $5–$20 to start. (Each reflection costs a fraction of a cent. You only pay
   for what's used.)
3. Click **API Keys** → **Create Key**. Name it `mirror`.
4. **Copy the key now** (it starts with `sk-ant-...`). You won't be able to see
   it again ~ if you lose it, just make a new one. Paste it somewhere safe for
   the next step.

---

## B. Connect to Vercel and go live (~10 min)

1. Go to **https://vercel.com** and click **Sign Up** → **Continue with GitHub**
   (use the account that owns the `Chiibitsu-Labs/futureproof` repo). Approve
   the access it asks for.
2. On your Vercel dashboard, click **Add New… → Project**.
3. Find **`Chiibitsu-Labs/futureproof`** in the list and click **Import**.
4. Vercel will auto-detect the settings (it reads the `vercel.json` we ship ~
   you don't change anything here). **Before clicking Deploy**, open the
   **Environment Variables** section and add this one:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste the `sk-ant-...` key from step A
   - Click **Add**.
5. Click **Deploy**. Wait ~1 minute while it builds.
6. 🎉 You'll get a live link like `futureproof-xxxx.vercel.app`. Click **Visit**.
   That's the gift, live. Try it end to end.

That's it. From now on, **every time the code on `main` changes, Vercel
re-deploys automatically** ~ you don't repeat these steps.

---

## How you preview my changes BEFORE they go live

This is the part you asked about ~ "how do I see this?"

Once Vercel is connected (step B), it watches the repo. **Every pull request
gets its own private preview link automatically.** So when I open a PR with a
change:

1. Open the PR on GitHub.
2. A bot comment from **Vercel** appears with a **Preview** link.
3. Click it ~ you see exactly that change, live, on its own temporary URL,
   without touching the real site.
4. If you like it, merge the PR → it goes live on the real link. If not, tell me
   and I'll adjust.

So your loop is: *I push → you click the preview → you say yes/no → merge.*
You never run anything.

---

## Optional, later

- **Pretty web address.** To use something like `mirror.chiibitsu.com` instead
  of the `.vercel.app` link: in Vercel → your project → **Settings → Domains**,
  add the subdomain and follow its instructions (it tells you the one DNS record
  to add wherever chiibitsu.com is managed). Not needed to launch.
- **Save opt-in emails to a Google Sheet.** Optional. Follow
  `docs/google-sheet-setup.md`, then add `GOOGLE_SHEET_WEBHOOK_URL` (and
  `GOOGLE_SHEET_WEBHOOK_TOKEN`) the same way you added the API key in step B4.
  Without it, the gift still works fully ~ it just won't record opt-ins.

## If something looks off
- **"The mirror is not configured yet."** → the `ANTHROPIC_API_KEY` wasn't added,
  or has a typo. Vercel → project → **Settings → Environment Variables**, fix it,
  then **Deployments → … → Redeploy**.
- **The reflection won't generate.** → usually means the Anthropic account is out
  of credit. Top up in the Anthropic console (step A2).
