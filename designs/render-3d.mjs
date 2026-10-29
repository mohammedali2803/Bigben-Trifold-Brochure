// Renders the 3D / procedural assets used by the photo-print collection.
// Usage: node render-3d.mjs [scene ...]   (default: all)
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, openBrowser } from './lib/render.mjs';

const SCENES = ['play', 'future', 'dice', 'rocket', 'shapes', 'planet', 'nebula'];
const SIZE = 2000;
const out = path.join(ROOT, 'output', 'assets', '3d');
mkdirSync(out, { recursive: true });

const wanted = process.argv.slice(2);
const ctx = await openBrowser();
try {
  for (const scene of SCENES.filter((s) => !wanted.length || wanted.includes(s))) {
    const page = await ctx.page({ width: SIZE, height: SIZE });
    await page.goto(`${ctx.base}/3d/render.html?scene=${scene}&size=${SIZE}`);
    await page.waitForFunction(() => window.renderDone || window.renderError, null, { timeout: 300000 });
    const err = await page.evaluate(() => window.renderError);
    if (err) throw new Error(`${scene}: ${err}`);
    await page.locator('canvas').screenshot({ path: path.join(out, `${scene}.png`), omitBackground: true });
    await page.close();
    console.log(`rendered ${scene}`);
  }
} finally {
  await ctx.close();
}
