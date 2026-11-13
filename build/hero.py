"""Builds assets/hero.svg: the portfolio hero, animated, with the fonts embedded.

Run from the repository root:  python3 build/hero.py
Needs fonttools and brotli (pip install fonttools brotli) and the fonts in build/fonts/.
"""
import base64
import io
import re
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'build' / 'fonts'

LAV, CREAM, INK = '#AA80FF', '#FFF5EE', '#141418'
W, H, BAND = 1280, 680, 76

TICKER = ['UI/UX design', 'Illustrazione', 'Grafica', 'App iOS', 'Napoli']
LEAD = [
    [('Sono ', 400), ('Angelo Lepore', 700), (', UI/UX designer e illustratore a Napoli.', 400)],
    [('Disegno per rendere le cose più chiare, più umane e,', 400)],
    [('quando va bene, un po’ più felici.', 400)],
]
NOTE = 'THIS IS WHERE FUN BEGINS'


def embed(file, text, family, weight='400'):
    """Subset a font to the characters used and return an @font-face rule."""
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    font = TTFont(FONTS / file)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buf)
    data = base64.b64encode(buf.getvalue()).decode()
    return f"@font-face{{font-family:'{family}';font-weight:{weight};src:url(data:font/woff2;base64,{data}) format('woff2')}}"


def advance(file, text, size):
    """Width of a line of text in pixels, from the font's advance widths."""
    font = TTFont(FONTS / file)
    cmap, hmtx = font.getBestCmap(), font['hmtx']
    upm = font['head'].unitsPerEm
    return sum(hmtx[cmap[ord(c)]][0] for c in text) * size / upm


# The ticker: one run of words and stars, drawn twice so it can loop without a seam.
T_SIZE, T_GAP, STAR = 30, 30, 18
STAR_PATH = 'M12 0c1 7 4 10 12 12-8 2-11 5-12 12-1-7-4-10-12-12 8-2 11-5 12-12z'
items, x = [], 0.0
for word in TICKER * 3:
    items.append(f'<text x="{x:.1f}" y="0" class="t">{word}</text>')
    x += advance('BagelFatOne-Regular.ttf', word, T_SIZE) + T_GAP
    items.append(f'<path d="{STAR_PATH}" transform="translate({x:.1f} -21) scale({STAR / 24})" fill="{LAV}"/>')
    x += STAR + T_GAP
RUN = x

portrait = (ROOT / 'build' / 'portrait.svg').read_text()
portrait_body = re.sub(r'^<svg[^>]*>|</svg>$', '', portrait.strip())
portrait_body = re.sub(r'<title[^>]*>.*?</title>', '', portrait_body)

lead_text = ''.join(t for line in LEAD for t, _ in line)
css = '\n'.join([
    embed('BagelFatOne-Regular.ttf', 'Hello There!Angolo' + ''.join(TICKER), 'Bagel'),
    embed('Gaegu-Bold.ttf', NOTE, 'Gaegu', '700'),
    embed('Inter.ttf', lead_text, 'Inter', '100 900'),
])

lead = []
for i, line in enumerate(LEAD):
    spans = ''.join(f'<tspan font-weight="{w}">{t}</tspan>' for t, w in line)
    lead.append(f'<text x="58" y="{486 + i * 36}" class="lead">{spans}</text>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="t d">
<title id="t">Hello There! Angelo Lepore, UI/UX designer e illustratore a Napoli</title>
<desc id="d">Sono Angelo Lepore, UI/UX designer e illustratore a Napoli. Disegno per rendere le cose più chiare, più umane e, quando va bene, un po’ più felici.</desc>
<style>
{css}
.d {{ font-family: Bagel, 'Arial Rounded MT Bold', sans-serif; fill: {INK}; letter-spacing: -0.02em; }}
.h {{ font-family: Gaegu, 'Comic Sans MS', cursive; font-weight: 700; fill: {INK}; letter-spacing: 0.08em; }}
.lead {{ font-family: Inter, system-ui, sans-serif; font-size: 24px; fill: {INK}; }}
.t {{ font-family: Bagel, 'Arial Rounded MT Bold', sans-serif; font-size: {T_SIZE}px; fill: {CREAM}; }}
.run {{ animation: run 40s linear infinite; }}
@keyframes run {{ to {{ transform: translateX(-{RUN / 3:.1f}px); }} }}
.eye {{ transform-box: fill-box; transform-origin: center; animation: look 9s ease-in-out infinite; }}
@keyframes look {{
  0%, 12% {{ transform: translate(0, 0); }}
  18%, 32% {{ transform: translate(-30px, 6px); }}
  38%, 39% {{ transform: translate(0, 0); }}
  40% {{ transform: translate(0, 0) scaleY(0.12); }}
  41.5%, 50% {{ transform: translate(0, 0); }}
  56%, 70% {{ transform: translate(28px, -14px); }}
  76%, 100% {{ transform: translate(0, 0); }}
}}
.smile {{ transform-box: fill-box; transform-origin: center; animation: wink 4.5s ease-in-out infinite; }}
@keyframes wink {{ 0%, 80%, 100% {{ transform: rotate(0); }} 86% {{ transform: rotate(-16deg); }} 92% {{ transform: rotate(10deg); }} }}
@media (prefers-reduced-motion: reduce) {{ .run, .eye, .smile {{ animation: none; }} }}
</style>
<defs><clipPath id="card"><rect width="{W}" height="{H}" rx="28"/></clipPath></defs>
<g clip-path="url(#card)">
  <rect width="{W}" height="{H}" fill="{LAV}"/>

  <text x="58" y="62" class="d" font-size="30">Angolo</text>

  <text x="50" y="246" class="d" font-size="176">Hello</text>
  <text x="50" y="398" class="d" font-size="176">There!</text>
  <text x="588" y="436" class="h" font-size="25" text-anchor="end">{NOTE}</text>
  <g transform="translate(596 414)"><g class="smile" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linecap="round">
    <circle cx="13" cy="13" r="11"/><path d="M8 15c2.5 3.4 7.5 3.4 10 0M9.5 10h.1M16.5 10h.1"/>
  </g></g>
  {''.join(lead)}

  <svg x="700" y="40" width="530" height="{H - BAND - 40}" viewBox="185 143 1694 1796" preserveAspectRatio="xMidYMax meet" fill="{INK}" color="{INK}">{portrait_body}</svg>

  <g transform="translate(0 {H - BAND})">
    <rect width="{W}" height="{BAND}" fill="{INK}"/>
    <g transform="translate(0 {BAND / 2 + 11})"><g class="run">{''.join(items)}</g></g>
  </g>
</g>
</svg>
'''
(ROOT / 'assets' / 'hero.svg').write_text(svg)
print(f'assets/hero.svg {len(svg) / 1024:.0f} KB, ticker run {RUN:.0f}px')
