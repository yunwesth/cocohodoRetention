import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('docs/preview', { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1040 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `docs/preview/${name}.png` });
    await page.screenshot({ path: `docs/preview/${name}-full.png`, fullPage: true });
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`${name}: captured, no browser runtime errors`);
    await page.close();
  }
} finally {
  await browser.close();
}
