// One-off generator for the Futureproof OG image.
// Renders a refined, editorial OG (real Fraunces) to a 1200x630 PNG.
// Run from /cohort:  node scripts/make-og.mjs
import { Resvg } from '@resvg/resvg-js'
import wawoff2 from 'wawoff2'
import { readFile, writeFile } from 'node:fs/promises'

const F = 'node_modules/@fontsource/fraunces/files'
const ttf = async (w) => wawoff2.decompress(await readFile(`${F}/fraunces-latin-${w}.woff2`))

// Real Fraunces faces for resvg to match against.
const fontBuffers = await Promise.all([
  ttf('600-normal'),
  ttf('500-normal'),
  ttf('400-normal'),
  ttf('500-italic'),
  ttf('400-italic'),
])

const C = {
  cream: '#fbf8f3',
  ink: '#2c2342',
  plum: '#6d3bd1',
  plumDeep: '#4a2585',
  lav: '#e7dcff',
  lavLine: '#dccdf6',
  muted: '#8a7fa6',
}

// Editorial, left-aligned, no emoji / handwriting / sparkles.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="wash" cx="78%" cy="14%" r="80%">
      <stop offset="0%" stop-color="${C.lav}" stop-opacity="0.9"/>
      <stop offset="55%" stop-color="${C.cream}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${C.plum}"/>
      <stop offset="100%" stop-color="${C.plum}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${C.cream}"/>
  <rect width="1200" height="630" fill="url(#wash)"/>

  <!-- soft depth, not candy: one quiet lavender bloom bleeding off-frame -->
  <circle cx="1140" cy="70" r="300" fill="${C.lav}" opacity="0.45"/>

  <!-- stationery hairline frame: handcrafted, but grown-up -->
  <rect x="48" y="48" width="1104" height="534" rx="10" fill="none" stroke="${C.lavLine}" stroke-width="2"/>

  <!-- wordmarks -->
  <text x="96" y="118" font-family="Fraunces" font-weight="500" font-size="25" letter-spacing="7" fill="${C.plum}">CHIIBITSU&#160;&#160;LABS</text>
  <text x="1104" y="118" text-anchor="end" font-family="Fraunces" font-weight="400" font-size="22" letter-spacing="5" fill="${C.muted}">FOUNDING&#160;&#160;COHORT</text>

  <!-- headline -->
  <text x="94" y="294" font-family="Fraunces" font-weight="600" font-size="82" letter-spacing="-1.5" fill="${C.ink}">Futureproof one part</text>
  <text x="94" y="384" font-family="Fraunces" font-weight="600" font-size="82" letter-spacing="-1.5" fill="${C.ink}">of your life.</text>

  <!-- subhead, italic -->
  <text x="96" y="452" font-family="Fraunces" font-style="italic" font-weight="500" font-size="42" fill="${C.plum}">By getting more human, not less.</text>

  <!-- divider -->
  <rect x="96" y="496" width="440" height="3" rx="1.5" fill="url(#rule)"/>

  <!-- footer row -->
  <text x="96" y="544" font-family="Fraunces" font-weight="400" font-size="26" fill="${C.ink}">A 10-week cohort &#183; Mondays 8PM &#183; starts July 6</text>
  <text x="1104" y="544" text-anchor="end" font-family="Fraunces" font-style="italic" font-weight="400" font-size="26" fill="${C.plumDeep}">more human, by design</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontBuffers, defaultFontFamily: 'Fraunces', loadSystemFonts: false },
  background: C.cream,
})
await writeFile('public/og.png', resvg.render().asPng())
console.log('wrote public/og.png')
