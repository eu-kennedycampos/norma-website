#!/usr/bin/env node
/**
 * Gera as imagens estáticas do site a partir de HTML, com o Chromium em modo headless:
 *   - public/og/{default,ponto,assinatura}.png  (1200×630, compartilhamento e anúncios)
 *   - public/apple-touch-icon.png, public/icon-192.png, public/icon-512.png
 *   - public/favicon.ico                        (precisa do ImageMagick)
 *
 * Uso: pnpm images   (CHROMIUM=/caminho/do/binário para outro navegador)
 * As imagens geradas são versionadas; rode de novo só quando a marca ou os títulos mudarem.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const chromium = process.env.CHROMIUM ?? 'chromium';
const fontUrl = (path) => pathToFileURL(join(root, 'node_modules', path)).href;

const FONTS = `
  @font-face { font-family: 'Archivo'; font-weight: 100 900; font-stretch: 62% 125%;
    src: url('${fontUrl('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'Archivo'; font-weight: 100 900; font-stretch: 62% 125%;
    src: url('${fontUrl('@fontsource-variable/archivo/files/archivo-latin-ext-wdth-normal.woff2')}') format('woff2');
    unicode-range: U+0100-02BA; }
  @font-face { font-family: 'Martian Mono'; font-weight: 100 800;
    src: url('${fontUrl('@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2')}') format('woff2'); }
`;

const MARK = (dot = '#f2c200', bar = '#f3f3ef') => `
  <svg viewBox="10 28 80 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="28" width="80" height="16" fill="${bar}"/>
    <rect x="74" y="28" width="16" height="48" fill="${bar}"/>
    <rect x="54" y="48" width="16" height="16" fill="${dot}"/>
  </svg>`;

const RULER = Array.from({ length: 12 }, (_, i) => (i + 1) * 10)
  .map((n) => `<span style="color:${n % 50 === 0 ? '#d9381e' : '#111110'}">${n}</span>`)
  .join('');

/** Cartão de compartilhamento: logo, título grande, esquadro e a régua no pé. */
function ogHtml({ product, dot, eyebrow, title }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${FONTS}
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; overflow: hidden; background: #111110; color: #f3f3ef;
      font-family: 'Archivo', sans-serif; display: flex; flex-direction: column; }
    .main { flex: 1; display: grid; grid-template-columns: 1fr 300px; gap: 40px; padding: 64px 72px 40px; }
    .copy { display: flex; flex-direction: column; justify-content: space-between; }
    .logo { display: flex; align-items: center; gap: 14px; font-size: 40px; font-weight: 800;
      font-stretch: 112%; letter-spacing: -0.03em; }
    .logo svg { width: 62px; height: 37px; margin-top: 9px; }
    .logo b { font-weight: 400; }
    .eyebrow { font-family: 'Martian Mono', monospace; font-size: 18px; letter-spacing: 0.14em;
      text-transform: uppercase; color: #8c8c86; margin-bottom: 22px; }
    h1 { font-size: 76px; line-height: 0.98; font-weight: 800; letter-spacing: -0.035em; }
    h1 em { font-style: normal; color: #f2c200; font-stretch: 125%; }
    .mark { align-self: end; }
    .mark svg { width: 300px; height: 180px; }
    .ruler { height: 64px; background: #f2c200; display: flex;
      background-image: repeating-linear-gradient(90deg, #111110 0 2px, transparent 2px 100px),
        repeating-linear-gradient(90deg, #111110 0 1px, transparent 1px 50px),
        repeating-linear-gradient(90deg, #111110 0 1px, transparent 1px 10px);
      background-size: 100% 26px, 100% 17px, 100% 10px; background-repeat: no-repeat; }
    .ruler span { flex: 0 0 100px; padding: 32px 0 0 7px; font-family: 'Martian Mono', monospace;
      font-size: 17px; font-weight: 700; }
  </style></head><body>
    <div class="main">
      <div class="copy">
        <div class="logo">${MARK(dot)}<span>norma${product ? ` <b>${product}</b>` : ''}</span></div>
        <div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1></div>
      </div>
      <div class="mark">${MARK(dot)}</div>
    </div>
    <div class="ruler">${RULER}</div>
  </body></html>`;
}

/** Ícone quadrado: o esquadro centrado no grafite, dentro da área segura de ícone "maskable". */
function iconHtml(size) {
  const markWidth = Math.round(size * 0.56);
  return `<!doctype html><html><head><style>
    * { margin: 0; } body { width: ${size}px; height: ${size}px; background: #111110;
      display: grid; place-items: center; }
    svg { width: ${markWidth}px; height: ${Math.round((markWidth * 48) / 80)}px; }
  </style></head><body>${MARK()}</body></html>`;
}

const work = mkdtempSync(join(tmpdir(), 'norma-imagens-'));

function render(html, out, width, height) {
  const file = join(work, `${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(file, html);
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(
    chromium,
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--virtual-time-budget=4000',
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      pathToFileURL(file).href,
    ],
    { stdio: 'ignore' },
  );
  console.log(`  ${out.replace(`${root}/`, '')}`);
}

try {
  console.log('Gerando imagens…');
  const og = [
    {
      name: 'default',
      eyebrow: 'Sistemas sob medida',
      title: 'Software com o <em>formato</em> da sua empresa.',
    },
    {
      name: 'ponto',
      product: 'ponto',
      eyebrow: 'Ponto eletrônico REP-P',
      title: 'O ponto que marca, fecha e <em>assina</em>.',
    },
    {
      name: 'assinatura',
      product: 'assinatura',
      dot: '#d9381e',
      eyebrow: 'Assinatura eletrônica',
      title: 'Contrato assinado por onde o cliente <em>já está</em>.',
    },
  ];
  for (const card of og) render(ogHtml(card), join(pub, 'og', `${card.name}.png`), 1200, 630);

  render(iconHtml(180), join(pub, 'apple-touch-icon.png'), 180, 180);
  render(iconHtml(192), join(pub, 'icon-192.png'), 192, 192);
  render(iconHtml(512), join(pub, 'icon-512.png'), 512, 512);

  const ico32 = join(work, 'ico-32.png');
  const ico48 = join(work, 'ico-48.png');
  render(iconHtml(32), ico32, 32, 32);
  render(iconHtml(48), ico48, 48, 48);
  try {
    execFileSync('magick', [ico32, ico48, join(pub, 'favicon.ico')]);
    console.log('  public/favicon.ico');
  } catch {
    console.warn('  ImageMagick não encontrado: favicon.ico não foi gerado.');
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
