# Capturing opt-ins to your own Supabase (you own the data)

The opt-in step posts to `/api/capture`, which inserts a row into a Supabase
table. Nothing is stored anywhere you don't control. If the two env vars below
aren't set, capture is skipped silently and the gift still works end to end.

You can do this two ways. **Either** let me run it for you through the Supabase
integration (you'll get a one-time approval prompt), **or** do these clicks
yourself ~ it's quick.

## What I can do for you (if you approve the Supabase tool)
- Create the `mirror_optins` table + the insert-only security policy.
- Read back your project URL and publishable key and hand you the exact values
  to paste into Vercel.

## Doing it yourself (≈5 min)

### 1. Create the table
Supabase dashboard → your project → **SQL Editor** → **New query** → paste this
and **Run**:

```sql
create table if not exists public.mirror_optins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lens text,
  email text,
  interests text,
  cues text,
  freshness text,
  social text,
  label_word text,
  label_leaves_out text,
  residue text,
  signature_line text
);

-- Lock it down: the app can insert, but nobody can read rows with the public key.
alter table public.mirror_optins enable row level security;

create policy "anon can insert optins"
  on public.mirror_optins
  for insert
  to anon, authenticated
  with check (true);
```

> Why this is safe: there's **no read policy**, so the public key can only add
> rows ~ it can't list anyone's data back out. You read your opt-ins in the
> Supabase **Table Editor** (which uses your privileged access).

### 2. Get your two values
- **Project URL:** Settings → **API** → *Project URL* (looks like
  `https://abcd1234.supabase.co`).
- **Key:** Settings → **API** → the **publishable** key (`sb_publishable_…`) or
  the legacy **anon** key. Either works.

### 3. Put them in Vercel
Vercel → the `futureproof-mirror` project → **Settings → Environment Variables**,
add both, then **Deployments → ⋯ → Redeploy**:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | your Project URL |
| `SUPABASE_KEY` | your publishable / anon key |

That's it. New opt-ins land in the `mirror_optins` table, owned by you.

## Reading your opt-ins
Supabase dashboard → **Table Editor** → `mirror_optins`. Sort by `created_at`.

> Note: the Mirror does not send any email itself. This table is your list ~ you
> reach out from it (or pipe it into your tool of choice) whenever you like.
