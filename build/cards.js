// Renders the still pictures of the profile (project tiles, section titles, contact card, link pills)
// from HTML, with the portfolio's fonts and colours. Run from the repository root:  node build/cards.js
// Needs Playwright with Chromium and the fonts in build/fonts/.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const B = (f) => 'file://' + path.join(ROOT, 'build', f);
const portrait = fs.readFileSync(path.join(ROOT, 'build/portrait.svg'), 'utf8');

const C = { lav: '#AA80FF', lavDeep: '#6D3FE0', cream: '#FFF5EE', ink: '#141418', night: '#25242E', muted: '#55535E' };
const THEMES = {
  light: { fg: C.ink, muted: C.muted, accent: '#9566FF', hand: C.lavDeep, pill: C.ink, pillInk: C.cream },
  dark: { fg: C.cream, muted: '#B9B5C6', accent: C.lav, hand: '#C4A6FF', pill: C.cream, pillInk: C.ink },
};

const base = `
@font-face { font-family: Bagel; src: url(${B('fonts/BagelFatOne-Regular.ttf')}); }
@font-face { font-family: Gaegu; font-weight: 700; src: url(${B('fonts/Gaegu-Bold.ttf')}); }
@font-face { font-family: Inter; font-weight: 100 900; src: url(${B('fonts/Inter.ttf')}); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: transparent; }
body { font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; }
.display { font-family: Bagel; font-weight: 400; letter-spacing: -0.01em; line-height: 0.95; }
.hand { font-family: Gaegu; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.1; }
#c { display: inline-block; }
`;

const arrowSvg = (extra = '') => `<svg class="arrow" ${extra} viewBox="0 0 90 70" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12c22-10 44-4 40 14-3 13-19 10-14-1 6-12 28-9 37 6 6 10 8 20 8 30"/><path d="M68 50l9 12 8-12"/></svg>`;
const goSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M8 6h10v10"/></svg>`;

// Two rows of the bento: wide + narrow, narrow + wide, then three narrow. Same height everywhere.
const TILE_H = 480, NARROW = 400, WIDE = 812;
const work = [
  { id: 'outsoon', title: 'Outsoon', meta: 'UI/UX Design · 11.2024', color: '#25242e', ink: '#fff5ee', note: 'Su App Store!', w: WIDE },
  { id: 'demons', title: 'Demons', meta: 'App iOS · 11.2026', color: '#7b3cf0', ink: '#ffffff', note: 'fatto con Claude Code', w: NARROW },
  { id: 'taca', title: 'TACA', meta: 'App iOS · 11.2026', color: '#ffe45c', ink: '#25242e', note: 'fatto con Claude Code', w: NARROW, pos: 'center 0%' },
  { id: 'gododeck', title: 'Gododeck', meta: 'Illustration · 02.2025', color: '#0b7db0', ink: '#ffffff', w: WIDE },
  { id: 'accirete', title: 'Accìrete', meta: 'Graphic Design · 07.2024', color: '#c9352a', ink: '#fff5ee', w: NARROW },
  { id: 'pharos', title: 'Pharos', meta: 'UI/UX Design · 12.2024', color: '#d9e8ff', ink: '#25242e', w: NARROW, pos: 'right center' },
  { id: 'weitoyou', title: 'WeiToYou', meta: 'UI/UX Design · 03.2023', color: '#f4bfcf', ink: '#7a1530', w: NARROW },
];

const tile = (t) => `
<style>
  #c { width: ${t.w}px; height: ${TILE_H}px; position: relative; padding: 10px; border-radius: 28px;
       background: ${t.color}; color: ${t.ink}; display: flex; flex-direction: column; }
  .pic { flex: 1; min-height: 0; border-radius: 18px; overflow: hidden; }
  .pic img { width: 100%; height: 100%; object-fit: cover; object-position: ${t.pos || 'center'}; display: block; }
  .foot { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 14px; padding: 16px 70px 10px 14px; min-height: 84px; }
  .title { font-size: 46px; line-height: 1; }
  .meta { font-size: 21px; font-weight: 600; }
  .go { position: absolute; right: 18px; bottom: 18px; width: 52px; height: 52px; border-radius: 50%;
        background: ${t.ink}; color: ${t.color}; display: grid; place-items: center; }
  .go svg { width: 24px; }
  .note { position: absolute; top: 24px; right: 22px; background: #fff; color: ${C.ink}; padding: 6px 12px 5px;
          border-radius: 10px; font-size: 23px; rotate: -4deg; box-shadow: 0 2px 0 rgba(0,0,0,.18); }
</style>
<div id="c">
  <div class="pic"><img src="${B(t.id + '.webp')}"></div>
  <div class="foot"><span class="title display">${t.title}</span><span class="meta">${t.meta}</span></div>
  <span class="go">${goSvg}</span>
  ${t.note ? `<span class="note hand">${t.note}</span>` : ''}
</div>`;

const workHead = (th) => `
<style>
  #c { width: 1280px; padding: 8px 4px 28px; color: ${th.fg}; display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 24px; }
  h2 { font-size: 68px; width: 740px; }
  h2 span { color: ${th.accent}; }
  .note { font-size: 24px; color: ${th.muted}; text-align: right; white-space: nowrap; padding-bottom: 6px; }
  /* Gaegu has no È: an E with a short stroke drawn over it as the accent. */
  .egrave { position: relative; }
  .egrave::after { content: ''; position: absolute; left: 0.16em; top: -0.2em; width: 0.32em; height: 0.11em; border-radius: 1em; background: currentColor; rotate: 32deg; }
</style>
<div id="c">
  <h2 class="display">Ecco <span>sette</span> progetti che raccontano come lavoro</h2>
  <p class="note hand">Spoiler: nessuno <span class="egrave">E</span> perfetto,<br>ma tutti mi hanno lasciato qualcosa.</p>
</div>`;

const aboutHead = (th) => `
<style>
  #c { width: 1280px; padding: 8px 4px 20px; color: ${th.fg}; display: flex; align-items: center; gap: 44px; }
  .frame { width: 230px; height: 230px; flex: none; border-radius: 50%; background: #fff; padding: 22px; color: ${C.ink}; }
  .frame svg { width: 100%; height: 100%; }
  h2 { font-size: 104px; }
  .quote { font-size: 30px; color: ${th.hand}; margin-top: 16px; }
</style>
<div id="c">
  <div class="frame">${portrait}</div>
  <div><h2 class="display">Io sono Angelo</h2><p class="quote hand">Do or do not. There is no try.</p></div>
</div>`;

const contact = () => `
<style>
  #c { width: 1280px; border-radius: 28px; background: ${C.lav}; color: ${C.ink}; padding: 72px 40px 30px; text-align: center; }
  h2 { font-size: 132px; line-height: 0.9; }
  .way { font-size: 30px; text-align: right; margin: 12px 120px 0 0; }
  ul { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 44px; }
  li { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 26px; }
  .arrow { width: 72px; rotate: 18deg; }
  .flip { transform: scaleX(-1); rotate: -18deg; }
</style>
<div id="c">
  <h2 class="display">End of transmission.</h2>
  <p class="way hand">This is the way</p>
  <ul>
    <li><p class="hand">Scrivimi qui</p>${arrowSvg()}</li>
    <li><p class="hand">Qui per collegarti con me</p>${arrowSvg('class="arrow flip"')}</li>
    <li><p class="hand">Qui altre cose molto carine</p>${arrowSvg()}</li>
  </ul>
</div>`;

const pill = (label, th) => `
<style>
  #c { width: 400px; height: 92px; display: grid; place-items: center; }
  a { display: inline-flex; align-items: center; gap: 12px; height: 60px; padding: 0 32px; border-radius: 999px;
      background: ${th.pill}; color: ${th.pillInk}; font-weight: 600; font-size: 21px; }
  a svg { width: 18px; }
</style>
<div id="c"><a>${label}${goSvg}</a></div>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1400, height: 900 } });
  const shoot = async (html, out) => {
    // Loaded from a file so the page may read the fonts and covers next to it.
    const tmp = path.join(ROOT, 'build', '.render.html');
    fs.writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${base}</style>${html}`);
    await page.goto('file://' + tmp, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#c').screenshot({ path: path.join(ROOT, 'assets', out), omitBackground: true });
    console.log('assets/' + out);
  };
  for (const t of work) await shoot(tile(t), `work/${t.id}.png`);
  for (const [name, th] of Object.entries(THEMES)) {
    await shoot(workHead(th), `head-work-${name}.png`);
    await shoot(aboutHead(th), `head-about-${name}.png`);
    for (const [id, label] of [['email', 'Email'], ['linkedin', 'LinkedIn'], ['behance', 'Behance']]) {
      await shoot(pill(label, th), `link-${id}-${name}.png`);
    }
  }
  await shoot(contact(), 'contact.png');
  fs.rmSync(path.join(ROOT, 'build', '.render.html'));
  await browser.close();
})();
