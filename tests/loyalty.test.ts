import { describe, expect, it } from 'vitest';
import { friendlyError, normalizeMemberCode, normalizePhone, readableCode } from '../apps/rewards/lib/loyalty';

describe('phone sign-in input', () => {
  it.each(['2015550123', '(201) 555-0123', '+1 201 555 0123'])('normalizes %s', (phone) => {
    expect(normalizePhone(phone)).toBe('+12015550123');
  });
  it.each(['123', '+82 10 1234 5678', '1111111111', '2010550123'])('rejects %s', (phone) => {
    expect(() => normalizePhone(phone)).toThrow('valid 10-digit');
  });
});
describe('QR and manual member codes', () => {
  const code = 'ABCDEF0123456789ABCDEF0123456789';
  it('accepts the QR payload', () => expect(normalizeMemberCode(`cocohodo:${code.toLowerCase()}`)).toBe(code));
  it('accepts a copied, grouped code', () => expect(normalizeMemberCode(readableCode(code))).toBe(code));
  it.each(['', 'https://example.com', '+12015550123', 'cocohodo:1234'])('rejects invalid QR content', (value) => expect(() => normalizeMemberCode(value)).toThrow('not a COCOHODO'));
});
describe('recoverable error messages', () => {
  it('explains network failures', () => expect(friendlyError(new Error('Failed to fetch'))).toContain('internet connection'));
  it('explains expired codes', () => expect(friendlyError({ message: 'Token has expired or is invalid' })).toContain('invalid or expired'));
  it('explains expired sessions', () => expect(friendlyError({ message: 'JWT expired' })).toContain('sign in again'));
  it('explains throttling', () => expect(friendlyError({ message: 'SMS rate limit exceeded' })).toContain('wait a minute'));
});
