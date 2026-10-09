import { expect, test } from '@playwright/test';

test('customer preview shows rewards, usable QR, and activity without overflowing', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('PREVIEW', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Every sip gets you closer.' })).toBeVisible();
  await expect(page.getByLabel('7 out of 10 stamps')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Your COCOHODO member QR code' })).toHaveCount(0);
  await page.getByRole('link', { name: 'My QR', exact: true }).click();
  await expect(page).toHaveURL(/\/qr$/);
  await expect(page.getByRole('img', { name: 'Your COCOHODO member QR code' })).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.reload();
  await expect(page.getByRole('img', { name: 'Your COCOHODO member QR code' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to rewards' }).click();
  await expect(page.getByRole('heading', { name: 'A little history' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('preview cannot send real SMS or pretend to sign in', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByLabel('Phone number').fill('2015550123');
  await expect(page.getByRole('button', { name: 'Send me a code' })).toBeDisabled();
  await expect(page.getByText('Online sign-in is not available yet.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('cashier preview shows manual entry and blocks unconnected actions', async ({ page }) => {
  await page.goto('/cashier');
  await expect(page.getByRole('heading', { name: 'Make their day.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open scanner' })).toBeDisabled();
  await page.getByLabel('Member code', { exact: true }).fill('ABCDEF0123456789ABCDEF0123456789');
  await expect(page.getByRole('button', { name: 'Find member', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('staff login and home-screen manifest are available', async ({ page, request }) => {
  await page.goto('/cashier/login');
  await expect(page.getByRole('heading', { name: 'Staff sign in', exact: true })).toBeVisible();
  await expect(page.getByLabel('Shop email')).toBeVisible();
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  const data = await manifest.json();
  expect(data.name).toBe('COCOHODO Rewards');
  expect(data.display).toBe('standalone');
});
