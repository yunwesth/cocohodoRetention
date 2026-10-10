import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@cocohodo/ui'],
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  async redirects() {
    return [{ source: '/privacy-policy', destination: '/privacy/', permanent: true }];
  },
  trailingSlash: true,
};
export default config;
