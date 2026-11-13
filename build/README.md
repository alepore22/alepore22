# Come rigenerare le immagini

Le immagini in `assets/` sono fatte con i colori e i font del portfolio (`alepore22.github.io`).

1. Scarica i font in `build/fonts/` (non sono nel repository):
   - `BagelFatOne-Regular.ttf` e `Gaegu-Bold.ttf` da Google Fonts
   - `Inter.ttf`: il file variabile di Inter (Google Fonts, `Inter[opsz,wght].ttf`, rinominato)
2. Hero animato (`assets/hero.svg`, font incorporati):

   ```bash
   pip install fonttools brotli && python3 build/hero.py
   ```

3. Tile dei progetti, titoli, contatti e pulsanti (PNG a 2x, versioni chiara e scura):

   ```bash
   node build/cards.js
   ```

   Serve Playwright con Chromium. Testi e colori dei progetti sono in cima a `cards.js`;
   le copertine sono le `.webp` in `build/`, copiate da `src/assets/covers/` del portfolio.
