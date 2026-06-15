// ─────────────────────────────────────────────────────────────────────────
//  The Mirror ~ all human-facing copy lives here.
//  This is the layer to edit during review. Nothing is hardcoded in the UI.
//
//  Voice rules (held throughout):
//   ~ short lines, one idea per line
//   ~ " ~ " never an em dash
//   ~ warm, human, handcrafted
//   ~ no "you're not X, you're Y" reframes
//   ~ functional emoji only
//
//  Hard constraints (never violate ~ from the canon):
//   ~ Mirror, never a score. No numbers, grades, ranking.
//   ~ No types. Never one label. Reflect multiple dimensions.
//   ~ Refuse compression. Tell them they are more than this.
//   ~ One lens at a time.
//   ~ No guarantees.
// ─────────────────────────────────────────────────────────────────────────

// ⚑ REVIEW ITEM 1 ~ Gift name. Three options below; `active` is what ships.
// Swap `active` to the one you choose.
export const GIFT_NAME = {
  active: 'The Mirror ~ What AI Can’t Replace About You', // ← chosen: metaphor + promise
  options: [
    'The Mirror ~ What AI Can’t Replace About You', // chosen
    'The Mirror',
    "What AI Can’t Replace About You",
    'The Clearing'
  ]
}

export const BRAND = {
  lab: 'Chiibitsu Labs',
  ethos: 'more human, by design'
}

// ── Landing ────────────────────────────────────────────────────────────────
export const LANDING = {
  eyebrow: 'a birthday gift from Chiibitsu Labs',
  title: 'The Mirror',
  tagline: 'What AI Can’t Replace About You',
  // kept as separate lines ~ one idea per line
  lines: [
    'AI is getting faster at what you do.',
    'This is a quiet look at what it still can’t do ~ because it’s you.'
  ],
  subtle: 'One lens. A few soft questions. A reflection that’s yours to keep.',
  startButton: 'Hold up the mirror',
  reassure: 'Free. No sign-up. Nothing to pass or fail. ~ 3 minutes.'
}

// ── Lens picker (Part 0 ~ the boundary) ──────────────────────────────────────
export const LENS_INTRO = {
  title: 'Pick one lens',
  subtitle:
    'Not your whole future ~ just one corner of it.\nThe mirror sees more clearly when it’s pointed at one thing.'
}

export const LENSES = [
  { id: 'work', label: 'Work', glyph: '\u{1F4BC}', hint: 'your job, your role, your craft' },
  { id: 'project', label: 'A project', glyph: '\u{1F331}', hint: 'one thing you’re building' },
  { id: 'money', label: 'Money', glyph: '\u{1FA99}', hint: 'how you earn, what you charge' },
  { id: 'health', label: 'Health', glyph: '\u{1F343}', hint: 'energy, body, how you keep going' },
  { id: 'creative', label: 'Creative', glyph: '\u{2728}', hint: 'your art, your voice, your making' },
  {
    id: 'relationships',
    label: 'Relationships',
    glyph: '\u{1F49E}',
    hint: 'the people, the trust, the room you hold'
  }
]

// Helper ~ a soft, human label for the chosen lens, used inside prompts.
export const lensPhrase = (id) => {
  switch (id) {
    case 'work':
      return 'your work'
    case 'project':
      return 'this project'
    case 'money':
      return 'your money'
    case 'health':
      return 'your health'
    case 'creative':
      return 'your creative work'
    case 'relationships':
      return 'your relationships'
    default:
      return 'this part of your life'
  }
}

// ⚑ REVIEW ITEM 2 ~ Question / cue wording.
//
// Part A ~ The Gap. The 8-cue self-recognition list (canon V1–V7 + measurement
// distortion). Worded as felt experiences, not diagnoses. "Check any that ring true."
export const GAP_CUES = {
  title: 'Which of these ring true right now?',
  subtitle: 'Check any. Skip any. There’s no right number.',
  // `tag` maps to the canon failure mode ~ passed to the model for grounding,
  // never shown to the person.
  cues: [
    { id: 'c1', tag: 'V1 boundary', text: 'I’m not even sure which part to look at.' },
    { id: 'c2', tag: 'V2/V3 disturbance + signal', text: 'It’s all moving too fast ~ I can’t keep up.' },
    {
      id: 'c3',
      tag: 'V4 backlog',
      text: 'I save the tools, the posts, the courses ~ and nothing actually changes.'
    },
    {
      id: 'c4',
      tag: 'V5 model divergence',
      text: 'I know the world shifted ~ but I’m still working the way I always did.'
    },
    {
      id: 'c5',
      tag: 'V6 response insufficiency',
      text: 'I can feel something needs to change ~ but I only see one move.'
    },
    { id: 'c6', tag: 'ambiguity aversion', text: 'I’m waiting until it all gets clearer.' },
    { id: 'c7', tag: 'V7 feedback lag', text: 'I tried something ~ but I have no idea if it worked.' },
    {
      id: 'c8',
      tag: 'measurement distortion',
      text: 'Lately this feels like who I am ~ not just what’s happening right now.'
    }
  ]
}

// Part A ~ one freshness check (open text). {lens} is replaced at render time.
export const FRESHNESS = {
  label: 'One quiet question.',
  // {lens} -> lensPhrase()
  prompt: 'What did you believe about {lens} a year ago that might not hold now?',
  placeholder: 'A page ago I was sure that…',
  optional: true
}

// Part B ~ The Signature. Three surfacing prompts (Loop 9, V5 self-compression,
// the Kolmogorov residue). Warm, first-person, low pressure.
export const SIGNATURE_PROMPTS = {
  title: 'Now ~ the part that’s yours',
  subtitle: 'Short answers are perfect. Say it plainly.',
  social: {
    label: 'What people see',
    prompt:
      'What do people keep coming to you for ~ or keep saying about you ~ that you tend to wave off?',
    placeholder: 'They always say…'
  },
  // self-compression catch ~ two small fields
  labelWord: {
    label: 'In one word',
    prompt: 'If you had to label yourself here in one word, what is it?',
    placeholder: 'one word'
  },
  labelLeavesOut: {
    label: 'And what it misses',
    prompt: 'Now ~ name one real thing that word leaves out.',
    placeholder: 'What it doesn’t catch is…'
  },
  residue: {
    label: 'The residue',
    // {lens} -> lensPhrase()
    prompt: 'If AI did every task in {lens} tomorrow ~ what’s the part that would still need you?',
    placeholder: 'The part that’s still mine is…'
  }
}

// ── Loading / the fog ────────────────────────────────────────────────────────
export const FOGGING = {
  // shown in sequence while the reflection generates ~ the mirror clearing
  lines: [
    'The glass is fogging…',
    'Letting your answers settle…',
    'Looking for what’s yours…',
    'The mirror is clearing…'
  ]
}

// ── Result framing (the model fills the body; these are the fixed frames) ─────
export const RESULT = {
  // soft optional bridge to paid ~ secondary, skippable, never gates the result
  bridge:
    'This gap is what the 10-week Futureproof Me cohort is built to close.',
  bridgeLink: {
    label: 'See how the cohort works',
    // The Futureproof challenge landing page lives at /cohort (built separately).
    href: '/cohort'
  },
  // the boundary line is REQUIRED in the output (canon Step 10.8). The model
  // is also asked to voice this; this is the guaranteed fallback.
  boundaryFallback:
    'This is orientation ~ a mirror at one moment, not a verdict on you.',
  moreThanThisFallback:
    'And you are more than any reflection can hold. This caught a glimpse, not the whole of you.',
  shareButton: 'Make a keepsake to share',
  startOverButton: 'Try another lens'
}

// ── Share card ───────────────────────────────────────────────────────────────
// ⚑ REVIEW ITEM 4 ~ Share card design. Copy + structure here; visuals in ShareCard.jsx.
export const CARD = {
  watermarkTop: 'from The Mirror',
  // the signature line (from the model) is the hero. These frame it.
  prelude: 'What AI can’t replace in me',
  footerBrand: 'Chiibitsu Labs',
  footerEthos: 'more human, by design',
  downloadButton: 'Download my keepsake',
  // tiny whimsical line that rotates ~ a little surprise
  sparkles: [
    'kept, not scored.',
    'a glimpse, not a verdict.',
    'more human, by design.',
    'yours to keep.'
  ]
}

// ── Opt-in (one optional ask, after the gift is delivered) ────────────────────
export const OPTIN = {
  title: 'Want to keep this?',
  subtitle:
    'I can email your reflection to you ~ and, if you like, the challenge details.\nNo list-stuffing. You can leave this blank and the gift is still yours.',
  emailLabel: 'Your email',
  emailPlaceholder: 'you@somewhere.lovely',
  interests: [
    { id: 'cohort', label: 'The 10-week Futureproof Me cohort' },
    { id: 'tips', label: 'Occasional free tips on futureproofing' },
    { id: 'result', label: 'Just email me my reflection' }
  ],
  submitButton: 'Send it to me',
  skipButton: 'No thanks ~ I’ll keep it here',
  thanks: 'Sent with care. Check your inbox in a moment. \u{1F49C}',
  thanksNoEmail: 'All good ~ the gift is yours either way.'
}

// ── Warm close ────────────────────────────────────────────────────────────────
export const CLOSE = {
  lines: [
    'Thank you for sitting with this.',
    'Whatever the mirror showed ~ you’re the one who gets to act on it.',
    'Happy to have made you something.'
  ],
  signoff: 'with care, Chiibitsu Labs',
  ethos: 'more human, by design'
}
