// Rendering helpers: a tiny static server (so pages can load local fonts,
// three.js and generated assets) plus PNG export through Playwright.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.svg': 'image/svg+xml',
};

export async function startServer() {
  const server = http.createServer(async (req, res) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

export async function openBrowser() {
  const { server, base } = await startServer();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  return {
    base,
    browser,
    async page(viewport, scale = 1) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: scale });
      page.on('pageerror', (e) => console.error('page error:', e.message));
      return page;
    },
    async close() {
      await browser.close();
      server.close();
    },
  };
}

const PAGE_HEAD = (base) => `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="${base}/fonts/fonts.css">
  <style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style></head><body>`;

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
}

// Renders an SVG artboard (w x h user units) to a transparent PNG `pxWidth` wide.
export async function svgToPng(ctx, { w, h, body, defs = '' }, out, pxWidth = 3000) {
  const cssW = 1000;
  const cssH = Math.round((cssW * h) / w);
  const page = await ctx.page({ width: cssW, height: cssH }, pxWidth / cssW);
  await page.goto(`${ctx.base}/lib/blank.html`);
  await page.setContent(`${PAGE_HEAD(ctx.base)}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${cssW}" height="${cssH}">
    <defs>${defs}</defs>${body}</svg></body></html>`);
  await settle(page);
  await page.screenshot({ path: out, omitBackground: true });
  await page.close();
}

// Renders arbitrary HTML (e.g. a catalogue sheet) to PNG.
export async function htmlToPng(ctx, html, out, { width, height, scale = 2 }) {
  const page = await ctx.page({ width, height }, scale);
  await page.goto(`${ctx.base}/lib/blank.html`);
  await page.setContent(`${PAGE_HEAD(ctx.base)}${html}</body></html>`);
  await settle(page);
  await page.screenshot({ path: out });
  await page.close();
}
