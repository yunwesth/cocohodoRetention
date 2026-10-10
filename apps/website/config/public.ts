import content from '../content/store.json';

function origin(value: string | undefined, fallback: string) {
  const url = new URL(value || fallback);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Website origins must be HTTP(S) URLs without credentials.');
  }
  return url.origin;
}
const local = process.env.NODE_ENV !== 'production';
export const siteOrigin = origin(process.env.NEXT_PUBLIC_SITE_URL, local ? 'http://localhost:3001' : 'https://njcocohodo.com');
export const rewardsOrigin = origin(process.env.NEXT_PUBLIC_REWARDS_URL, local ? 'http://localhost:3000' : 'https://app.njcocohodo.com');
export const rewardsLive = process.env.NEXT_PUBLIC_REWARDS_LIVE === 'true' && content.rewards.status === 'owner_confirmed';
