import { afterAll, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { assertBrowserSafeKey } from '../apps/rewards/config/validate';

describe('browser credential boundary', () => {
  const jwt = (role: string) => `header.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.synthetic-signature`;
  it('accepts preview mode and a public anon key', () => {
    expect(() => assertBrowserSafeKey('')).not.toThrow();
    expect(() => assertBrowserSafeKey(jwt('anon'))).not.toThrow();
    expect(() => assertBrowserSafeKey('sb_publishable_' + 'synthetic-example')).not.toThrow();
  });
  it('rejects privileged Supabase keys without echoing their value', () => {
    for (const key of ['sb_secret_' + 'synthetic-example', jwt('service_role')]) {
      expect(() => assertBrowserSafeKey(key)).toThrow();
      try { assertBrowserSafeKey(key); } catch (error) {
        expect(String(error)).not.toContain(key);
      }
    }
  });
});

describe('environment files stay out of Git', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cocohodo-ignore-'));
  // Use a disposable repository to validate ignore rules independently of local Git state.
  execFileSync('git', ['init', '--quiet', directory]);
  writeFileSync(join(directory, '.gitignore'), readFileSync('.gitignore'));
  afterAll(() => rmSync(directory, { recursive: true, force: true }));
  function ignored(path: string) {
    const result = spawnSync('git', ['-C', directory, 'check-ignore', '--no-index', '--quiet', path]);
    expect([0, 1]).toContain(result.status);
    return result.status === 0;
  }
  it.each(['.env.local', '.env.production', 'apps/rewards/.env.local', 'apps/website/.env.local', 'apps/website/.env.production.local', 'packages/future/.env', 'production.env', 'apps/rewards/private.key'])('ignores %s', (path) => {
    expect(ignored(path)).toBe(true);
  });
  it.each(['.env.example', 'apps/rewards/.env.example', 'apps/website/.env.example'])('allows the safe template %s', (path) => {
    expect(ignored(path)).toBe(false);
    const credentials = readFileSync(path, 'utf8').split('\n').filter(line => /^(?:[A-Z_]*(?:KEY|SECRET|TOKEN|PASSWORD)|TEST_DATABASE_URL)=/.test(line));
    expect(credentials.every(line => line.split('=').slice(1).join('=').trim() === '')).toBe(true);
  });
});
