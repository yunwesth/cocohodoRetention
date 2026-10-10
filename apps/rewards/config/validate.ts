/** Reject privileged Supabase credentials before constructing a browser client. */
export function assertBrowserSafeKey(key: string): void {
  if (!key) return;
  if (key.startsWith('sb_secret_')) {
    throw new Error('Use a Supabase publishable key, never a secret key, in NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  }
  const payload = key.split('.')[1];
  if (!payload) return;
  let role: unknown;
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    role = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))).role;
  } catch {
    return; // Supabase reports malformed keys; do not log their value.
  }
  if (role === 'service_role') {
    throw new Error('A service-role key must never be used in browser configuration. Use the Supabase anon/publishable key.');
  }
}
