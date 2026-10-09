const defaultOrigin = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://njcocohodo.com';
const configured = new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || defaultOrigin);
if (!['https:', 'http:'].includes(configured.protocol) || configured.username || configured.password) throw new Error('NEXT_PUBLIC_WEBSITE_URL must be an HTTP(S) origin without credentials.');
export const websiteOrigin = configured.origin;
