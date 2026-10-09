import type { Metadata } from 'next';
import content from '../content/store.json';

export { content };
function origin(value: string | undefined, fallback: string) {
  const url = new URL(value || fallback);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Website origins must be HTTP(S) URLs without credentials.');
  return url.origin;
}
const local = process.env.NODE_ENV !== 'production';
export const siteOrigin = origin(process.env.NEXT_PUBLIC_SITE_URL, local ? 'http://localhost:3001' : 'https://njcocohodo.com');
export const rewardsOrigin = origin(process.env.NEXT_PUBLIC_REWARDS_URL, local ? 'http://localhost:3000' : 'https://app.njcocohodo.com');
export const rewardsLive = process.env.NEXT_PUBLIC_REWARDS_LIVE === 'true' && content.rewards.status === 'owner_confirmed';
export const publicLaunch = process.env.WEBSITE_PUBLIC_LAUNCH === 'true';
export const address = content.store.address.value;
export const addressLine = `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;
const hours = content.store.hours.value;
function clock(value: string) {
  const [h, m] = value.split(':').map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h >= 12 ? 'PM' : 'AM'}`;
}
export const hoursLine = `${hours.daysOpen[0]}–${hours.daysOpen.at(-1)} · ${clock(hours.opens)}–${clock(hours.closes)}`;
export const closedLine = `${hours.daysClosed.join(', ')} · Closed`;
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | Cocohodo Closter`, description, url: path, images: [{ url: '/photos/korean-walnut-pastry.webp', width: 1920, height: 1280, alt: 'Korean walnut pastries' }] } };
}
export const activeProviders = content.ordering.providers.filter((provider) => provider.enabledForProduction && !content.ordering.excludedProviderIds.includes(provider.id));
