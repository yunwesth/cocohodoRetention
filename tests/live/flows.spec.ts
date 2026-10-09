import { expect, test, type Page } from '@playwright/test';
import type { MemberCard } from '../../lib/loyalty';

const code = 'ABCDEF0123456789ABCDEF0123456789';
const user = { id: 'a7f60dab-fc32-4147-a39e-43e3e969f830', aud: 'authenticated', role: 'authenticated', phone: '12015550123', email: 'shop@example.com', app_metadata: { provider: 'phone', providers: ['phone'] }, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
function session() {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const token = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: user.id, exp: now + 3600, iat: now, role: 'authenticated', aud: 'authenticated' })}.signature`;
  return { access_token: token, refresh_token: 'test-refresh-token', expires_in: 3600, expires_at: now + 3600, token_type: 'bearer', user };
}
async function mockService(page: Page, options: { staff?: boolean; initialStamps?: number; loseFirstResponse?: boolean } = {}) {
  let card: MemberCard = { member_code: code, stamps: options.initialStamps ?? 0, pending_stamps: 0, joined_at: '2026-01-01T00:00:00Z', total_drinks: 0, total_rewards: 0, activity: [] };
  const requests: string[] = [];
  const applied = new Set<string>();
  const authRequests: { path: string; body: Record<string, unknown> }[] = [];
  let dropped = false;
  await page.route('https://cocohodo-test.supabase.co/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const body = request.postDataJSON() ?? {};
    if (url.pathname.includes('/auth/')) authRequests.push({ path: url.pathname, body });
    const reply = (data: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
    if (url.pathname.endsWith('/otp')) return reply({});
    if (url.pathname.endsWith('/verify')) {
      if (body.token !== '123456') return reply({ msg: 'Token has expired or is invalid', error_code: 'otp_expired' }, 403);
      return reply(session());
    }
    if (url.pathname.endsWith('/token')) return reply(session());
    if (url.pathname.endsWith('/user')) return reply(user);
    if (url.pathname.endsWith('/logout')) return reply({});
    if (url.pathname.endsWith('/is_staff')) return reply(options.staff ?? false);
    if (url.pathname.endsWith('/get_my_card')) return reply(card);
    if (url.pathname.endsWith('/lookup_member')) {
      if (body.p_member_code !== code) return reply({ message: 'Member not found. Check the code and try again.', code: 'P0001' }, 400);
      return reply(card);
    }
    if (url.pathname.endsWith('/apply_loyalty_action')) {
      requests.push(body.p_request_id);
      if (!applied.has(body.p_request_id)) {
        if (body.p_kind === 'award') {
          const total = card.stamps + body.p_drinks;
          card = { ...card, stamps: Math.min(10, total), pending_stamps: Math.max(0, total - 10), total_drinks: card.total_drinks + body.p_drinks };
        } else {
          card = { ...card, stamps: Math.min(10, card.pending_stamps), pending_stamps: Math.max(0, card.pending_stamps - 10), total_rewards: card.total_rewards + 1 };
        }
        applied.add(body.p_request_id);
      }
      if (options.loseFirstResponse && !dropped) { dropped = true; return route.abort('failed'); }
      return reply(card);
    }
    return reply({ message: `Unexpected test request: ${url.pathname}` }, 500);
  });
  return { requests, authRequests, getCard: () => card, getApplied: () => applied.size };
}
async function staffLogin(page: Page) {
  await page.goto('/cashier/login');
  await page.getByLabel('Shop email').fill('shop@example.com');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/cashier$/);
}
async function findMember(page: Page) {
  await page.getByLabel('Member code', { exact: true }).fill(code);
  await page.getByRole('button', { name: 'Find member', exact: true }).click();
  await expect(page.getByText('Stamps collected', { exact: true })).toBeVisible();
}

test('phone sign-in handles invalid OTP and returning membership', async ({ page }) => {
  const service = await mockService(page, { initialStamps: 7 });
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Phone number').fill('(201) 555-0123');
  await page.getByRole('button', { name: 'Send me a code' }).click();
  await expect(page.getByRole('heading', { name: 'Enter your code' })).toBeVisible();
  expect(service.authRequests.find((r) => r.path.endsWith('/otp'))?.body.phone).toBe('+12015550123');
  await page.getByLabel('Verification code').fill('000000');
  await page.getByRole('button', { name: 'Verify & continue' }).click();
  await expect(page.locator('.notice')).toContainText('invalid or expired');
  await page.getByLabel('Verification code').fill('123456');
  await page.getByRole('button', { name: 'Verify & continue' }).click();
  await expect(page.getByLabel('7 out of 10 stamps')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('7 out of 10 stamps')).toBeVisible();
  await expect(page.getByText('PREVIEW', { exact: true })).toHaveCount(0);
});

test('unauthenticated cashier route returns to staff sign in', async ({ page }) => {
  await mockService(page);
  await page.goto('/cashier');
  await expect(page).toHaveURL(/\/cashier\/login$/);
});

test('nonstaff email account is denied the cashier station', async ({ page }) => {
  await mockService(page, { staff: false });
  await page.goto('/cashier/login');
  await page.getByLabel('Shop email').fill('customer@example.com');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('.notice')).toContainText('does not have cashier access');
  await expect(page).toHaveURL(/\/cashier\/login$/);
});

test('cashier awards overflow and confirms redemption', async ({ page }) => {
  const service = await mockService(page, { staff: true, initialStamps: 8 });
  await staffLogin(page); await findMember(page);
  await page.getByLabel('Eligible drinks purchased').fill('3');
  await expect(page.getByText('This completes their card.', { exact: false })).toContainText('1 extra stamps');
  await page.getByRole('button', { name: 'Confirm 3 stamps', exact: true }).click();
  await expect(page.getByText('Free drink ready', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Eligible drinks purchased')).toHaveCount(0);
  await page.getByRole('button', { name: 'Redeem free drink', exact: true }).click();
  await expect(page.getByText('Has the customer received their free drink?')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, redeem free drink' }).click();
  await expect(page.getByText('Stamps collected', { exact: true })).toBeVisible();
  expect(service.getCard().stamps).toBe(1);
  expect(service.getCard().pending_stamps).toBe(0);
  expect(service.getApplied()).toBe(2);
});

test('a lost response survives reload and retries the same transaction once', async ({ page }) => {
  const service = await mockService(page, { staff: true, loseFirstResponse: true });
  await staffLogin(page); await findMember(page);
  await page.getByRole('button', { name: 'Confirm 1 stamp', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Confirm saved transaction' })).toBeEnabled();
  await page.reload();
  await page.getByRole('button', { name: 'Confirm saved transaction' }).click();
  await expect(page.getByText('1 stamp added.', { exact: false })).toBeVisible();
  expect(service.requests).toHaveLength(2);
  expect(new Set(service.requests).size).toBe(1);
  expect(service.getApplied()).toBe(1);
  expect(service.getCard().stamps).toBe(1);
});

test('camera denial offers manual entry', async ({ page }) => {
  await mockService(page, { staff: true });
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: () => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')) });
  });
  await staffLogin(page);
  await page.getByRole('button', { name: 'Open scanner' }).click();
  await expect(page.locator('.camera-error')).toContainText('Camera access was denied');
  await findMember(page);
});

test('camera decodes a QR frame and releases the video stream', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Synthetic canvas video is tested in Chromium; physical Safari remains a launch check.');
  await mockService(page, { staff: true });
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { QRCodeSVG } = await import('qrcode.react');
  const svg = renderToStaticMarkup(createElement(QRCodeSVG, { value: `cocohodo:${code}`, size: 400, marginSize: 4 })).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  await page.addInitScript(({ svg }) => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => {
      const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 480;
      const context = canvas.getContext('2d')!;
      const image = new Image();
      image.src = `data:image/svg+xml;base64,${btoa(svg)}`;
      await image.decode();
      const draw = () => { context.fillStyle = '#fff'; context.fillRect(0, 0, 640, 480); context.drawImage(image, 120, 40, 400, 400); };
      draw();
      const stream = canvas.captureStream(10);
      const timer = setInterval(draw, 100);
      const track = stream.getVideoTracks()[0];
      const stop = track.stop.bind(track);
      track.stop = () => { clearInterval(timer); stop(); document.documentElement.dataset.cameraStopped = 'true'; };
      return stream;
    } });
  }, { svg });
  await staffLogin(page);
  await page.getByRole('button', { name: 'Open scanner' }).click();
  await expect(page.getByText('Stamps collected', { exact: true })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('html')).toHaveAttribute('data-camera-stopped', 'true');
  await expect(page.getByLabel('Eligible drinks purchased')).toBeVisible();
});
