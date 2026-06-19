// Generator for the Futureproof OG image.
// Concept: the brand's dreamy night-violet universe, with a glowing sprig
// blooming into light ~ "grow the human signature, more human not less."
// Evergreen: no dates, times, or season specifics.
// Run from /cohort:  node scripts/make-og.mjs
import { Resvg } from '@resvg/resvg-js'
import wawoff2 from 'wawoff2'
import { readFile, writeFile } from 'node:fs/promises'

const F = 'node_modules/@fontsource/fraunces/files'
const ttf = async (w) => wawoff2.decompress(await readFile(`${F}/fraunces-latin-${w}.woff2`))
const fontBuffers = await Promise.all(
  ['600-normal', '500-normal', '400-normal', '500-italic', '400-italic'].map(ttf),
)

// one leaf, base at (0,0), tip up; reused along the stem and as petals
const leaf = (veinColor) => `
  <path d="M0 0 C -20 -16 -20 -44 0 -62 C 20 -44 20 -16 0 0 Z" />
  <path d="M0 -6 L0 -54" fill="none" stroke="${veinColor}" stroke-width="2" stroke-linecap="round" opacity="0.55"/>`

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#180a2b"/>
      <stop offset="52%" stop-color="#2c1450"/>
      <stop offset="100%" stop-color="#46228a"/>
    </linearGradient>
    <radialGradient id="auraR" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c4a8ff" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="#9a78f0" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#9a78f0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="petalG" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#fbefff"/>
      <stop offset="60%" stop-color="#e7ccff"/>
      <stop offset="100%" stop-color="#c8a6f4"/>
    </radialGradient>
    <linearGradient id="leafG" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#8a63e0"/>
      <stop offset="100%" stop-color="#d9c2ff"/>
    </linearGradient>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- dreamy depth: soft blurred light, not hard sparkles -->
  <circle cx="930" cy="300" r="240" fill="url(#auraR)"/>
  <g fill="#d9c2ff">
    <circle cx="250" cy="120" r="5" opacity="0.55" filter="url(#glow)"/>
    <circle cx="170" cy="430" r="4" opacity="0.5" filter="url(#glow)"/>
    <circle cx="1080" cy="520" r="6" opacity="0.5" filter="url(#glow)"/>
    <circle cx="1110" cy="150" r="4" opacity="0.45" filter="url(#glow)"/>
    <circle cx="760" cy="120" r="3.5" opacity="0.5" filter="url(#glow)"/>
  </g>

  <!-- the sprig: a commodity line handed off (dotted), blooming into something alive -->
  <g transform="translate(902 372)">
    <!-- glow halo behind the bloom -->
    <circle cx="6" cy="-208" r="120" fill="#c9a9ff" opacity="0.5" filter="url(#soft)"/>

    <!-- the straight, dotted 'machine' line fading in from the left, then the living stem -->
    <path d="M-300 86 L-30 86" fill="none" stroke="#b9a3ee" stroke-width="3"
          stroke-linecap="round" stroke-dasharray="2 16" opacity="0.6"/>
    <path d="M-30 86 C 30 78 8 30 6 -8 C 4 -70 26 -120 6 -196"
          fill="none" stroke="url(#leafG)" stroke-width="6" stroke-linecap="round"/>

    <!-- leaves along the stem -->
    <g fill="url(#leafG)">
      <g transform="translate(6 4) rotate(46) scale(0.95)">${leaf('#3a1d64')}</g>
      <g transform="translate(2 -70) rotate(-44) scale(0.85)">${leaf('#3a1d64')}</g>
      <g transform="translate(6 -120) rotate(40) scale(0.7)">${leaf('#3a1d64')}</g>
    </g>

    <!-- the bloom: petals opening to light -->
    <g transform="translate(6 -200)" fill="url(#petalG)">
      <g transform="rotate(0)   scale(0.62)">${leaf('#caa6f4')}</g>
      <g transform="rotate(72)  scale(0.62)">${leaf('#caa6f4')}</g>
      <g transform="rotate(144) scale(0.62)">${leaf('#caa6f4')}</g>
      <g transform="rotate(216) scale(0.62)">${leaf('#caa6f4')}</g>
      <g transform="rotate(288) scale(0.62)">${leaf('#caa6f4')}</g>
      <circle cx="0" cy="0" r="13" fill="#fff7ff"/>
      <circle cx="0" cy="0" r="22" fill="#fff7ff" opacity="0.5" filter="url(#glow)"/>
    </g>
  </g>

  <!-- words -->
  <text x="96" y="118" font-family="Fraunces" font-weight="500" font-size="24" letter-spacing="5" fill="#bda6ee">FUTUREPROOF&#160;ME&#160;&#160;&#183;&#160;&#160;CHIIBITSU&#160;LABS</text>

  <text x="92" y="312" font-family="Fraunces" font-weight="600" font-size="88" letter-spacing="-2" fill="#fbf4ff">Get more human,</text>
  <text x="92" y="404" font-family="Fraunces" font-style="italic" font-weight="500" font-size="88" letter-spacing="-1" fill="#e4c8ff">not less.</text>

  <text x="96" y="470" font-family="Fraunces" font-weight="400" font-size="31" fill="#cdbcf3">Futureproof the part of you AI can&#8217;t replace.</text>

  <text x="96" y="556" font-family="Fraunces" font-style="italic" font-weight="400" font-size="26" fill="#b69cf6">more human, by design</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontBuffers, defaultFontFamily: 'Fraunces', loadSystemFonts: false },
})
await writeFile('public/og.png', resvg.render().asPng())
console.log('wrote public/og.png')
