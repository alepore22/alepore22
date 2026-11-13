# Come rigenerare l'immagine

`assets/hero.svg` è fatto con i colori e i font del portfolio (`alepore22.github.io`).

1. Scarica i font in `build/fonts/` (non sono nel repository):
   - `BagelFatOne-Regular.ttf` e `Gaegu-Bold.ttf` da Google Fonts
   - `Inter.ttf`: il file variabile di Inter (Google Fonts, `Inter[opsz,wght].ttf`, rinominato)
2. Genera l'hero animato, con i font incorporati:

   ```bash
   pip install fonttools brotli && python3 build/hero.py
   ```
