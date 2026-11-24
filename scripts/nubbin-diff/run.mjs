// Runs the whole comparison headlessly: builds the pages, serves them,
// opens the diff page and the context snapshots in Chromium, and writes
// ./report.
//   npm run nubbin-diff
// Needs a Chromium for Playwright (`npx playwright install chromium`), or
// set CHROMIUM_PATH to one. Without either, run serve.mjs and open the
// printed URL in any Chromium-based browser: the pages do the work.
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import { writeReport } from './report.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const port = 4179;
const base = `http://localhost:${port}/scripts/nubbin-diff/out`;

execFileSync(process.execPath, [join(here, 'build.mjs')], { stdio: 'inherit' });
const server = await serve(port);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 860 } });
  await page.goto(`${base}/diff.html`);
  await page.waitForFunction(() => window.__nubbinDiff, null, { timeout: 120000 });
  const results = await page.evaluate(() => window.__nubbinDiff);
  if (results.error) throw new Error(results.error);
  for (const view of ['popups', 'static']) {
    for (const theme of ['light', 'dark']) {
      await page.goto(`${base}/context.html?view=${view}&theme=${theme}&capture`);
      await page.waitForFunction(() => window.__captured, null, { timeout: 30000 });
    }
  }
  writeReport();
  for (const r of results) {
    console.log(`${r.id.padEnd(36)} ${r.theme.padEnd(5)} ${r.scale}x  mismatch ${r.mismatch.toFixed(2)}%  shape ${r.shifted.toFixed(2)}%`);
  }
} finally {
  await browser.close();
  server.close();
}
