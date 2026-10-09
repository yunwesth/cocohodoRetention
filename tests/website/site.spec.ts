import { expect, test } from '@playwright/test';

test('all public pages render without overflow or broken local images', async ({ page }) => {
  for (const path of ['/', '/menu/', '/order/', '/rewards/', '/contact/', '/privacy/', '/rewards/terms/']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('a[href*="square"]')).toHaveCount(0);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  }
});

test('menu search finds products and recovers from an empty result', async ({ page }) => {
  await page.goto('/menu/');
  await page.getByRole('searchbox', { name: 'Search the menu' }).fill('mango');
  await expect(page.getByRole('heading', { name: 'Mango smoothie', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Americano', exact: true })).toHaveCount(0);
  await page.getByRole('searchbox').fill('nothing-matches-123');
  await expect(page.getByRole('heading', { name: 'No treats found just yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show the full menu' }).click();
  await expect(page.getByRole('heading', { name: 'Americano', exact: true })).toBeVisible();
});

test('website opens rewards and QR then returns to the website', async ({ page }) => {
  await page.goto('/rewards/');
  await page.getByRole('link', { name: 'Preview my rewards' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByText('PREVIEW', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'My QR', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Your COCOHODO member QR code' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('img', { name: 'Your COCOHODO member QR code' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to rewards' }).click();
  await page.getByRole('link', { name: 'Back to Cocohodo', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3001/');
});

test('ordering and contact links target the correct services', async ({ page }) => {
  await page.goto('/order/');
  const providers = page.locator('a.provider');
  await expect(providers).toHaveCount(2);
  await expect(providers.nth(0)).toHaveAttribute('href', 'https://www.doordash.com/store/cocohodo-closter-623514/');
  await expect(providers.nth(1)).toHaveAttribute('href', 'https://www.ubereats.com/store/cocohodo-closter/PJsu-e91RoWihoPZwbhiXw');
  await page.goto('/contact/');
  await expect(page.getByRole('link', { name: 'Get directions' })).toHaveAttribute('href', /255%20Closter%20Dock%20Road/);
  await expect(page.locator('main a[href="tel:+12017672626"]')).toHaveCount(2);
});

test('navigation is accessible and preview pages are not indexable', async ({ page, request }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Menu', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/menu\/$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  const missing = await request.get('/page-that-does-not-exist/');
  expect(missing.status()).toBe(404);
  const oldPrivacy = await request.get('/privacy-policy/', { maxRedirects: 0 });
  expect([307, 308]).toContain(oldPrivacy.status());
});
