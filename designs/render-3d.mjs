// Renders the 3D / procedural assets used by the photo-print collection.
// Usage: node render-3d.mjs [scene ...]   (default: all)
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, openBrowser } from './lib/render.mjs';

const SCENES = ['play', 'future', 'nostress', 'jugaad', 'firetruck', 'duck', 'lolly', 'racecar', 'balloon', 'whale', 'yay', 'dice', 'rocket', 'shapes', 'planet', 'nebula'];
const SIZE = Number(process.env.SIZE ?? 2000);
const out = path.join(ROOT, 'output', 'assets', '3d');
mkdirSync(out, { recursive: true });

const wanted = process.argv.slice(2);
const ctx = await openBrowser();
try {
  // Plain names render fixed scenes; "outname:scene?k=v&k=v" renders a parametric scene.
  const jobs = wanted.length ? wanted : SCENES;
  for (const job of jobs) {
    const [outName, spec] = job.includes(':') ? job.split(/:(.*)/s) : [job, job];
    const [sceneName, query = ''] = spec.split('?');
    const scene = outName;
    const page = await ctx.page({ width: SIZE, height: SIZE });
    await page.goto(`${ctx.base}/3d/render.html?scene=${sceneName}&size=${SIZE}&${query}`);
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
