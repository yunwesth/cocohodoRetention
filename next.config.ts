import type { NextConfig } from 'next';
const config: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  // A separate output directory allows isolated browser tests with service mocks.
  distDir: process.env.COCOHODO_TEST_DIST_DIR || '.next',
};
export default config;
