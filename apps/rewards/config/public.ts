import { assertBrowserSafeKey } from './validate';

// Static NEXT_PUBLIC references are required for Next.js browser inlining.
// Only the Supabase publishable/anon key belongs in this client configuration.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || '';
assertBrowserSafeKey(supabasePublishableKey);
export const publicConfig = Object.freeze({ supabaseUrl, supabasePublishableKey });
export const isConfigured = Boolean(supabaseUrl && supabasePublishableKey);

const defaultOrigin = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://njcocohodo.com';
const website = new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || defaultOrigin);
if (!['https:', 'http:'].includes(website.protocol) || website.username || website.password) {
  throw new Error('NEXT_PUBLIC_WEBSITE_URL must be an HTTP(S) origin without credentials.');
}
export const websiteOrigin = website.origin;
