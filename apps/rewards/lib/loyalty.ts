export type Activity = {
  id: string;
  kind: 'award' | 'redeem';
  drinks: number;
  created_at: string;
};

export type MemberCard = {
  member_code: string;
  stamps: number;
  pending_stamps: number;
  joined_at: string;
  total_drinks: number;
  total_rewards: number;
  activity: Activity[];
};

export const previewCard: MemberCard = {
  member_code: 'C0C0D010A1B24C3D8E5F1029384756AB',
  stamps: 7, pending_stamps: 0, joined_at: '2026-09-01T12:00:00Z',
  total_drinks: 17, total_rewards: 1,
  activity: [
    { id: '1', kind: 'award', drinks: 2, created_at: '2026-09-27T13:42:00Z' },
    { id: '2', kind: 'award', drinks: 1, created_at: '2026-09-24T14:15:00Z' },
    { id: '3', kind: 'redeem', drinks: 0, created_at: '2026-09-20T16:30:00Z' },
  ],
};

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const national = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(national)) {
    throw new Error('Enter a valid 10-digit US phone number.');
  }
  return `+1${national}`;
}

export function normalizeMemberCode(input: string): string {
  const code = input.trim().replace(/^cocohodo:/i, '').replace(/[\s-]/g, '').toUpperCase();
  if (!/^[A-F0-9]{32}$/.test(code)) throw new Error('That is not a COCOHODO member code. Please try again.');
  return code;
}

export function readableCode(code: string): string {
  return code.match(/.{1,4}/g)?.join(' ') ?? code;
}

export function friendlyError(error: unknown): string {
  const message = typeof error === 'object' && error && 'message' in error ? String(error.message) : String(error);
  if (/fetch|network|offline/i.test(message)) return 'Could not connect. Check your internet connection and try again.';
  if (/JWT|session.*expired|not authenticated/i.test(message)) return 'Your session has expired. Please sign in again.';
  if (/rate limit|too many|security purposes/i.test(message)) return 'Please wait a minute before trying again.';
  if (/Token has expired|otp.*expired|invalid.*otp/i.test(message)) return 'That code is invalid or expired. Try again or request a new code.';
  if (/Invalid login credentials/i.test(message)) return 'The email or password is incorrect.';
  return message;
}
